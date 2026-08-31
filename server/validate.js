import { PHASES } from 'Domain/phases';
import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import { getMover } from 'Domain/snipeWindow';
import { areCoordsInList } from 'Domain/utils';
import {
	TOGGLE_PIECE,
	MOVE_PIECE,
	DIRECT_PIECE,
	SNIPE,
	CLAIM_CONTROL,
	CANCEL_CONTROL,
	REVEAL_FRIEND,
	REVEAL_FOE,
	ACCUSE,
	NEXT_TURN,
} from 'Game/actions';

// Everything a client sends is hostile until proven otherwise. Until now legality was enforced
// only by which hexagons the UI made clickable, which is no enforcement at all once the client
// is somebody else's browser.

const ALIGNMENTS = ['friend', 'foe'];
const TEAMS = ['0', '1', '2', '3'];

// Actions a seat may send during play. START_GAME and SET_ALIGNMENT are deliberately absent:
// the server owns starting a game and dealing cards, so a client can never ask for either.
const PLAY_ACTIONS = new Set([
	TOGGLE_PIECE,
	MOVE_PIECE,
	DIRECT_PIECE,
	SNIPE,
	CLAIM_CONTROL,
	CANCEL_CONTROL,
	REVEAL_FRIEND,
	REVEAL_FOE,
	ACCUSE,
	NEXT_TURN,
]);

function reject(reason) {
	return { ok: false, reason };
}

const ok = { ok: true };

function isCoords(value) {
	return Array.isArray(value) && value.length === 2 && value.every(n => Number.isInteger(n));
}

function isDirection(value) {
	return Array.isArray(value) && value.length === 2 && value.every(n => Number.isInteger(n));
}

function isPieceId(value, state) {
	return typeof value === 'string' && state.pieces.some(piece => piece.id === value);
}

// Shape first, so nothing unchecked reaches the reducer.
function validateShape(action, state) {
	switch (action.type) {
		case TOGGLE_PIECE:
			return isPieceId(action.payload?.pieceId, state) ? ok : reject('bad_piece_id');

		case MOVE_PIECE:
			if (!isPieceId(action.payload?.pieceId, state)) {
				return reject('bad_piece_id');
			}

			return isCoords(action.payload?.coords) ? ok : reject('bad_coords');

		case DIRECT_PIECE:
			return isDirection(action.payload) ? ok : reject('bad_direction');

		case CLAIM_CONTROL:
		case CANCEL_CONTROL:
			return TEAMS.includes(String(action.payload?.team)) ? ok : reject('bad_team');

		case ACCUSE: {
			const { accuser, accusee, alignment, team } = action.payload || {};

			if (!ALIGNMENTS.includes(alignment)) {
				return reject('bad_alignment');
			}

			if (!TEAMS.includes(String(team))) {
				return reject('bad_team');
			}

			if (!state.players.some(player => player.name === accusee)) {
				return reject('unknown_accusee');
			}

			return typeof accuser === 'string' ? ok : reject('bad_accuser');
		}

		default:
			return ok;
	}
}

// The snipe is the rest of the table's answer to the move that has just been made, so it is the
// one thing the player on turn may NOT do and everybody else may. Two actions carry it: arming it,
// and clicking the sniper that fires. Nothing else about a lit sniper is special — an ordinary
// toggle of an ordinary piece is still the turn holder's alone.
function isSnipeAction(action, state) {
	if (action.type === SNIPE) {
		return true;
	}

	if (action.type !== TOGGLE_PIECE) {
		return false;
	}

	// The domain's own reading of the shot, so what the server lets through and what the reducer
	// then does with it cannot come apart.
	return pz.isSnipeShot(state, action.payload?.pieceId);
}

// Legality, re-derived from the authoritative state with the same domain code the UI uses to
// decide what to highlight.
function validateLegality(action, state) {
	switch (action.type) {
		case MOVE_PIECE: {
			const highlighted = pz.getHighlightedPositions(state.pieces, state.pieceState);

			return areCoordsInList(action.payload.coords, highlighted) ? ok : reject('illegal_move');
		}

		case DIRECT_PIECE: {
			const selected = pz.getSelectedPiece(state.pieces);

			if (!selected) {
				return reject('no_selected_piece');
			}

			const possible = pz.getPossibleDirections(selected, state.pieces, state.pieceState);

			return areCoordsInList(action.payload, possible) ? ok : reject('illegal_direction');
		}

		// TOGGLE_PIECE, SNIPE, CLAIM_CONTROL and CANCEL_CONTROL need no check here: the domain
		// layer already returns the state unchanged when they are not allowed, so the worst a
		// client achieves by spamming them is a no-op.
		default:
			return ok;
	}
}

export function validateAction({ action, room, seat, turnGraceExpired = false }) {
	if (!action || typeof action.type !== 'string') {
		return reject('malformed_action');
	}

	if (room.phase !== PHASES.PLAY) {
		return reject('wrong_phase');
	}

	if (!PLAY_ACTIONS.has(action.type)) {
		return reject('action_not_allowed');
	}

	// Nearly the whole ownership model, in one rule. The game deliberately lets whoever is on turn
	// move any team's pieces, so there is nothing per-piece to check — only whose turn it is.
	const turnHolder = py.getTurn(room.state.players);
	const isSnipe = isSnipeAction(action, room.state);

	if (isSnipe) {
		// The exception, and it points the other way: a player cannot answer their own move. The
		// snipe belongs to every seat at the table except the one that provoked it — which is the
		// turn holder until the shot outlives their turn, and the mover after that.
		if (seat.name === getMover(room.state)) {
			return reject('not_your_snipe');
		}
	} else if (seat.name !== turnHolder) {
		// The other escape hatch: if the turn holder has been gone long enough, anyone may pass
		// the turn on, so a closed laptop cannot end the game permanently.
		const isForcedPass = action.type === NEXT_TURN && turnGraceExpired;

		if (!isForcedPass) {
			return reject('not_your_turn');
		}
	}

	if (action.type === ACCUSE && action.payload?.accuser !== seat.name) {
		return reject('accuser_mismatch');
	}

	const shape = validateShape(action, room.state);

	if (!shape.ok) {
		return shape;
	}

	return validateLegality(action, room.state);
}

// Token bucket per seat. DIRECT_PIECE is exempt because it is emitted at hover rate while
// aiming; the client throttles it and the server coalesces the snapshots it causes.
export function createRateLimiter({ perSecond = 30, burst = 60, now = () => Date.now() } = {}) {
	const buckets = new Map();

	return function allow(seatId, action) {
		if (action?.type === DIRECT_PIECE) {
			return true;
		}

		const at = now();
		const bucket = buckets.get(seatId) || { tokens: burst, at };
		const refilled = Math.min(burst, bucket.tokens + ((at - bucket.at) / 1000) * perSecond);

		if (refilled < 1) {
			buckets.set(seatId, { tokens: refilled, at });

			return false;
		}

		buckets.set(seatId, { tokens: refilled - 1, at });

		return true;
	};
}

export default validateAction;
