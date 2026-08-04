// The game's phases. Held here rather than in the client because the server is authoritative over
// which phase a room is in, and it sends these exact strings.
export const PHASES = {
	START: 'start',
	ALIGNMENT: 'alignment',
	PLAY: 'play',
	END: 'end',
};

// What a room looks like from *outside* it, in the public list: either it is still filling up or the
// cards have been dealt. Four phases collapse to two because that is the only distinction somebody
// scanning the list can act on — a room in `lobby` has a seat for them, a room that has `started`
// does not, and the one place that decides which is which is here rather than at both ends of the
// wire.
export const ROOM_STATES = {
	LOBBY: 'lobby',
	STARTED: 'started',
};

export function roomStateFor(phase) {
	return phase === PHASES.START ? ROOM_STATES.LOBBY : ROOM_STATES.STARTED;
}

export default PHASES;
