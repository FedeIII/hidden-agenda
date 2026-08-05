import { isPlayerIdShaped } from 'Domain/rating';

// The id this browser is rated under.
//
// Kept beside the seat tokens and the player's name for the same reason they are: it outlives every
// component that asks for it. Unlike them, it is never typed and never shown — it is minted once, on
// the first visit that needs it, and after that it is the only thing tying two games played in this
// browser to the same rating.
//
// **A rating therefore belongs to a browser, not a person.** Clearing storage is starting again; a
// phone and a laptop are two players. That is the price of a game nobody has to register for, and it
// is worth being straight about rather than pretending otherwise: the way to carry a rating between
// two browsers is to copy this id into the other one, which also means anybody it is given to can
// play as you.
//
// It is a bearer credential for a rating and nothing else. The server never uses it to decide who may
// act, or which seat a socket holds — that is the seat token's job, and it stays the only authority.

const ID_KEY = 'ha:player';

// Three attempts, in descending order of how much the value can be trusted to be unguessable.
//
// `randomUUID` is restricted to secure contexts, and the one that matters here is not exotic: opening
// the dev server on a phone over the LAN — `http://192.168.x.x:3017` — is exactly how this game gets
// tested on a touchscreen, and there `crypto.randomUUID` is simply undefined. `getRandomValues` is not
// restricted, so it covers that case with the same quality of randomness.
function mint() {
	const source = window.crypto;

	if (source?.randomUUID) {
		return source.randomUUID();
	}

	if (source?.getRandomValues) {
		return [...source.getRandomValues(new Uint8Array(16))].map(byte => byte.toString(16).padStart(2, '0')).join('');
	}

	// No crypto at all. Guessable in principle, which for a rating on a hex game is a cost worth
	// paying to have one at all.
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * This browser's id, minting one the first time.
 *
 * `null` when storage is unavailable — private browsing, or a locked-down browser. That is not an
 * error state to handle: a seat with no id simply plays unrated, and the rest of the table is rated
 * amongst themselves.
 */
export function readPlayerId() {
	try {
		const stored = window.localStorage.getItem(ID_KEY);

		if (isPlayerIdShaped(stored)) {
			return stored;
		}

		const minted = mint();

		window.localStorage.setItem(ID_KEY, minted);

		return minted;
	} catch {
		return null;
	}
}

export default readPlayerId;
