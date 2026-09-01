// Where a piece was last seen, and which one is currently in the air.
//
// A token in flight crosses scenes: it leaves an HQ tray, which is one view with its own camera,
// and lands on the board, which is another. Neither can draw into the other's rectangle, so
// nothing can literally travel between them — instead the board draws the whole journey, starting
// from wherever the piece was last on screen, and the tray simply stops drawing it.
//
// That needs exactly two pieces of shared state, and they live here rather than in either scene
// because both of them, and the drag controller above them, have to agree.

const seen = new Map();

/** In viewport pixels: the centre of wherever this piece is currently drawn. */
export function noteScreenPosition(pieceId, x, y) {
	seen.set(pieceId, { x, y });
}

export function lastScreenPosition(pieceId) {
	return seen.get(pieceId);
}

/**
 * WHERE EACH TEAM'S HQ IS
 *
 * The same problem as above, in the other direction. A piece that has just been killed is carried
 * off to the HQ of whoever killed it, and the board draws that journey too — so it has to know
 * where a tray it cannot see is on the page. Each tray writes its own centre; the board reads it,
 * turns it back into a point on its own plane, and flies the corpse there.
 *
 * A team with no tray on screen simply has no entry, and the board lets the corpse go where it
 * stands instead. Nothing here can be missing in a way that breaks anything.
 */

const headquarters = new Map();

/** In viewport pixels: the centre of this team's rack. */
export function noteHqPosition(team, x, y) {
	headquarters.set(`${team}`, { x, y });
}

export function hqPosition(team) {
	return headquarters.get(`${team}`);
}

/**
 * DRAGGING
 */

let dragging = null;
const listeners = new Set();

export function onDragChange(listener) {
	listeners.add(listener);

	return () => listeners.delete(listener);
}

// The piece being dragged is drawn once, by the board, following the pointer. Everyone else — the
// tray it came out of — is told to leave it alone, or it would be in two places at once.
export function setDragging(pieceId) {
	if (dragging === pieceId) {
		return;
	}

	dragging = pieceId;

	for (const listener of listeners) {
		listener(dragging);
	}
}

export function getDragging() {
	return dragging;
}

/**
 * THE BOARD'S HAND
 *
 * The drag controller sits above the whole app and the board scene is mounted somewhere below it,
 * so the board publishes its own hand here on mount and takes it back on unmount. A module
 * singleton rather than a context: there is only ever one board, and threading a ref through four
 * components to say so would be the more complicated answer, not the simpler one.
 */

let hand = null;

export function setHand(next) {
	hand = next;
}

export function getHand() {
	return hand;
}
