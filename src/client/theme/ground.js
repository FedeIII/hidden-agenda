// What each direction has lying around the board.
//
// The ground is the one surface in the app that is not the game: `html` carries it (see
// globalStyle.js for why it may never be inside `.game`), the alignment screen borrows it, and the
// whole interface floats on it. So it is where a direction gets to say what kind of place this is —
// a desk, a drawing, a case — without touching a single thing a player clicks.
//
// Each direction exports four lists that MUST stay the same length and the same order: the images,
// their sizes, their positions and their repeats. CSS cycles a short list rather than complaining, so
// a missing entry does not fail — it silently gives layer four layer one's position. skin.test.js
// counts them.
//
// Nothing here may decide where a hexagon lands, and nothing here is ever pointed at: these are
// background layers on the document, under everything, and the props are drawn at the opacity of a
// watermark rather than of a photograph. They are atmosphere, and they must lose every legibility
// argument with the board.

// A background layer, encoded so that stylis cannot swallow the stylesheet.
//
// styled-components v4 preprocesses with stylis, which strips `//` as a line comment and cannot cope
// with a bare `(` inside a quoted url(). Either one eats the rest of the declaration *and* the
// closing brace of its block — the next skin's block and the whole `html` rule are then nested inside
// it, every custom property still resolves, every control still looks right, and the page has no
// ground at all. Nothing throws.
//
// So nothing in this file is hand-encoded. `asset()` does it: encodeURIComponent covers the slashes,
// the angle brackets and the hashes, and the two round brackets it deliberately leaves alone (both
// are legal in a URI) are replaced after it. A data URI is percent-decoded before the SVG is parsed,
// so the markup arrives exactly as written.
export function asset(markup) {
	const encoded = encodeURIComponent(markup.replace(/\s+/g, ' ').trim()).replace(/\(/g, '%28').replace(/\)/g, '%29');

	return `url("data:image/svg+xml,${encoded}")`;
}

// The namespace is not optional in a data URI — without it the browser parses the markup as XML,
// finds no SVG in it, and paints nothing at all.
const svg = (width, height, body) =>
	asset(`<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${body}</svg>`);

// ── DOSSIER: the desk ─────────────────────────────────────────────────────────────────────────
// The board is the blotter in the middle of somebody's desk, and this is the rest of the desk: the
// file that is already open, the pens that were put down, the coffee that went cold, and the phone
// the call came in on. Every prop is cropped by the edge of the screen the way a thing on a real desk
// is cropped by the edge of a photograph — none of them is centred, and none of them is whole.

// Two sheets, one on top of the other, typed and part-redacted. The one thing on the desk that is
// actually readable, and it says nothing: every name on it is blacked out.
const DOCUMENTS = svg(
	330,
	290,
	`<g transform='rotate(-9 165 145)'>
		<rect x='26' y='36' width='192' height='218' fill='#2c2620' fill-opacity='0.05'
			stroke='#2c2620' stroke-opacity='0.14'/>
		<rect x='44' y='60' width='120' height='2' fill='#2c2620' fill-opacity='0.09'/>
		<rect x='44' y='76' width='150' height='2' fill='#2c2620' fill-opacity='0.09'/>
		<rect x='44' y='92' width='96' height='2' fill='#2c2620' fill-opacity='0.09'/>
	</g>
	<g transform='rotate(5 165 145)'>
		<rect x='64' y='42' width='196' height='224' fill='#fff8e6' fill-opacity='0.17'
			stroke='#2c2620' stroke-opacity='0.2'/>
		<text x='80' y='72' font-family='monospace' font-size='13' letter-spacing='2.4'
			fill='#2c2620' fill-opacity='0.32'>MEMORANDUM</text>
		<rect x='80' y='80' width='116' height='1.5' fill='#2c2620' fill-opacity='0.26'/>
		<text x='80' y='104' font-family='monospace' font-size='9.5' letter-spacing='1.4'
			fill='#2c2620' fill-opacity='0.26'>SUBJECT ██████████</text>
		<text x='80' y='120' font-family='monospace' font-size='9.5' letter-spacing='1.4'
			fill='#2c2620' fill-opacity='0.26'>FROM ███████ ██</text>
		<g fill='#2c2620' fill-opacity='0.13'>
			<rect x='80' y='144' width='164' height='1.5'/>
			<rect x='80' y='156' width='150' height='1.5'/>
			<rect x='80' y='168' width='168' height='1.5'/>
			<rect x='80' y='180' width='118' height='1.5'/>
			<rect x='80' y='192' width='158' height='1.5'/>
		</g>
		<g transform='rotate(-5 196 222)'>
			<rect x='150' y='206' width='92' height='32' fill='none'
				stroke='#a3282b' stroke-opacity='0.34' stroke-width='2'/>
			<text x='196' y='227' text-anchor='middle' font-family='monospace' font-size='11'
				letter-spacing='2' fill='#a3282b' fill-opacity='0.34'>EYES ONLY</text>
		</g>
	</g>`,
);

// A fountain pen and a pencil, put down across each other. Neither is capped.
const PENS = svg(
	300,
	230,
	`<g transform='rotate(-22 150 115)' stroke='#2c2620' stroke-opacity='0.22' stroke-width='1.5'>
		<g fill='#6a5834' fill-opacity='0.22'>
			<rect x='42' y='96' width='188' height='16' rx='2'/>
			<rect x='230' y='94' width='15' height='20' rx='1'/>
			<rect x='245' y='96' width='14' height='16' rx='4'/>
		</g>
		<path d='M42 96 L16 104 L42 112 Z' fill='#6a5834' fill-opacity='0.3'/>
		<path d='M16 104 L25 101 L25 107 Z' fill='#2c2620' fill-opacity='0.45'/>
	</g>
	<g transform='rotate(16 150 115)' stroke='#2c2620' stroke-opacity='0.28' stroke-width='1.5'>
		<g fill='#2c2620' fill-opacity='0.2'>
			<rect x='56' y='131' width='152' height='18' rx='9'/>
			<rect x='94' y='129' width='11' height='22' rx='2'/>
			<rect x='68' y='125' width='5' height='13' rx='2.5'/>
		</g>
		<path d='M208 131 L254 140 L208 149 Z' fill='#2c2620' fill-opacity='0.28'/>
		<path d='M232 140 L254 140' stroke-opacity='0.5'/>
	</g>`,
);

// The desk telephone, from above: the handset still in its cradle, the dial, and the cord running off
// across the desk. Ten holes, because a rotary dial has ten and a player who has seen one will count.
const DIAL_HOLES = Array.from({ length: 10 }, (_, hole) => {
	const angle = ((hole * 30 - 66) * Math.PI) / 180;

	return `<circle cx='${(150 + 34 * Math.cos(angle)).toFixed(1)}' cy='${(150 + 34 * Math.sin(angle)).toFixed(1)}' r='7'/>`;
}).join('');

const TELEPHONE = svg(
	300,
	260,
	`<g transform='rotate(-5 150 130)' stroke='#2c2620' stroke-opacity='0.26' stroke-width='2'>
		<rect x='36' y='92' width='228' height='116' rx='20' fill='#2c2620' fill-opacity='0.08'/>
		<circle cx='150' cy='150' r='47' fill='#2c2620' fill-opacity='0.05'/>
		<circle cx='150' cy='150' r='17' fill='#2c2620' fill-opacity='0.1'/>
		<g fill='#c9b083' fill-opacity='0.16' stroke-opacity='0.2' stroke-width='1.5'>${DIAL_HOLES}</g>
		<path d='M150 197 A47 47 0 0 0 189 176' fill='none' stroke-opacity='0.34' stroke-width='3'/>
		<g fill='#2c2620' fill-opacity='0.12'>
			<rect x='34' y='58' width='232' height='34' rx='17'/>
			<circle cx='60' cy='75' r='23'/>
			<circle cx='240' cy='75' r='23'/>
		</g>
		<path d='M264 168 q14 -18 28 0 q14 18 28 0 q14 -18 28 0' fill='none' stroke-opacity='0.2'/>
	</g>`,
);

// The cup, from above, and the two rings it left before somebody moved it.
const MUG = svg(
	280,
	250,
	`<g fill='none' stroke='#2c2620'>
		<path d='M212 106 c30 -8 30 44 0 36' stroke-opacity='0.24' stroke-width='2.5'/>
		<circle cx='150' cy='124' r='62' fill='#2c2620' fill-opacity='0.06'
			stroke-opacity='0.26' stroke-width='2.5'/>
		<circle cx='150' cy='124' r='51' stroke-opacity='0.2'/>
		<circle cx='150' cy='124' r='45' fill='#2c2620' fill-opacity='0.16' stroke-opacity='0'/>
		<circle cx='78' cy='196' r='42' stroke-opacity='0.13' stroke-width='2'/>
		<circle cx='46' cy='148' r='35' stroke-opacity='0.09' stroke-width='2'/>
	</g>`,
);

export const DESK = {
	// Paint order, and it is the order of a desk: the file is on top of everything, the pens are on
	// top of the phone, the lamp light washes over all of it, and the grain of the desk is underneath.
	wash: [
		DOCUMENTS,
		PENS,
		TELEPHONE,
		MUG,
		`radial-gradient(140% 110% at 8% -8%, rgba(255, 250, 235, 0.5), transparent 55%)`,
		`repeating-linear-gradient(97deg, rgba(120, 92, 48, 0.055) 0 2px, transparent 2px 6px)`,
	].join(',\n\t\t'),
	// min() of a length and a viewport unit, so a prop is a prop on a laptop and does not become the
	// whole screen on a phone. `auto` on the two gradients: a gradient has no intrinsic size and fills
	// its box, which is what both of them want.
	//
	// The four props sit in the four corners because that is where this interface leaves the ground
	// showing: the two columns of team cards take the middle band on both sides, and the strip and the
	// action bar take the top and the bottom. A prop is deliberately allowed off the edge — a desk is
	// bigger than the part of it you can see.
	size: `min(300px, 30vmin), min(280px, 28vmin), min(285px, 29vmin), min(215px, 22vmin), auto, auto`,
	position: `left -3vmin top -2vmin,
		right -1vmin bottom -1vmin,
		left -4vmin bottom -3vmin,
		right 0 top -3vmin,
		left top,
		left top`,
	repeat: `no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat`,
};

// ── BLUEPRINT: the drawing ────────────────────────────────────────────────────────────────────
// Unchanged in look, and no longer hand-encoded — it was the reason `asset()` exists.
const WATERMARK = svg(
	760,
	420,
	`<text x='380' y='230' text-anchor='middle' transform='rotate(-24 380 230)' font-family='monospace'
		font-size='27' letter-spacing='9' fill='#ffffff' fill-opacity='0.06'>PROPERTY OF ██████ INDUSTRIES</text>`,
);

export const DRAWING = {
	wash: [
		WATERMARK,
		`radial-gradient(120% 100% at 50% -10%, rgba(255, 255, 255, 0.07), transparent 60%)`,
		`repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px)`,
		`repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px)`,
	].join(',\n\t\t'),
	// The watermark tiles at its own size, the way a print's does. The grid is two repeating gradients
	// and has always tiled itself.
	size: `auto, auto, auto, auto`,
	position: `left top, left top, left top, left top`,
	repeat: `repeat, no-repeat, repeat, repeat`,
};

// ── VAULT: the case ───────────────────────────────────────────────────────────────────────────
// If the board is the tray, the screen is the case it is fitted into — so what is around it is the
// lining: die-cut foam with the spare pieces still in it, markings stencilled up both inside walls,
// and the maker's plate riveted where a plate goes. The case was issued to somebody, and the plate
// will not say who.

// Markings stencilled up the inside wall, cut into the metal rather than printed on it: the same
// letters twice, dark and offset by a pixel, then light on top.
const WALL_TEXT = `PROPERTY OF ██████ · FIELD SET 04 OF 12 · DO NOT REMOVE FROM ROOM`;

const WALL = svg(
	150,
	900,
	`<g transform='rotate(-90 75 450)' font-family='monospace' font-size='16' letter-spacing='5'
		text-anchor='middle'>
		<text x='75' y='452' fill='#05070a' fill-opacity='0.45'>${WALL_TEXT}</text>
		<text x='75' y='450' fill='#ffffff' fill-opacity='0.09'>${WALL_TEXT}</text>
	</g>`,
);

// Die-cut foam, cut to the shape of the pieces. Flat-top hexagons, because that is the tile the game
// is played on and this is the case that tile came in. Three of the six recesses are still full.
const FOAM_CELLS = [
	[74, 76, true],
	[146, 76, false],
	[218, 76, true],
	[110, 138, false],
	[182, 138, false],
	[146, 200, true],
];

const foamHex = (cx, cy, full) => {
	const rim = `M${cx - 34} ${cy} L${cx - 17} ${cy - 29} L${cx + 17} ${cy - 29} L${cx + 34} ${cy} L${cx + 17} ${cy + 29} L${cx - 17} ${cy + 29} Z`;
	const seated = `M${cx - 24} ${cy} L${cx - 12} ${cy - 20} L${cx + 12} ${cy - 20} L${cx + 24} ${cy} L${cx + 12} ${cy + 20} L${cx - 12} ${cy + 20} Z`;

	return `<path d='${rim}' fill='#05070a' fill-opacity='0.5' stroke='#ffffff' stroke-opacity='0.07'/>
		${full ? `<path d='${seated}' fill='#3a4046' fill-opacity='0.45' stroke='#c49a45' stroke-opacity='0.22'/>` : ''}`;
};

const FOAM = svg(
	300,
	280,
	`<rect x='4' y='4' width='292' height='272' rx='34' fill='#0c0e10' fill-opacity='0.22'
		stroke='#ffffff' stroke-opacity='0.04'/>
	<rect x='14' y='14' width='272' height='252' rx='26' fill='none'
		stroke='#ffffff' stroke-opacity='0.03'/>
	${FOAM_CELLS.map(([cx, cy, full]) => foamHex(cx, cy, full)).join('')}`,
);

// The maker's plate, riveted on. Brass, engraved, and redacted where it counts.
const PLATE = svg(
	250,
	160,
	`<rect x='8' y='8' width='234' height='144' rx='4' fill='#c49a45' fill-opacity='0.13'
		stroke='#c49a45' stroke-opacity='0.3'/>
	<rect x='18' y='18' width='214' height='124' rx='2' fill='none'
		stroke='#c49a45' stroke-opacity='0.16'/>
	<g font-family='monospace' text-anchor='middle' fill='#c49a45'>
		<text x='125' y='58' font-size='16' letter-spacing='3' fill-opacity='0.34'>██████ ██████</text>
		<text x='125' y='86' font-size='11' letter-spacing='2.4' fill-opacity='0.26'>FIELD SET · MK IV</text>
		<text x='125' y='112' font-size='11' letter-spacing='2.4' fill-opacity='0.26'>4 TEAMS · 32 PIECES</text>
		<text x='125' y='134' font-size='10' letter-spacing='2' fill-opacity='0.2'>NO. 0047</text>
	</g>
	<g fill='#c49a45' fill-opacity='0.34'>
		<circle cx='20' cy='20' r='3.5'/>
		<circle cx='230' cy='20' r='3.5'/>
		<circle cx='20' cy='140' r='3.5'/>
		<circle cx='230' cy='140' r='3.5'/>
	</g>`,
);

export const CASE = {
	wash: [
		PLATE,
		FOAM,
		FOAM,
		WALL,
		WALL,
		`linear-gradient(rgba(255, 255, 255, 0.05), transparent 45%)`,
		`repeating-linear-gradient(92deg, rgba(255, 255, 255, 0.028) 0 1px, transparent 1px 3px)`,
	].join(',\n\t\t'),
	// The walls are sized `auto 100%` — height to the viewport, width from the artwork, so the letters
	// keep their proportions on any screen instead of being stretched into a different typeface.
	size: `min(215px, 23vmin), min(255px, 27vmin), min(255px, 27vmin), auto 100%, auto 100%, auto, auto`,
	position: `right 1vmin bottom 2vmin,
		left -5vmin bottom -4vmin,
		right -6vmin top -5vmin,
		left top,
		right top,
		left top,
		left top`,
	repeat: `no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat`,
};
