import { pz } from 'Domain/pieces';
import { isAnsweringTurnHolder } from 'Domain/snipeWindow';
import { TOGGLE_PIECE, MOVE_PIECE, DIRECT_PIECE, NEXT_TURN, SNIPE, CLAIM_CONTROL, CANCEL_CONTROL } from 'Game/actions';

function toggledPieceState(state, pieceId) {
	return pz.toggle(state, pieceId);
}

function movedPieceState({ pieces, pieceState }, { pieceId, coords }) {
	return pz.move(pieces, pieceId, coords, pieceState);
}

function directedPieceState(pieces, direction) {
	return pz.changeSelectedPieceDirection(pieces, direction);
}

// The marks a shot is read from outlive the turn that made them: whoever is handed the turn has
// until they move something. So this NEXT_TURN keeps them when it is the one passing the shot on,
// and the next one wipes them — the same window snipeWindowReducer keeps the shot itself open for,
// asked of the same predicate so the marks and the shot cannot survive different lengths of time.
//
// The other way they go is the mover's own move, which pz.move wipes them in.
function nextTurnState(state) {
	const pieces = isAnsweringTurnHolder(state) ? state.pieces : pz.removeIsThroughSniperLine(state.pieces);

	return pieces.map(pz.setCeoBuffs);
}

// SNIPE is a toggle: pressing it lines the shot up, pressing it again puts it away. `state` is
// the board before the action, so `state.snipe` is whether one was already being lined up.
function snipeState({ pieces, snipe }) {
	return snipe ? pz.clearSniperSights(pieces) : pz.highlightSnipersWithSight(pieces);
}

function claimControlState(payload, state) {
	const { team } = payload;
	return pz.claimControl(team, state);
}

function cancelControlState(payload, state) {
	const { team } = payload;
	return pz.cancelControl(team, state);
}

function piecesReducer(state, action) {
	switch (action.type) {
		case TOGGLE_PIECE:
			return [...toggledPieceState(state, action.payload.pieceId)];
		case MOVE_PIECE:
			return [...movedPieceState(state, action.payload)];
		case DIRECT_PIECE:
			return [...directedPieceState(state.pieces, action.payload)];
		case NEXT_TURN:
			return [...nextTurnState(state)];
		case SNIPE:
			return [...snipeState(state)];
		case CLAIM_CONTROL:
			return [...claimControlState(action.payload, state)];
		case CANCEL_CONTROL:
			return [...cancelControlState(action.payload, state)];
		default:
			return state.pieces;
	}
}

export default piecesReducer;
