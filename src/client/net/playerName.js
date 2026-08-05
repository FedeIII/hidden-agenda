// The name this browser plays under.
//
// Kept beside the seat tokens rather than in a component, because it outlives every component that
// asks for it: the lobby is mounted again after every game, after leaving a room, after a refresh at
// the front door — and typing the same six letters each time is the sort of small tax that makes a
// game feel like a form. It is a preference, not state: nothing depends on it, and losing it costs a
// player nothing but the typing.
//
// Written when the *server* confirms a seat rather than on every keystroke, so what comes back is a
// name that actually worked — not a half-typed one, and not one the room refused as already taken.

const NAME_KEY = 'ha:name';
// The same ceiling the lobby's field and the server's isNameShaped use. Read back defensively anyway:
// storage is shared with whatever this origin held before, including older builds of this game.
const MAX_NAME_LENGTH = 16;

export function readPlayerName() {
	try {
		const stored = window.localStorage.getItem(NAME_KEY);

		return typeof stored === 'string' && stored.trim() ? stored.trim().slice(0, MAX_NAME_LENGTH) : null;
	} catch {
		// Private browsing, or storage disabled. The field simply opens empty, as it always did.
		return null;
	}
}

export function rememberPlayerName(name) {
	if (typeof name !== 'string' || !name.trim()) {
		return;
	}

	try {
		window.localStorage.setItem(NAME_KEY, name.trim().slice(0, MAX_NAME_LENGTH));
	} catch {
		// As above: a convenience, never a dependency.
	}
}

export default readPlayerName;
