// What a room is called, and how one gets named when nobody types anything.
//
// Held in `domain` for the same reason `skins.js` is: the name travels in the room frame and in the
// public list, so the server validates this exact shape and the client draws the default from the
// same two lists. A four-character code is what you *type*; a name is what you can read out over a
// phone and pick out of a list of forty, which is the whole reason the finder needs one.

// Two lists rather than one, so the cross product is big enough that two tables opened in the same
// minute are very unlikely to collide — 60 × 60 is 3600 names. Names are not unique and are not
// enforced to be: the code is still the identity, the name is only a label.
const ADJECTIVES = [
	'secret',
	'hidden',
	'silent',
	'quiet',
	'cunning',
	'ruthless',
	'patient',
	'restless',
	'nameless',
	'faceless',
	'double',
	'crooked',
	'loyal',
	'wary',
	'invisible',
	'sleeping',
	'burning',
	'frozen',
	'broken',
	'gilded',
	'hollow',
	'velvet',
	'brittle',
	'candid',
	'careless',
	'discreet',
	'elusive',
	'forged',
	'guarded',
	'idle',
	'jaded',
	'keen',
	'lonely',
	'masked',
	'nervous',
	'obscure',
	'polite',
	'reckless',
	'sealed',
	'shadowed',
	'sly',
	'sombre',
	'stolen',
	'sunken',
	'tangled',
	'unseen',
	'vacant',
	'veiled',
	'watchful',
	'wounded',
	'absent',
	'bitter',
	'clever',
	'deadly',
	'eager',
	'false',
	'grim',
	'humble',
	'impatient',
	'unlucky',
];

const NOUNS = [
	'agent',
	'spy',
	'traitor',
	'courier',
	'handler',
	'mole',
	'cipher',
	'dossier',
	'envelope',
	'ledger',
	'whisper',
	'rumour',
	'alias',
	'briefcase',
	'keyhole',
	'lantern',
	'matchbook',
	'notebook',
	'passport',
	'postcard',
	'signal',
	'stamp',
	'telegram',
	'typewriter',
	'umbrella',
	'vault',
	'wireless',
	'safehouse',
	'sniper',
	'chauffeur',
	'diplomat',
	'informant',
	'defector',
	'custodian',
	'gatekeeper',
	'interpreter',
	'janitor',
	'librarian',
	'locksmith',
	'messenger',
	'minister',
	'nightwatch',
	'operator',
	'photographer',
	'quartermaster',
	'receptionist',
	'secretary',
	'sentry',
	'steward',
	'switchboard',
	'telephonist',
	'understudy',
	'waiter',
	'watchman',
	'cartographer',
	'bookkeeper',
	'clockmaker',
	'tailor',
	'translator',
	'stenographer',
];

export const MIN_ROOM_NAME_LENGTH = 3;
export const MAX_ROOM_NAME_LENGTH = 24;

/**
 * Draws a room name: one word from each list, hyphenated — `secret-agent`, `cunning-traitor`.
 *
 * Takes an `rng` for the same reason `pickSkin` and `deal` do: the server calls it with its own when
 * a client sends no name at all, and a spec needs the draw to be deterministic.
 */
export function pickRoomName(rng = Math.random) {
	const adjective = ADJECTIVES[Math.floor(rng() * ADJECTIVES.length) % ADJECTIVES.length];
	const noun = NOUNS[Math.floor(rng() * NOUNS.length) % NOUNS.length];

	return `${adjective}-${noun}`;
}

/**
 * Trims, and collapses runs of spaces and hyphens to a single space or hyphen.
 *
 * Applied before storing rather than only before comparing, so the list never shows two rooms whose
 * names differ by whitespace nobody can see.
 */
export function normaliseRoomName(value) {
	if (typeof value !== 'string') {
		return '';
	}

	return value.trim().replace(/\s+/g, ' ').replace(/-+/g, '-');
}

// Letters, digits, spaces and hyphens only. Nothing here is ever rendered as markup, but a name is
// read by every player in the list and shows up in search — punctuation and control characters only
// buy somebody a way to make a room hard to name out loud.
export function isRoomNameShaped(value) {
	const name = normaliseRoomName(value);

	return (
		name.length >= MIN_ROOM_NAME_LENGTH &&
		name.length <= MAX_ROOM_NAME_LENGTH &&
		/^[A-Za-z0-9][A-Za-z0-9 -]*$/.test(name)
	);
}

// Spaces and hyphens are the same separator as far as searching goes, so somebody who reads
// `secret-agent` off a screen and types `secret agent` still finds it.
function searchable(value) {
	return normaliseRoomName(value).toLowerCase().replace(/-/g, ' ');
}

export function matchesRoomQuery(name, query) {
	const needle = searchable(query);

	return needle.length === 0 || searchable(name).includes(needle);
}

export { ADJECTIVES, NOUNS };

export default pickRoomName;
