// The game's phases. Held here rather than in the client because the server is authoritative over
// which phase a room is in, and it sends these exact strings.
export const PHASES = {
	START: 'start',
	ALIGNMENT: 'alignment',
	PLAY: 'play',
	END: 'end',
};

export default PHASES;
