import { DEFAULT_SKIN } from 'Domain/skins';
import { redactFor } from './redact';

// One JSON envelope per message: { type, ...fields }. Deliberately small — the client is not
// trusted with anything except its own seat token.

export const MAX_MESSAGE_BYTES = 8 * 1024;

export const CLIENT = {
	CREATE: 'create',
	JOIN: 'join',
	REJOIN: 'rejoin',
	LEAVE: 'leave',
	LIST: 'list',
	START: 'start',
	READY: 'ready',
	SKIN: 'skin',
	ACTION: 'action',
	PING: 'ping',
};

export const SERVER = {
	SEAT: 'seat',
	ROOM: 'room',
	ROOMS: 'rooms',
	SNAPSHOT: 'snapshot',
	LEFT: 'left',
	REJECTED: 'rejected',
	ERROR: 'error',
	PONG: 'pong',
};

// Why a seat is no longer in a room. Two ways, and they need different words on screen: `you_left` is
// something the player did, `left_alone` is something that happened to them — the rest of the table
// went and a game of this needs two.
export const LEFT = {
	ASKED: 'you_left',
	ALONE: 'left_alone',
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
// Everything the finder shows, for the rooms a viewer is allowed to see. Deliberately not the room
// frame: this one is sent to sockets with no seat anywhere, so it carries no seat ids, no tokens and
// nothing about game state — only what is on the card you pick a table off.
export function roomsMessage({ rooms, total }) {
	return { type: SERVER.ROOMS, rooms, total };
}

export function roomMessage(room) {
	return {
		type: SERVER.ROOM,
		code: room.code,
		// The room's own name, and whether it is listed. Both public to the seats in the room by
		// definition — they are looking at the room — and both wanted in the waiting room, which is
		// where a host confirms they opened the table they meant to.
		name: room.name || room.code,
		private: Boolean(room.private),
		phase: room.phase,
		hostSeatId: room.hostSeatId,
		// The room's visual direction. Public by design and identical for every recipient: the
		// whole point is that the table looks like one table.
		skin: room.skin || DEFAULT_SKIN,
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

// The last thing a seat is told. It carries nothing else: whatever this client was holding is not
// theirs any more, and the room frame that would have said so is no longer addressed to them.
export function leftMessage(reason) {
	return { type: SERVER.LEFT, reason };
}

export function rejectedMessage({ seq, reason, version }) {
	return { type: SERVER.REJECTED, seq, reason, v: version };
}

export function errorMessage(reason) {
	return { type: SERVER.ERROR, reason };
}
