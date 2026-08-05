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
	QUEUE: 'queue',
	UNQUEUE: 'unqueue',
	PING: 'ping',
};

export const SERVER = {
	SEAT: 'seat',
	ROOM: 'room',
	ROOMS: 'rooms',
	QUEUED: 'queued',
	SNAPSHOT: 'snapshot',
	LEFT: 'left',
	RATED: 'rated',
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

// How an automatch search is going, for the one socket doing it. `searching: false` is how a client is
// told to stop waiting — on cancelling, and also when another tab of the same browser takes over the
// search, which is otherwise a spinner that never resolves.
export function queuedMessage({ searching = false, waiting = 0, elapsed = 0, window = null, mmr = null } = {}) {
	return { type: SERVER.QUEUED, searching, waiting, elapsed, window, rating: mmr };
}

// `ratingFor` is passed in rather than imported for the same reason `rooms.js` takes it: this module
// builds frames and knows nothing about where a rating comes from. A caller with nothing to look up
// gets seats with a null rating, which is what the lobby shows as the starting number.
export function roomMessage(room, ratingFor = () => null) {
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
		// The rating each seat plays under. Public to the table by design — knowing who you have drawn is
		// half of what a rating is for — and note what is *not* here: the playerId it was looked up by.
		seats: room.seats.map(({ id, name, ready, connected, playerId }) => ({
			id,
			name,
			ready,
			connected,
			rating: ratingFor(playerId),
		})),
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

/**
 * What a game did to the ratings of the people who were in it.
 *
 * Its own frame rather than fields on the room: it is the outcome of one event rather than a fact about
 * the room, and the room frame is broadcast for a dozen other reasons.
 *
 * **The playerId is dropped here, and that is the point of this function existing.** A rating id is a
 * bearer credential — anybody holding it can play as its owner — so it is the one thing about a seat
 * that must never reach another seat. `room.ratings` keeps it, because that never leaves the server.
 */
export function ratedMessage({ code, ratings = [] }) {
	return {
		type: SERVER.RATED,
		code,
		// Named `ratings` on the way in to match the field it is read from — `room.ratings`, where a
		// finished game's result is kept so a refresh can be told again.
		players: ratings.map(({ name, before, after, delta }) => ({ name, before, after, delta })),
	};
}

export function rejectedMessage({ seq, reason, version }) {
	return { type: SERVER.REJECTED, seq, reason, v: version };
}

// `detail` carries the few facts a refusal needs to be actionable — the seconds left on a cooldown,
// say — so the client can say something better than the reason string.
export function errorMessage(reason, detail = null) {
	return { type: SERVER.ERROR, reason, ...detail };
}
