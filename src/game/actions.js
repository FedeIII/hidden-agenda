export const START_GAME = 'START_GAME';
export function startGame(players) {
	return {
		type: START_GAME,
		payload: players,
	};
}

export const SET_ALIGNMENT = 'SET_ALIGNMENT';
export function setAlignment({ name, friend, foe }) {
	return {
		type: SET_ALIGNMENT,
		payload: { name, friend, foe },
	};
}

export const NEXT_TURN = 'NEXT_TURN';
export function nextTurn() {
	return {
		type: NEXT_TURN,
	};
}

export const TOGGLE_PIECE = 'TOGGLE_PIECE';
export function togglePiece(pieceId) {
	return {
		type: TOGGLE_PIECE,
		payload: { pieceId },
	};
}

export const MOVE_PIECE = 'MOVE_PIECE';
export function movePiece(pieceId, coords) {
	return {
		type: MOVE_PIECE,
		payload: { pieceId, coords },
	};
}

export const DIRECT_PIECE = 'DIRECT_PIECE';
export function directPiece(direction) {
	return {
		type: DIRECT_PIECE,
		payload: direction,
	};
}

export const SNIPE = 'SNIPE';
export function snipe() {
	return {
		type: SNIPE,
	};
}

export const CLAIM_CONTROL = 'CLAIM_CONTROL';
export function claimControl(playerName, team) {
	return {
		payload: { playerName, team },
		type: CLAIM_CONTROL,
	};
}

export const CANCEL_CONTROL = 'CANCEL_CONTROL';
export function cancelControl(team) {
	return {
		payload: { team },
		type: CANCEL_CONTROL,
	};
}

// These two used to carry the whole players array as their payload, and the reducers read the
// players from there rather than from state. Over a network that payload is both redundant and
// forgeable — a client whose view of the players is redacted would send the wrong one, and a
// hostile one could send whatever it liked. They carry nothing now; the reducers use state.
export const REVEAL_FRIEND = 'REVEAL_FRIEND';
export function revealFriend() {
	return {
		type: REVEAL_FRIEND,
	};
}

export const REVEAL_FOE = 'REVEAL_FOE';
export function revealFoe() {
	return {
		type: REVEAL_FOE,
	};
}

export const ACCUSE = 'ACCUSE';
export function accuse({ accuser, accusee, alignment, team }) {
	return {
		payload: { accuser, accusee, alignment, team },
		type: ACCUSE,
	};
}

// Replaces the entire state with a server snapshot. Handled above the slice reducers.
export const SYNC_STATE = 'SYNC_STATE';
export function syncState(state) {
	return {
		payload: state,
		type: SYNC_STATE,
	};
}
