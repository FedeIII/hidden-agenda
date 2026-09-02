// Where a piece's picture comes from, for every renderer that draws one.
//
// The name is stable — `img/{team}-{type}.png`, plus `-{v}{h}` for a piece that is facing
// somewhere — and that is on purpose: it is what lets the flat board, the 3D board's face texture,
// the cemetery tally and the points legend all ask for the same file. Stable names are also why
// nginx serves `/img/` with `max-age=604800` instead of the year `/assets/` gets. Nothing here is
// content-hashed, so a browser and a Cloudflare edge each hold their own copy for a week.
//
// Which is fine until the art itself changes under a name that did not. v3.25.0 swapped the black
// and white teams' faces between `0-*.png` and `2-*.png`, and without this a returning player would
// have kept the old pair for seven more days while getting the new bundle — the two teams' HQs
// would have been repainted around tokens that had not moved. The query string is part of the cache
// key both caches actually use, so bumping it is what ships new art on the day it is released.
//
// **Bump ART_VERSION whenever a file in `public/img` changes.** It is not the app's version and does
// not have to track it; it only has to differ from the last value that shipped.
export const ART_VERSION = '3.25.0';

export function artSrc(team, type, [v, h] = []) {
	const facing = typeof v === 'undefined' || typeof h === 'undefined' ? '' : `-${v}${h}`;

	return `img/${team}-${type}${facing}.png?v=${ART_VERSION}`;
}
