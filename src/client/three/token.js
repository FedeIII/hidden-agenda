import { Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry, MathUtils } from 'three';
import { pz } from 'Domain/pieces';
import {
	createTokenMaterials,
	getCollarGeometry,
	getCollarMaterial,
	getProwGeometry,
	getFadeTexture,
	getTokenGeometry,
	SIZES,
} from './assets';
import killMove, { CHANNELS } from './killMoves';
import { directionToAngle } from './layout';
import { BUFF, SELECTED, SHADOW, SNIPE } from './palette';
import { prefersReducedMotion } from './stage';

// One piece, in 3D: a chip with a collar, a nose, a contact shadow, and the halo that says a CEO
// is standing next to it.
//
// Almost everything a token has to say it says with light rather than movement. The exception is
// selection, which lifts the chip off the board — the state a player checks most often and the
// one the flat renderer says least clearly, since brightness(2) on a near-black token is barely a
// signal at all. Lifting is safe to animate because nothing about where the token *is* decides
// what a click hits: the invisible DOM box a click lands on is projected from the cell's resting
// centre and never moves.

const LIFT = SIZES.tokenHeight * 1.2;

// A carried piece rides higher than a selected one — high enough to read as being off the board
// and in the player's hand, and to clear the tokens it is passing over.
export const CARRY_LIFT = SIZES.tokenHeight * 3.4;

// Selection should feel immediate; a buff is ambient and can arrive after the eye has finished
// with the move. Rates, not durations — frame-rate independent, nothing to get wrong, and they
// settle rather than stop, which is what gives a chip weight.
const RATE = { lift: 22, travel: 10, turn: 16, glow: 14, halo: 6 };

// How high a piece rides while it is still on its way, as a fraction of the distance it has left.
// A piece coming out of an HQ lofts right across the table and settles as it arrives; a piece
// moving one cell barely leaves the board. Nothing has to decide which is which — the arc is a
// function of the distance, so it lands exactly when the travel does.
const ARC = 0.42;

// How close is close enough to stop. An exponential approach never quite arrives, and chasing the
// last thousandth of a board unit — a fiftieth of a pixel — keeps every view redrawing for half a
// second after the eye has finished. Settling early is free and, on a software rasteriser, is the
// difference between a responsive board and a slow one.
const SETTLED = 0.004;

// Slower than a heartbeat. At 1.5Hz this reads as an alarm; at 0.8 it reads as an invitation.
const SNIPE_PULSE_HZ = 0.8;

// A kill is armed by the state change and played when the piece ARRIVES, so an agent's press is
// the sound of it landing rather than something it did on the way over. This is how close counts
// as arrived — four percent of a cell, which a one-cell move reaches in about a third of a second.
const KILL_ARRIVED = SIZES.tokenRadius * 0.09;

// And this is how long it will wait for that. A killer travels one cell and a sniper does not move
// at all, so the wait is normally a third of a second or none — but a piece picked up on the frame
// its kill was armed would never arrive at all, and something that reports itself as animating
// forever stops the frame loop ever settling.
const KILL_HOLD = 0.9;

// What one unit of each channel is worth in the scene. The table in killMoves.js is deliberately
// free of any of this: it says how far in the channel's own terms, and here is where a token
// height, a degree and a token radius become board units.
const KILL_SCALE = {
	[CHANNELS.SINK]: SIZES.tokenHeight,
	[CHANNELS.TWIST]: Math.PI / 180,
	[CHANNELS.KICK]: SIZES.tokenRadius,
	[CHANNELS.SWELL]: 1,
};

let shadowGeometry;
let haloGeometry;

function getShadowGeometry() {
	if (!shadowGeometry) {
		shadowGeometry = new PlaneGeometry(SIZES.tokenRadius * 3.2, SIZES.tokenRadius * 3.2);
		shadowGeometry.rotateX(-Math.PI / 2);
	}

	return shadowGeometry;
}

function getHaloGeometry() {
	if (!haloGeometry) {
		haloGeometry = new PlaneGeometry(SIZES.tokenRadius * 4, SIZES.tokenRadius * 4);
		haloGeometry.rotateX(-Math.PI / 2);
	}

	return haloGeometry;
}

function approach(from, to, rate, delta) {
	if (prefersReducedMotion()) {
		return to;
	}

	return from + (to - from) * (1 - Math.exp(-rate * delta));
}

const selectedGlow = new Color(SELECTED);
const snipeGlow = new Color(SNIPE);

export default function createToken(pieceId) {
	const { face, chamfer, wall } = createTokenMaterials(pieceId);
	const team = pz.getTeam(pieceId);

	const group = new Group();

	// Everything that turns and lifts hangs off this; everything that lies flat on the tile does
	// not, so a shadow never tilts and a halo never rises.
	const rig = new Group();
	group.add(rig);

	const chip = new Mesh(getTokenGeometry(), [face, chamfer, wall]);
	const collar = new Mesh(getCollarGeometry(), getCollarMaterial(team));
	// The nose takes the chamfer's material, so it catches selection and a lit sniper with the
	// rest of the bright band rather than staying stubbornly dull in the middle of it.
	const prow = new Mesh(getProwGeometry(), chamfer);
	prow.visible = false;

	rig.add(chip, collar, prow);

	const shadow = new Mesh(
		getShadowGeometry(),
		new MeshBasicMaterial({
			map: getFadeTexture(),
			color: SHADOW,
			transparent: true,
			depthWrite: false,
			opacity: 0.8,
		}),
	);
	shadow.position.y = 0.012;
	shadow.renderOrder = -2;
	group.add(shadow);

	// The CEO buff changes how the pieces around it move and is invisible in the flat game. A warm
	// halo under the chip costs one transparent quad and answers the question without a legend.
	// Deliberately a soft filled disc where every other tile-level state is a hard-edged ring:
	// shape carries the difference, so a buffed piece on a legal cell is never ambiguous.
	const halo = new Mesh(
		getHaloGeometry(),
		new MeshBasicMaterial({
			map: getFadeTexture(),
			color: new Color(BUFF),
			transparent: true,
			depthWrite: false,
			opacity: 0,
		}),
	);
	halo.position.y = 0.02;
	halo.renderOrder = -3;
	halo.visible = false;
	group.add(halo);

	const current = { lift: 0, glow: 0, halo: 0, angle: 0, x: 0, z: 0, placed: false };
	const wanted = { lift: 0, glow: 0, halo: 0, angle: 0, x: 0, z: 0 };

	let pulsing = false;
	let clock = 0;
	// The kill in hand, if any: the move this piece's type makes, how far into it we are, and
	// whether it is still waiting for the piece to finish travelling before it starts.
	let killing = null;
	let killClock = 0;
	let killWaiting = false;
	// The last thing it was told, so the hand can pick the piece up and put it down again without
	// having to know anything else about it.
	let told = { x: 0, z: 0 };

	return {
		pieceId,
		object: group,

		/**
		 * Puts the piece somewhere at once, with no travel: how a carried token follows the pointer,
		 * and how one that has just been picked up starts from where it was picked up rather than
		 * from wherever it happened to be standing.
		 */
		placeAt(x, z, lift = 0) {
			current.x = x;
			current.z = z;
			current.lift = lift;
			current.placed = true;

			wanted.x = x;
			wanted.z = z;
			wanted.lift = lift;
		},

		/** How far it still has to travel, in board units. */
		distanceToGo() {
			return Math.hypot(current.x - wanted.x, current.z - wanted.z);
		},

		/**
		 * Where the piece is and what is true of it. Called on every state change, never per frame
		 * — what happens between one call and the next is this token's own business.
		 */
		state() {
			return told;
		},

		set(next) {
			const { x, z, direction, selected, snipe, buffed, immediate, carried } = next;

			told = next;
			wanted.x = x;
			wanted.z = z;
			// Three.js turns anticlockwise about +y; the board's directions are compass bearings,
			// which turn the other way. The angles themselves are the same six the flat renderer
			// writes into a CSS rotate() — both take them from layout.js.
			wanted.angle = MathUtils.degToRad(-directionToAngle(direction));
			wanted.lift = carried ? CARRY_LIFT : selected ? LIFT : 0;
			wanted.glow = selected || snipe ? 1 : 0;
			wanted.halo = buffed ? 0.32 : 0;

			prow.visible = !!direction;
			pulsing = !!snipe;
			chamfer.emissive.copy(snipe ? snipeGlow : selectedGlow);

			// A token appearing for the first time — deployed out of an HQ, or the board rebuilt
			// after a rejoin — has nowhere to have come from, so it does not travel.
			if (immediate || !current.placed) {
				current.x = x;
				current.z = z;
				current.angle = wanted.angle;
				current.placed = true;
			}

			// Turning the short way round: rewind the current angle to whichever turn of the
			// circle sits nearest the wanted one. Without it a piece going from up-left to
			// up-right takes the 300 degree route.
			current.angle += Math.PI * 2 * Math.round((wanted.angle - current.angle) / (Math.PI * 2));
		},

		/**
		 * This piece has just taken another one off the board.
		 *
		 * Armed rather than played: the move waits for the travel to finish, so the whole thing is
		 * one gesture — the piece arrives on the cell and marks it — instead of two overlapping
		 * ones. A sniper does not travel, so its recoil starts on the next frame.
		 *
		 * @param type the KILLER's type. The move depends on that and on nothing else.
		 */
		kill(type) {
			// The same withdrawal the travel, the lift and the sniper's pulse make: a player who
			// has asked their system for less movement gets none of this either.
			if (prefersReducedMotion()) {
				return;
			}

			const move = killMove(type);

			if (!move) {
				return;
			}

			killing = move;
			killClock = 0;
			killWaiting = true;
		},

		/** @returns true while there is still something left to draw. */
		update(delta) {
			clock += delta;

			current.x = approach(current.x, wanted.x, RATE.travel, delta);
			current.z = approach(current.z, wanted.z, RATE.travel, delta);
			current.lift = approach(current.lift, wanted.lift, RATE.lift, delta);
			current.angle = approach(current.angle, wanted.angle, RATE.turn, delta);
			current.halo = approach(current.halo, wanted.halo, RATE.halo, delta);

			const beat = pulsing && !prefersReducedMotion();
			const glow = beat ? 0.775 + 0.225 * Math.sin(clock * SNIPE_PULSE_HZ * Math.PI * 2) : wanted.glow;
			current.glow = approach(current.glow, glow, RATE.glow, delta);

			const restless =
				Math.abs(current.x - wanted.x) > SETTLED ||
				Math.abs(current.z - wanted.z) > SETTLED ||
				Math.abs(current.lift - wanted.lift) > SETTLED ||
				Math.abs(current.angle - wanted.angle) > SETTLED ||
				Math.abs(current.halo - wanted.halo) > SETTLED ||
				Math.abs(current.glow - glow) > SETTLED;

			// Snapped before drawing rather than left a hair short, so the last frame drawn is the
			// exact one the values were asked for and there is never a need for one more.
			if (!restless) {
				current.x = wanted.x;
				current.z = wanted.z;
				current.lift = wanted.lift;
				current.angle = wanted.angle;
				current.halo = wanted.halo;
				current.glow = glow;
			}

			// The whole flight, in one line: the further it still has to go, the higher it is.
			const left = Math.hypot(current.x - wanted.x, current.z - wanted.z);
			const hop = Math.min(left * ARC, CARRY_LIFT);
			const height = current.lift + hop;

			// A kill in hand: hold it until the piece has all but arrived, then run it once. The
			// wait is bounded, because a token that says it is animating and never finishes is a
			// frame loop that never settles.
			if (killing) {
				killClock += delta;

				if (killWaiting && (left <= KILL_ARRIVED || killClock >= KILL_HOLD)) {
					killWaiting = false;
					killClock = 0;
				}

				if (!killWaiting && killClock >= killing.seconds) {
					killing = null;
				}
			}

			// Every move is one channel and every channel rests at zero, so what is not this
			// piece's own is simply not added. Nothing here touches group.position: that is what
			// the flight reads to start a token from where it was last drawn, and what the tray it
			// came out of is told. The rig is the part that lifts and turns.
			const playing = killing && !killWaiting ? killing : null;
			const move = playing
				? playing.curve(killClock / playing.seconds) * playing.amount * KILL_SCALE[playing.channel]
				: 0;
			const channel = playing ? playing.channel : null;
			const twist = channel === CHANNELS.TWIST ? move : 0;
			const kick = channel === CHANNELS.KICK ? move : 0;

			group.position.set(current.x, 0, current.z);
			// Backwards along its own bearing. The nose is local north (-z) and the yaw carries it
			// round, so the way it is facing is (-sin, -cos) and the way it recoils is the other.
			rig.position.set(
				kick * Math.sin(current.angle),
				height + (channel === CHANNELS.SINK ? move : 0),
				kick * Math.cos(current.angle),
			);
			rig.rotation.y = current.angle + twist;
			rig.scale.setScalar(1 + (channel === CHANNELS.SWELL ? move : 0));
			chamfer.emissiveIntensity = current.glow * 0.85;

			// The shadow spreads and lightens as the chip comes up, which is the cheapest possible
			// cue that it is off the board rather than merely bright — and the whole cue that a
			// carried piece is being held over the board rather than sitting on it.
			const settled = Math.max(0, 1 - height / LIFT);
			shadow.material.opacity = 0.45 + 0.35 * settled;
			shadow.scale.setScalar(1 + Math.min(height / LIFT, 3) * 0.35);

			halo.visible = current.halo > 0.005;
			halo.material.opacity = current.halo;

			return beat || restless || !!killing;
		},

		dispose() {
			chamfer.dispose();
			wall.dispose();
			shadow.material.dispose();
			halo.material.dispose();
		},
	};
}
