import { useEffect } from 'react';
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
