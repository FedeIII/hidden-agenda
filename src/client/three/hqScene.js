import {
	ExtrudeGeometry,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	RingGeometry,
	Scene,
	Shape,
	Vector3,
} from 'three';
import { SIZES } from './assets';
import addLights from './lighting';
import { COLUMN_PITCH, R, ROW_PITCH, slotKeyForPiece, storeSlots, TRAY_ELEVATION } from './layout';
import { HQ_TRAY } from './palette';
import createProjector, { boxStyle } from './view';
import createToken from './token';

// A team's HQ: the eight pieces it has not deployed yet, seated in a rack.
//
// The flat game paints the whole HQ card in a team colour and lays the store out on a hexgrid
// image. Both survive here — the rack is tinted to the team and the sockets are the same cluster
// of one, two, three, two — but the tint moves off the card and onto the object, so the card can
// become a frame and let the rack show through it.

const SOCKET_RADIUS = SIZES.tokenRadius * 1.18;
const DECK_DEPTH = R * 0.55;
const MARGIN = R * 0.8;
// Generous, so the deck's own edges are always outside the crop. A rack that ends inside its
// panel reads as a slab someone left there; one that runs off every side reads as the panel.
const BLEED = R * 9;

// The stage clamps whatever it is given to the element's own box, so "everything" says itself.
const WHOLE_BOX = { left: 0, top: 0, right: Infinity, bottom: Infinity };

const DECK_BEVEL = R * 0.09;

function roundedPlate(width, depth, radius, height) {
	const shape = new Shape();
	const halfWidth = width / 2 - radius;
	const halfDepth = depth / 2 - radius;

	shape.moveTo(-halfWidth, -halfDepth - radius);
	shape.lineTo(halfWidth, -halfDepth - radius);
	shape.quadraticCurveTo(halfWidth + radius, -halfDepth - radius, halfWidth + radius, -halfDepth);
	shape.lineTo(halfWidth + radius, halfDepth);
	shape.quadraticCurveTo(halfWidth + radius, halfDepth + radius, halfWidth, halfDepth + radius);
	shape.lineTo(-halfWidth, halfDepth + radius);
	shape.quadraticCurveTo(-halfWidth - radius, halfDepth + radius, -halfWidth - radius, halfDepth);
	shape.lineTo(-halfWidth - radius, -halfDepth);
	shape.quadraticCurveTo(-halfWidth - radius, -halfDepth - radius, -halfWidth, -halfDepth - radius);

	const geometry = new ExtrudeGeometry(shape, {
		depth: height,
		bevelEnabled: true,
		bevelThickness: DECK_BEVEL,
		bevelSize: DECK_BEVEL,
		bevelSegments: 2,
		curveSegments: 4,
	});

	// Extrude builds in XY and grows along +z; the board's world has y up. And a bevelled extrude
	// runs from -bevelThickness to depth + bevelThickness, not 0 to depth — so the deck has to come
	// down by the bevel as well as by its own height, or its top face sits above y = 0 and quietly
	// swallows every socket, collar and contact shadow laid on the surface it is supposed to be.
	geometry.rotateX(-Math.PI / 2);
	geometry.translate(0, -(height + DECK_BEVEL), 0);

	return geometry;
}

function hexRing(inner, outer) {
	const geometry = new RingGeometry(inner, outer, 6, 1, Math.PI / 2);
	geometry.rotateX(-Math.PI / 2);

	return geometry;
}

// Four trays differ only in colour, so the shapes are cut once for the page and the materials
// once per team. three.js has no cascade disposal; the less a scene owns, the less can leak.
const shared = {};

function sharedAsset(key, build) {
	if (!shared[key]) {
		shared[key] = build();
	}

	return shared[key];
}

export default function createHqScene(team) {
	const scene = new Scene();
	const colours = HQ_TRAY[team];

	addLights(scene, { key: 1.5, rim: 0.7, fill: 0.55 });

	const slots = storeSlots();

	const extentX = Math.max(...slots.map(slot => Math.abs(slot.x))) + COLUMN_PITCH / 2;
	const extentZ = Math.max(...slots.map(slot => Math.abs(slot.z))) + ROW_PITCH / 2;

	// The deck runs past what has to stay on screen, so the rack reads as a panel the view is
	// cropping rather than a slab floating in the middle of one.
	const deck = new Mesh(
		sharedAsset('deck', () =>
			roundedPlate(2 * (extentX + MARGIN) + BLEED, 2 * (extentZ + MARGIN) + BLEED, R * 0.5, DECK_DEPTH),
		),
		sharedAsset(
			`deckMaterial-${team}`,
			() => new MeshStandardMaterial({ color: colours.deck, roughness: 0.55, metalness: 0.4 }),
		),
	);
	scene.add(deck);

	for (const slot of slots) {
		// A socket is a dark hexagon with a bright lip. Actually cutting a recess out of the deck
		// would cost a hole in the geometry for something a token sits in and hides anyway.
		const well = new Mesh(
			sharedAsset('well', () => hexRing(0, SOCKET_RADIUS)),
			sharedAsset(
				`wellMaterial-${team}`,
				() => new MeshBasicMaterial({ color: colours.socket, transparent: true, opacity: 0.85, depthWrite: false }),
			),
		);
		const lip = new Mesh(
			sharedAsset('lip', () => hexRing(SOCKET_RADIUS * 0.9, SOCKET_RADIUS)),
			sharedAsset(
				`lipMaterial-${team}`,
				() => new MeshStandardMaterial({ color: colours.frame, roughness: 0.35, metalness: 0.7 }),
			),
		);

		well.position.set(slot.x, 0.004, slot.z);
		lip.position.set(slot.x, 0.008, slot.z);
		// The sockets are laid out as a pointy-top cluster, but a token is flat topped, so its
		// socket is too — the lip has to be the shape of the thing that goes in it.
		well.rotation.y = Math.PI / 6;
		lip.rotation.y = Math.PI / 6;

		scene.add(well, lip);
	}

	// Both corners at both heights — see boardScene: raising a point moves it towards the camera,
	// so a fit that only bounded the deck would not have bounded the tokens standing on it.
	const bounds = [];
	for (const slot of slots) {
		for (const y of [0, SIZES.tokenHeight]) {
			bounds.push(
				new Vector3(slot.x - COLUMN_PITCH / 2, y, slot.z - ROW_PITCH / 2),
				new Vector3(slot.x + COLUMN_PITCH / 2, y, slot.z + ROW_PITCH / 2),
			);
		}
	}

	const projector = createProjector({ bounds, padding: 0.03, elevation: TRAY_ELEVATION });
	const byKey = new Map(slots.map(slot => [slot.key, slot]));
	const tokens = new Map();
	let signature = null;

	return {
		scene,
		camera: projector.camera,

		resize(width, height) {
			projector.resize(width, height);
		},

		// The board is fitted by width and floats in whatever height its box has, so it tells the
		// renderer to scissor down to what it actually paints. A tray is the opposite: the deck is
		// built to run off all four sides, so the part of it worth drawing is the whole box.
		extent: () => WHOLE_BOX,

		layout() {
			const boxes = {};

			for (const slot of slots) {
				boxes[slot.key] = boxStyle(projector, slot.x, slot.z, 0, COLUMN_PITCH / 2, ROW_PITCH / 2);
			}

			return boxes;
		},

		/**
		 * @returns whether anything visible changed, which decides whether this tray repaints.
		 *
		 * Every dispatch hands the whole state tree a new identity, so without this a claim on the
		 * far side of the board redraws all four trays and the board — five scenes for a change
		 * that touched none of them. A store only cares which pieces are still in it and whether
		 * one of them is picked up.
		 */
		setState({ pieces }) {
			const next = pieces.map(piece => `${piece.id}${piece.selected ? '!' : ''}`).join();

			if (next === signature) {
				return false;
			}

			signature = next;

			const stored = new Set();

			for (const piece of pieces) {
				const slot = byKey.get(slotKeyForPiece(piece.id));

				if (!slot) {
					continue;
				}

				stored.add(piece.id);

				if (!tokens.has(piece.id)) {
					const token = createToken(piece.id);

					tokens.set(piece.id, token);
					scene.add(token.object);
				}

				tokens.get(piece.id).set({
					x: slot.x,
					z: slot.z,
					// Undeployed pieces have no facing. The flat store draws them upright too.
					direction: undefined,
					selected: piece.selected,
					snipe: false,
					buffed: false,
				});
			}

			for (const [pieceId, token] of tokens) {
				if (!stored.has(pieceId)) {
					scene.remove(token.object);
					token.dispose();
					tokens.delete(pieceId);
				}
			}

			return true;
		},

		update(delta) {
			let animating = false;

			for (const token of tokens.values()) {
				if (token.update(delta)) {
					animating = true;
				}
			}

			return animating;
		},

		dispose() {
			for (const token of tokens.values()) {
				token.dispose();
			}
			tokens.clear();
		},
	};
}
