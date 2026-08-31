import py from 'Domain/py';

/**
 * The shot the table is still owed.
 *
 * `null` when there is none. Otherwise `{ pieces, player }` — the board the shot rolls back to, and
 * the player whose move it answers.
 *
 * It exists because a shot outlives the turn it was provoked in. The marks are made during one
 * player's turn and stay readable until the next player actually moves something, so from the moment
 * NEXT TURN is pressed neither of those two facts can be read off the board any more:
 *
 * - **The rollback board.** `piecesPrevState` is the board as the CURRENT turn found it, and every
 *   "did this turn change anything" question in the game is asked against it. Freezing it for the
 *   sake of a pending shot would tell the player who has just been handed the turn that they had
 *   already moved — NEXT TURN would light up for them and putting a sniper back down would spend
 *   their turn. So the shot carries its own snapshot instead, and `piecesPrevState` keeps its
 *   meaning exactly.
 * - **Who may not fire.** The snipe belongs to everyone except the player being answered, and once
 *   the turn has passed that is no longer the player on turn. Reading it off `py.getTurn` would let
 *   the mover answer their own move the instant they pressed NEXT TURN, and refuse the shot to the
 *   one seat that has done nothing at all.
 *
 * Nothing here knows about sockets or React: the server runs the same reducer over the same slice.
 */

// Opened by the move that made the marks — piecesPrevState is that turn's own snapshot, and the
// player on turn is the one whose move is being answered.
export function open(state) {
	return { pieces: state.piecesPrevState, player: py.getTurn(state.players) };
}

/**
 * Whether the shot on the table answers the move of whoever is holding the turn right now.
 *
 * Two rules read this one fact, and they have to agree.
 *
 * It is what firing spends a turn on: the mover's action is undone and play moves on, so the shot
 * ends their turn. A shot taken after they passed it on ends nothing — the player holding the turn
 * now has not moved yet, and taking the turn off them for answering somebody else's move would be a
 * punishment for using the button.
 *
 * And it is what a NEXT_TURN keeps the shot alive through. The shot survives exactly one: the seat
 * it is handed to has until they move. Once the turn has already left the player being answered,
 * passing it on again is the end of it — which is also what closes the window when a disconnected
 * seat is passed over by the server rather than moving.
 */
export function isAnsweringTurnHolder(state) {
	return !!state.snipeWindow && state.snipeWindow.player === py.getTurn(state.players);
}

/**
 * The one seat the snipe is refused to: the player whose move it answers.
 *
 * That is the player on turn while the shot is being lined up inside their own turn, and stays that
 * player after they have handed the turn on. With no shot on the table there is nothing to answer,
 * so the turn holder stands in and the rule reads as it always did — pressing SNIPE with nothing
 * marked lines nothing up either way.
 */
export function getMover(state) {
	return (state.snipeWindow && state.snipeWindow.player) || py.getTurn(state.players);
}

export default { open, isAnsweringTurnHolder, getMover };
