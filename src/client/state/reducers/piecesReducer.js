import { pz } from 'Domain/pieces';
import {
	TOGGLE_PIECE,
	MOVE_PIECE,
	DIRECT_PIECE,
	NEXT_TURN,
	SNIPE,
	CLAIM_CONTROL,
	CANCEL_CONTROL,
} from 'Client/actions';

function toggledPieceState(state, pieceId) {
	return pz.toggle(state, pieceId);
}

function movedPieceState({ pieces, pieceState }, { pieceId, coords }) {
	return pz.move(pieces, pieceId, coords, pieceState);
}

function directedPieceState(pieces, direction) {
	return pz.changeSelectedPieceDirection(pieces, direction);
}

function nextTurnState(pieces) {
	return pz.removeIsThroughSniperLine(pieces).map(pz.setCeoBuffs);
}

function snipeState(pieces) {
	return pz.highlightSnipersWithSight(pieces);
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
			return [...nextTurnState(state.pieces)];
		case SNIPE:
			return [...snipeState(state.pieces)];
		case CLAIM_CONTROL:
			return [...claimControlState(action.payload, state)];
		case CANCEL_CONTROL:
			return [...cancelControlState(action.payload, state)];
		default:
			return [...state.pieces];
	}
}

export default piecesReducer;
