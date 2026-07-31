import { PHASES } from 'Domain/phases';
import { pz } from 'Domain/pieces';
import { gameReducer } from 'Game/reducer';
import { validateAction } from './validate';

// validate -> reduce -> bump version -> derive phase. Nothing else may write room.state.

export const TURN_GRACE_MS = 60_000;

// The turn holder being disconnected for a while is the one case where a seat may act out of
// turn, and only to pass the turn on.
export function isTurnGraceExpired(room, { now = () => Date.now() } = {}) {
	const turnHolderName = room.state.players.find(player => player.turn)?.name;
	const turnHolder = room.seats.find(seat => seat.name === turnHolderName);

	if (!turnHolder || turnHolder.connected) {
		return false;
	}

	return now() - turnHolder.lastSeenAt >= TURN_GRACE_MS;
}

export function applyAction(room, seat, action, { now = () => Date.now() } = {}) {
	const verdict = validateAction({
		action,
		room,
		seat,
		turnGraceExpired: isTurnGraceExpired(room, { now }),
	});

	if (!verdict.ok) {
		return { ok: false, reason: verdict.reason, version: room.version };
	}

	room.state = gameReducer(room.state, action);
	room.version += 1;
	room.updatedAt = now();

	// The end of the game is derived, not announced: three dead CEOs and it is over. Once the
	// phase is END the server stops redacting, because scoring needs every alignment.
	if (pz.hasGameFinished(room.state.pieces)) {
		room.phase = PHASES.END;
	}

	return { ok: true, version: room.version };
}

export default applyAction;
