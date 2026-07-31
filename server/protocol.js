import { redactFor } from './redact';

// One JSON envelope per message: { type, ...fields }. Deliberately small — the client is not
// trusted with anything except its own seat token.

export const MAX_MESSAGE_BYTES = 8 * 1024;

export const CLIENT = {
	CREATE: 'create',
	JOIN: 'join',
	REJOIN: 'rejoin',
	START: 'start',
	READY: 'ready',
	ACTION: 'action',
	PING: 'ping',
};

export const SERVER = {
	SEAT: 'seat',
	ROOM: 'room',
	SNAPSHOT: 'snapshot',
	REJECTED: 'rejected',
	ERROR: 'error',
	PONG: 'pong',
};

export function parseMessage(raw) {
	if (typeof raw !== 'string' || raw.length > MAX_MESSAGE_BYTES) {
		return { error: 'message_too_large' };
	}

	try {
		const message = JSON.parse(raw);

		if (!message || typeof message.type !== 'string') {
			return { error: 'malformed_message' };
		}

		return { message };
	} catch {
		return { error: 'malformed_message' };
	}
}

// A seat's own credentials. The token is the only secret the client holds, and it is what makes
// a refresh survivable.
export function seatMessage(room, seat) {
	return {
		type: SERVER.SEAT,
		code: room.code,
		seatId: seat.id,
		token: seat.token,
		name: seat.name,
	};
}

// Who is in the room and what it is doing. Names and connection state are public by design;
// alignments never appear here.
export function roomMessage(room) {
	return {
		type: SERVER.ROOM,
		code: room.code,
		phase: room.phase,
		hostSeatId: room.hostSeatId,
		seats: room.seats.map(({ id, name, ready, connected }) => ({ id, name, ready, connected })),
	};
}

export function snapshotMessage(room, seat) {
	return {
		type: SERVER.SNAPSHOT,
		v: room.version,
		phase: room.phase,
		// How far this seat's own actions have been applied, so the client can drop the ones it
		// has confirmation for and re-apply the rest on top.
		ack: seat.ackSeq || 0,
		state: redactFor(seat.name, room.state, room.phase),
	};
}

export function rejectedMessage({ seq, reason, version }) {
	return { type: SERVER.REJECTED, seq, reason, v: version };
}

export function errorMessage(reason) {
	return { type: SERVER.ERROR, reason };
}
