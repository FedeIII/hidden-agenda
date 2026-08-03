import { useCallback, useEffect } from 'react';
import { PHASES } from 'Domain/phases';
import { DEFAULT_SKIN } from 'Domain/skins';
import useSession from './useSession';

// Which direction the interface is dressed in, and the one place that fact reaches the DOM.
//
// The skin lives on the session in both modes, so this hook has no branch in it: locally the
// transport assigns one when the table goes in to look at its cards, and online the server picks
// it when the room is made and every client receives it in the same `room` frame. That is what
// makes "everyone at the table sees the same thing" true by construction rather than by agreement.
export default function useSkin() {
	const session = useSession();

	return session.skin || DEFAULT_SKIN;
}

// Stamped on <html> rather than on a wrapper because the ground and its texture belong on the
// document: the WebGL canvas is a sibling of .game and sits *under* it, so a background anywhere
// inside the app would be a filter over everything the renderer drew.
export function useSkinAttribute(skin) {
	useEffect(() => {
		document.documentElement.dataset.skin = skin;
	}, [skin]);
}

// The draw stands, and the host may overrule it — up to the point where the game starts.
//
// Two windows, and they are the two where nobody is reading anybody: the waiting room, and the
// friend-and-foe cards. Once the board is up the furniture stops moving. A player mid-turn is
// holding a mental model of four teams and somebody else's face, and re-dressing the table under
// them is not a courtesy.
//
// Hot-seat has no host because it has no seats — one screen, one mouse, and who reaches for it is a
// rule between the people in the room, exactly as it is for the snipe.
export function useCanChangeSkin() {
	const session = useSession();

	if (session.mode === 'local') {
		return session.phase === PHASES.ALIGNMENT;
	}

	if (session.status !== 'ready' || !session.seatId) {
		return false;
	}

	const inWindow = session.phase === PHASES.START || session.phase === PHASES.ALIGNMENT;

	return inWindow && session.seatId === session.hostSeatId;
}

export function useSetSkin() {
	const session = useSession();
	const { setSkin } = session.actions;

	return useCallback(skin => setSkin(skin), [setSkin]);
}
