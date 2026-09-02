import { SKINS } from 'Domain/skins';

// The look of each direction, as one flat table of custom properties.
//
// Custom properties rather than a styled-components ThemeProvider, and that is not a stylistic
// preference. styled-components hashes and injects a rule for every distinct value it is
// interpolated with and reclaims none of them, so a theme threaded through templates mints a
// second and third class for every component in the app. A variable swapped on :root costs one
// rule per component, forever, whatever the skin.
//
// Two consequences to respect. First, everything a skin changes has to be expressible as a *value*. That
// is why there are tokens here for a clip-path, a rotation and a background-image — a component
// says `clip-path: var(--ha-control-clip)` once and all three skins flow through it. Where a skin
// wants no ornament the token is `none`, not a missing token.
//
// Second — and this one is load-bearing — a skin may change a border's COLOUR but never its WIDTH.
// The turn strip sits above the board, so a 2px rule in one direction and none in another moves
// every tile down two pixels, and the tiles are what the invisible click boxes are projected from.
// That is why the title tokens are `2px solid transparent` rather than `none` where a direction
// wants no rule. skin.test.js asserts the board's box is identical across skins.
//
// Two things are deliberately NOT here:
//   - the board's feedback colours (a legal cell's red, a selected piece's brightness). They are
//     the one piece of vocabulary a returning player owns, they are the same in all three
//     directions, and the browser suite asserts them literally.
//   - anything with a length that decides where a hexagon lands. See the note in domain/skins.js.

// Shared across all three. The friend/foe green and red the game has used from the start, and the
// four team colours.
//
// These four name the team and are read on a tab and on an alignment card, so each one is the
// colour its team is CALLED — black is dark, white is pale. They are no longer the token's own
// colour: three/palette.js follows the face, and the black and white faces are inverted so their
// marks can carry the team name. Do not resync the two tables.
const SHARED = {
	'--ha-friend': 'mediumseagreen',
	'--ha-foe': 'indianred',

	'--ha-team-0': '#3d3843',
	'--ha-team-0-line': '#c7d2e3',
	'--ha-team-0-ink': '#e6e9ee',

	'--ha-team-1': '#c42b3a',
	'--ha-team-1-line': '#e23048',
	'--ha-team-1-ink': '#fff2f2',

	'--ha-team-2': '#d5d3da',
	'--ha-team-2-line': '#8f959f',
	'--ha-team-2-ink': '#1b1e23',

	'--ha-team-3': '#e9bb1c',
	'--ha-team-3-line': '#a8842f',
	'--ha-team-3-ink': '#2b2410',
};

/**
 * DOSSIER — the file room.
 *
 * Manila card and typed labels, with the board sunk into a dark blotter well so the one lit thing
 * on the desk is the table. Controls are rubber stamps: outlined, tracked, very slightly crooked,
 * and they press when you push them.
 */
const DOSSIER = {
	'--ha-ground': '#c9b083',
	// On html, never on .game — the canvas sits under .game, so a background there is a filter on
	// everything the renderer drew rather than a backdrop behind it.
	'--ha-ground-wash': `radial-gradient(140% 110% at 8% -8%, rgba(255, 250, 235, 0.5), transparent 55%),
		repeating-linear-gradient(97deg, rgba(120, 92, 48, 0.055) 0 2px, transparent 2px 6px)`,
	// The board's own recess, and the rule that frames it. The colour is the same one the renderer
	// clears the board's rectangle with (SKIN_PLINTH.well below); this is the flat path's copy of it,
	// where there is no canvas to sit in front of.
	'--ha-well': '#1c2b25',
	'--ha-well-edge': '#0f1712',

	'--ha-panel': '#ddc79a',
	'--ha-panel-edge': '#8a6e3e',
	'--ha-panel-texture': 'none',
	'--ha-panel-shadow': '1px 2px 0 rgba(90, 70, 36, 0.3)',
	'--ha-panel-radius': '0',
	// Two punch holes along the top of a card, as one background rather than two elements.
	'--ha-panel-ornament': `radial-gradient(circle 5px at 22% 7px, #1d1a14 98%, transparent 100%),
		radial-gradient(circle 5px at 78% 7px, #1d1a14 98%, transparent 100%)`,

	'--ha-ink': '#2c2620',
	'--ha-ink-dim': '#6d5b38',
	'--ha-ink-faint': '#7b6634',
	'--ha-ink-on-accent': '#f0e4cc',
	'--ha-rule': 'rgba(90, 70, 36, 0.45)',

	'--ha-accent': '#a3282b',
	'--ha-accent-wash': 'rgba(163, 40, 43, 0.16)',

	'--ha-control-bg': 'transparent',
	'--ha-control-ink': '#a3282b',
	'--ha-control-edge': '2px solid #a3282b',
	'--ha-control-radius': '0',
	'--ha-control-clip': 'none',
	'--ha-control-rotate': '-1.2deg',
	'--ha-control-shadow': 'none',
	'--ha-control-shadow-hover': 'none',
	// A stamp never lands once.
	'--ha-control-ink-shadow': '0.6px 0.6px 0 rgba(163, 40, 43, 0.35)',
	'--ha-control-bg-active': '#a3282b',
	'--ha-control-ink-active': '#f0e4cc',
	'--ha-control-bg-off': 'transparent',
	'--ha-control-ink-off': '#7c6a44',
	'--ha-control-edge-off': '2px dashed #7c6a44',
	// The beat a control gives when it is waiting to be pressed — see components/button.js. A stamp
	// never lands once, so what comes up under Dossier's outline is a second impression of it,
	// bleeding into the stock.
	'--ha-control-beat-wash': 'rgba(163, 40, 43, 0.24)',
	'--ha-control-beat': `inset 0 0 0 2px rgba(163, 40, 43, 0.75),
		inset 0 0 12px rgba(163, 40, 43, 0.3)`,

	'--ha-face': `'American Typewriter', 'Courier New', Courier, monospace`,
	'--ha-face-data': `'American Typewriter', 'Courier New', Courier, monospace`,
	'--ha-track': '0.2em',
	'--ha-track-label': '0.16em',
	'--ha-weight': '400',

	// The turn strip is a routing slip: a typed line under the name, no frame.
	'--ha-title-frame': '1px solid transparent',
	'--ha-title-rule': '2px solid #2c2620',
	'--ha-title-bg': 'transparent',

	// A carbon copy, with the team's colour stuck on as an index tab.
	//
	// Carbon flimsies came in colours, so on this direction the alignment is the colour of the PAPER
	// rather than a chip laid on it — which means the wash over it is heavy and slightly warm, and the
	// card lands on pale sage and pale rose stock. That is also what makes a typed word legible on it:
	// ink mixed out of the alignment's own colour has to be typed on something close to paper.
	'--ha-card-bg-mix': 'rgba(241, 224, 213, 0.75)',
	'--ha-card-edge': '1px solid rgba(90, 70, 36, 0.55)',
	'--ha-card-shadow': '2px 3px 0 rgba(90, 60, 40, 0.28)',
	'--ha-card-rotate': '-1deg',
	'--ha-team-overlay': 'none',
	'--ha-team-tab': 'block',
	// A typed caption and a pencilled note, both a shade off the ink they are written beside.
	'--ha-card-note-ink': '#6a5834',

	// FRIEND or FOE, typed in the corner of the flimsy and ruled underneath. No chip: a typewriter
	// cannot reverse type out of a colour, so the word arrives as ink mixed out of the stock it is
	// typed on.
	//
	// The tint stops at 55% where the study said 62%. The study set this label larger; at the 9px the
	// corner wants, its mix came out under 4:1 on the same stock. The word exists to be read across a
	// table — it is the whole reason the cards say it in letters at all — so the ink goes a little
	// deeper and keeps the hue, which is the half of the recipe that matters.
	'--ha-card-label-fill': '0%',
	'--ha-card-label-tint': '55%',
	'--ha-card-label-ink': '#241f19',
	'--ha-card-label-weight': '400',
	'--ha-card-label-pad': '0 2px 1px',
	'--ha-card-label-radius': '0',
	'--ha-card-label-rule': '1px solid currentColor',
	'--ha-card-label-shadow': 'none',
	// The team over-printed on a block of its own colour, run out to both edges of the sheet and ruled
	// above and below. A typed page rules a field; it does not draw a box round it.
	'--ha-card-team-fill': '100%',
	'--ha-card-team-edge': '1px solid rgba(44, 38, 32, 0.45)',
	'--ha-card-team-side': '1px solid transparent',
	'--ha-card-team-radius': '0',
	'--ha-card-team-shadow': 'none',

	// The colour of record: a chip off a colour chart, glued on slightly crooked.
	'--ha-card-chip-size': '26px',
	'--ha-card-chip-radius': '0',
	'--ha-card-chip-overlay': 'none',
	'--ha-card-chip-inner': '1px 1px 0 rgba(90, 70, 36, 0.35)',
	'--ha-card-chip-glow': '0%',
	'--ha-card-chip-rotate': '-2.5deg',

	'--ha-card-swatch-bg': 'transparent',
	'--ha-card-swatch-edge': '1px solid transparent',
	'--ha-card-swatch-radius': '0',
	'--ha-card-swatch-pad': '0',
	'--ha-card-swatch-shadow': 'none',
	// The name is already typed on the block above in 22px caps. A file does not say it twice.
	'--ha-card-swatch-ref': 'none',
	'--ha-card-swatch-name': 'none',

	// The HQ card in 3D is smoked glass over a rack the renderer drew, and thinner than it looks
	// like it should be: the canvas is UNDER .game, so every pixel of this is a filter on the tray.
	// At the 0.28 it once carried it was quietly taking a quarter off an already dim rack.
	'--ha-hq-glass': 'rgba(60, 44, 20, 0.1)',
	'--ha-hq-inner': 'inset 0 0 18px rgba(90, 70, 36, 0.22)',

	'--ha-band-bg': '#2c2620',
	'--ha-band-ink': '#e0cfa4',

	// The turn strip is a routing slip: typed keys, a dotted rule between them, and initials boxes.
	'--ha-cell-divider': '1px dotted rgba(90, 70, 36, 0.55)',
	'--ha-cell-bg': 'transparent',

	// The HQ card's file tab, in the team's own colour, cut like a tab and stuck to the top edge.
	//
	// The two colour tokens are deliberately ABSENT here rather than set to var(--ha-hq-team): a
	// var() inside a custom property is resolved where that property is declared, so one written on
	// :root would look for the per-card team variable on :root and find nothing — the declaration
	// then drops out entirely and the tab renders with no fill at all. The component's own fallback
	// picks the team colour up instead, on the element that actually inherits it.
	'--ha-hq-label-edge': '1px solid rgba(44, 38, 32, 0.5)',
	'--ha-hq-label-radius': '0',
	'--ha-hq-label-clip': 'polygon(0 0, 100% 0, calc(100% - 7px) 100%, 0 100%)',
	'--ha-hq-label-shadow': '1px 1px 0 rgba(90, 70, 36, 0.35)',

	// Claiming a team is a stamp on the file, and the file says so even when nobody has claimed it.
	'--ha-claim-bg': 'rgba(255, 250, 235, 0.72)',
	'--ha-claim-ink': '#a3282b',
	// A hairline as a shadow rather than a border: the border-top is the rule the line hangs under.
	'--ha-claim-frame': '0 0 0 1px #a3282b',
	'--ha-claim-rotate': '-2deg',
	'--ha-claim-align': 'left',
	'--ha-claim-rule': '1px solid transparent',
	'--ha-claim-holder-ink': '#2c2620',
	// Typed, then underlined by hand in red pencil.
	'--ha-claim-holder-rule': '1px solid #a3282b',

	// A drawing's coordinates and dimension callouts. Not a Dossier idea: a file has no scale.
	'--ha-mark-display': 'none',
	'--ha-mark-ink': 'transparent',
	'--ha-mark-rule': 'transparent',

	// The one loud control at the table. A round rubber stamp, because it is an authorisation.
	'--ha-control-radius-primary': '50% / 44%',

	'--ha-mark-initials': 'inline-flex',

	// The stamp on the routing slip, and the tally under a file's piece count.
	'--ha-stamp-edge': '2px double #a3282b',
	'--ha-stamp-ink': '#a3282b',
	'--ha-stamp-rotate': '-2.5deg',
	'--ha-tally-bg': 'rgba(255, 250, 235, 0.4)',
	'--ha-tally-edge': '1px dotted rgba(90, 70, 36, 0.55)',
	// The drawing's own section flag. A file has no sections, so nothing here — the flag's WORDS are
	// in SKIN_WORDS below, and only its display is a look.
	'--ha-strip-mark-display': 'none',

	'--ha-field-bg': 'rgba(255, 250, 235, 0.55)',
	'--ha-field-ink': '#2c2620',
	'--ha-field-edge': '1px solid rgba(90, 70, 36, 0.5)',
};

/**
 * BLUEPRINT — industrial secrets.
 *
 * Cyanotype ground with the drawing grid on it, chalk line work, and ferro red for anything that
 * is armed. Controls are drafted: a rectangle with its corner cut, never rounded.
 */
const BLUEPRINT = {
	'--ha-ground': '#143452',
	// Every slash and every parenthesis in this data URI is percent-encoded, and none of that is
	// decoration. styled-components v4 preprocesses with stylis, which strips `//` as a line comment
	// and cannot cope with a bare `(` inside a quoted url() — either one swallows the rest of this
	// declaration AND the closing brace of the block, which silently nests the next skin and the whole
	// `html` rule inside this one and leaves the page with no ground at all. Nothing throws; every
	// custom property still resolves; the page is simply unpainted. skin.test.js guards it now.
	//
	// A data URI is percent-decoded before the SVG is parsed, so %2F, %28 and %29 arrive as the
	// slashes and brackets the markup needs. The fill is a hex colour with a separate fill-opacity
	// rather than rgba(), for the same reason: no brackets.
	'--ha-ground-wash': `url("data:image/svg+xml,%3Csvg xmlns='http:%2F%2Fwww.w3.org%2F2000%2Fsvg' width='760' height='420'%3E%3Ctext x='380' y='230' text-anchor='middle' transform='rotate%28-24 380 230%29' font-family='monospace' font-size='27' letter-spacing='9' fill='%23ffffff' fill-opacity='0.06'%3EPROPERTY OF %E2%96%88%E2%96%88%E2%96%88%E2%96%88%E2%96%88%E2%96%88 INDUSTRIES%3C/text%3E%3C/svg%3E"),
		radial-gradient(120% 100% at 50% -10%, rgba(255, 255, 255, 0.07), transparent 60%),
		repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px),
		repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px)`,
	'--ha-well': 'rgba(8, 26, 42, 0.55)',
	// The same chalk hairline every other section of the drawing is framed with, because that is what
	// divides one from the next.
	'--ha-well-edge': 'rgba(220, 232, 242, 0.42)',

	'--ha-panel': 'rgba(8, 26, 42, 0.42)',
	'--ha-panel-edge': '#dce8f2',
	'--ha-panel-texture': 'none',
	'--ha-panel-shadow': 'none',
	'--ha-panel-radius': '0',
	'--ha-panel-ornament': 'none',

	'--ha-ink': '#eaf2f8',
	'--ha-ink-dim': '#9dbdd6',
	'--ha-ink-faint': '#6f9fc4',
	'--ha-ink-on-accent': '#10222f',
	'--ha-rule': 'rgba(220, 232, 242, 0.45)',

	'--ha-accent': '#ff6b4a',
	'--ha-accent-wash': 'rgba(255, 107, 74, 0.18)',

	'--ha-control-bg': 'transparent',
	'--ha-control-ink': '#eaf3f9',
	'--ha-control-edge': '1px solid #9dc2dc',
	'--ha-control-radius': '0',
	// A drawn control gets its corner cut, not rounded.
	'--ha-control-clip': 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)',
	'--ha-control-rotate': '0deg',
	'--ha-control-shadow': 'none',
	'--ha-control-shadow-hover': 'none',
	'--ha-control-ink-shadow': 'none',
	'--ha-control-bg-active': '#ff6b4a',
	'--ha-control-ink-active': '#17110d',
	'--ha-control-bg-off': 'transparent',
	'--ha-control-ink-off': '#5d7f97',
	'--ha-control-edge-off': '1px solid #3e5f76',
	// A drawing calls a thing out by going over it in ferro red. The chalk keyline lights to the
	// annotation colour and the sheet behind it takes a wash of the same.
	'--ha-control-beat-wash': 'rgba(255, 107, 74, 0.12)',
	'--ha-control-beat': `inset 0 0 0 1px #ff6b4a,
		inset 0 0 12px rgba(255, 107, 74, 0.3)`,

	'--ha-face': `'Avenir Next Condensed', 'Roboto Condensed', 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif`,
	'--ha-face-data': `ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace`,
	'--ha-track': '0.19em',
	'--ha-track-label': '0.2em',
	'--ha-weight': '500',

	// Every fact about the game in the cells a drawing keeps them in.
	'--ha-title-frame': '1px solid rgba(220, 232, 242, 0.6)',
	'--ha-title-rule': '2px solid transparent',
	'--ha-title-bg': 'rgba(8, 26, 42, 0.45)',

	'--ha-card-bg-mix': 'rgba(8, 26, 42, 0.5)',
	'--ha-card-edge': '1px solid #dce8f2',
	'--ha-card-shadow': 'none',
	'--ha-card-rotate': '0deg',
	// The team's own colour never fills anything on a drawing — see the block and the chip below.
	'--ha-team-overlay': 'none',
	'--ha-team-tab': 'none',
	'--ha-card-note-ink': '#9dbdd6',

	// A figure is labelled in a filled tab in the corner, so friend or foe rides the tab: the
	// alignment's own colour undimmed by the sheet's wash, with the ink reversed out of it.
	'--ha-card-label-fill': '100%',
	'--ha-card-label-tint': '0%',
	'--ha-card-label-ink': '#0d2033',
	'--ha-card-label-weight': '600',
	'--ha-card-label-pad': '2px 8px',
	'--ha-card-label-radius': '0',
	'--ha-card-label-rule': '1px solid transparent',
	'--ha-card-label-shadow': 'none',
	// A drawing cannot print a colour, so it does not pretend to: the team is NAMED in chalk between
	// two rules, and the colour itself is called out underneath as a finish. That is the whole
	// argument for this direction having a swatch at all, and the reason the block's fill is 0%.
	'--ha-card-team-fill': '0%',
	'--ha-card-team-ink': '#eaf2f8',
	'--ha-card-team-edge': '1px solid rgba(220, 232, 242, 0.45)',
	'--ha-card-team-side': '1px solid transparent',
	'--ha-card-team-radius': '0',
	'--ha-card-team-shadow': 'none',

	// The finish callout: a chip in a bordered cell with its reference beside it. Half hatched, so it
	// reads as specified rather than rendered.
	'--ha-card-chip-size': '22px',
	'--ha-card-chip-radius': '0',
	'--ha-card-chip-overlay': 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.34) 0 2px, transparent 2px 4px)',
	'--ha-card-chip-inner': '0 0 0 0 transparent',
	'--ha-card-chip-glow': '0%',
	'--ha-card-chip-rotate': '0deg',

	'--ha-card-swatch-bg': 'transparent',
	'--ha-card-swatch-edge': '1px solid rgba(220, 232, 242, 0.5)',
	'--ha-card-swatch-radius': '0',
	'--ha-card-swatch-pad': '6px 7px',
	'--ha-card-swatch-shadow': 'none',
	'--ha-card-swatch-ref': 'block',
	'--ha-card-swatch-name': 'none',

	'--ha-hq-glass': 'rgba(10, 27, 43, 0.16)',
	'--ha-hq-inner': 'inset 0 0 18px rgba(0, 0, 0, 0.3)',

	'--ha-band-bg': 'rgba(220, 232, 242, 0.92)',
	'--ha-band-ink': '#123049',

	// Every fact in the cells a drawing keeps them in, with a real rule between each.
	'--ha-cell-divider': '1px solid rgba(220, 232, 242, 0.6)',
	'--ha-cell-bg': 'rgba(8, 26, 42, 0.35)',

	// The sheet's own label bar: chalk on the panel edge, reversed out.
	'--ha-hq-label-bg': 'rgba(220, 232, 242, 0.92)',
	'--ha-hq-label-ink': '#123049',
	'--ha-hq-label-edge': '1px solid rgba(220, 232, 242, 0.92)',
	'--ha-hq-label-radius': '0',
	'--ha-hq-label-clip': 'none',
	'--ha-hq-label-shadow': 'none',

	// Signed off, in ferro red, under a dashed rule — and UNASSIGNED under the same rule where nobody
	// has signed. A sheet with a blank in it is a sheet that has not been approved, which is a fact
	// about the drawing and not an absence of one.
	'--ha-claim-bg': 'transparent',
	'--ha-claim-ink': '#85aecc',
	'--ha-claim-frame': 'none',
	'--ha-claim-rotate': '0deg',
	'--ha-claim-align': 'left',
	'--ha-claim-rule': '1px dashed rgba(220, 232, 242, 0.35)',
	'--ha-claim-holder-ink': '#ff6b4a',
	'--ha-claim-holder-rule': '1px solid transparent',

	// The direction that actually wants coordinates: on a drawing they are native, and they let the
	// table say R3C4 out loud. They land on the phantom ring — the cells that are already clickable
	// but never drawn, which is exactly where a label belongs.
	'--ha-mark-display': 'block',
	'--ha-mark-ink': '#9dc2dc',
	'--ha-mark-rule': 'rgba(157, 194, 220, 0.75)',

	'--ha-control-radius-primary': '0',

	'--ha-mark-initials': 'none',

	'--ha-stamp-edge': '1px solid #ff6b4a',
	'--ha-stamp-ink': '#ff6b4a',
	'--ha-stamp-rotate': '0deg',
	// Written off, and hatched the way a section is.
	'--ha-tally-bg': 'repeating-linear-gradient(45deg, transparent 0 3px, rgba(255, 107, 74, 0.22) 3px 4px)',
	'--ha-tally-edge': '1px solid rgba(220, 232, 242, 0.4)',
	'--ha-strip-mark-display': 'inline-flex',

	'--ha-field-bg': 'rgba(8, 26, 42, 0.55)',
	'--ha-field-ink': '#eaf2f8',
	'--ha-field-edge': '1px solid rgba(220, 232, 242, 0.5)',
};

/**
 * VAULT — the attaché case.
 *
 * Milled gunmetal, oxblood and brass. Controls are physical: raised, bevelled, and they sink when
 * pressed. The board is sunk deepest of the three, because a dimensional frame around dimensional
 * pieces reads as two light sources arguing unless the well is obviously a recess.
 */
const VAULT = {
	'--ha-ground': '#24282d',
	'--ha-ground-wash': `linear-gradient(rgba(255, 255, 255, 0.05), transparent 45%),
		repeating-linear-gradient(92deg, rgba(255, 255, 255, 0.028) 0 1px, transparent 1px 3px)`,
	'--ha-well': '#14171a',
	'--ha-well-edge': '#0c0e10',

	'--ha-panel': 'linear-gradient(#2b3035, #22262a)',
	'--ha-panel-edge': '#14171a',
	// Knurling along the foot of every milled panel.
	'--ha-panel-texture': 'repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.09) 0 1px, transparent 1px 3px)',
	'--ha-panel-shadow': `inset 0 1px 0 rgba(255, 255, 255, 0.1),
		inset 0 -8px 16px rgba(0, 0, 0, 0.4)`,
	'--ha-panel-radius': '2px',
	// Brass rivets in the top corners.
	'--ha-panel-ornament': `radial-gradient(circle 3px at 8px 8px, #c49a45 60%, #7d5e20 100%, transparent 100%),
		radial-gradient(circle 3px at calc(100% - 8px) 8px, #c49a45 60%, #7d5e20 100%, transparent 100%)`,

	'--ha-ink': '#e5e7ea',
	'--ha-ink-dim': '#949ba2',
	'--ha-ink-faint': '#7d848b',
	'--ha-ink-on-accent': '#2a2210',
	'--ha-rule': 'rgba(255, 255, 255, 0.12)',

	'--ha-accent': '#c49a45',
	'--ha-accent-wash': 'rgba(196, 154, 69, 0.18)',

	'--ha-control-bg': 'linear-gradient(#d9b464, #a8842f)',
	'--ha-control-ink': '#2a2210',
	'--ha-control-edge': '1px solid #7d5e20',
	'--ha-control-radius': '2px',
	'--ha-control-clip': 'none',
	'--ha-control-rotate': '0deg',
	'--ha-control-shadow': `inset 0 1px 0 rgba(255, 255, 255, 0.45),
		0 2px 0 #6d5019,
		0 3px 5px rgba(0, 0, 0, 0.45)`,
	'--ha-control-shadow-hover': `inset 0 1px 0 rgba(255, 255, 255, 0.5),
		0 2px 0 #6d5019,
		0 5px 9px rgba(0, 0, 0, 0.5)`,
	'--ha-control-ink-shadow': 'none',
	'--ha-control-bg-active': 'linear-gradient(#e05a4c, #b32e26)',
	'--ha-control-ink-active': '#2a0f0c',
	'--ha-control-bg-off': 'linear-gradient(#4a5057, #3a4046)',
	'--ha-control-ink-off': '#7d848b',
	'--ha-control-edge-off': '1px solid #262b30',
	// Brass has nothing to add and everything to catch, so the switch is simply lit: the bevel's own
	// highlight flares and warm light spills across the plate.
	'--ha-control-beat-wash': 'rgba(255, 240, 205, 0.22)',
	'--ha-control-beat': `inset 0 1px 0 rgba(255, 255, 255, 0.6),
		inset 0 0 14px rgba(255, 235, 180, 0.45)`,

	'--ha-face': `'Helvetica Neue', Helvetica, Arial, sans-serif`,
	'--ha-face-data': `ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace`,
	'--ha-track': '0.17em',
	'--ha-track-label': '0.19em',
	'--ha-weight': '500',

	// The rail across the top of the case.
	'--ha-title-frame': '1px solid #171b1f',
	'--ha-title-rule': '2px solid transparent',
	'--ha-title-bg': 'linear-gradient(#3b4148, #2c3137)',

	'--ha-card-bg-mix': 'rgba(20, 23, 26, 0.55)',
	'--ha-card-edge': '1px solid #14171a',
	'--ha-card-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 3px 8px rgba(0, 0, 0, 0.45)',
	'--ha-card-rotate': '0deg',
	// Anodised in the team's colour, lit from the top edge.
	'--ha-team-overlay': 'linear-gradient(rgba(255, 255, 255, 0.22), transparent 60%)',
	'--ha-team-tab': 'none',
	'--ha-card-note-ink': '#8b9199',

	// FRIEND or FOE on a small enamelled tag in the corner, bevelled like everything else in the case.
	'--ha-card-label-fill': '100%',
	'--ha-card-label-tint': '0%',
	'--ha-card-label-ink': '#14171a',
	'--ha-card-label-weight': '500',
	'--ha-card-label-pad': '3px 9px 2px',
	'--ha-card-label-radius': '2px',
	'--ha-card-label-rule': '1px solid transparent',
	'--ha-card-label-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.5)',
	// The team on an anodised plate the width of the tray, bezelled in brass all the way round — the
	// one direction of the three that boxes this field rather than ruling it.
	'--ha-card-team-fill': '100%',
	'--ha-card-team-edge': '2px solid #a8842f',
	'--ha-card-team-side': '2px solid #a8842f',
	'--ha-card-team-radius': '2px',
	'--ha-card-team-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.26), 0 1px 3px rgba(0, 0, 0, 0.5)',

	// The indicator jewel the trays already carry, one size up: round, sunk under its own rim, and
	// throwing a little of its own colour onto the recess it sits in.
	'--ha-card-chip-size': '22px',
	'--ha-card-chip-radius': '50%',
	'--ha-card-chip-overlay': 'none',
	'--ha-card-chip-inner': 'inset 0 -2px 3px rgba(0, 0, 0, 0.5)',
	'--ha-card-chip-glow': '55%',
	'--ha-card-chip-rotate': '0deg',

	'--ha-card-swatch-bg': 'linear-gradient(#22262a, #191c1f)',
	'--ha-card-swatch-edge': '1px solid #101315',
	'--ha-card-swatch-radius': '2px',
	'--ha-card-swatch-pad': '6px 8px',
	'--ha-card-swatch-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
	'--ha-card-swatch-ref': 'none',
	'--ha-card-swatch-name': 'block',

	'--ha-hq-glass': 'rgba(12, 15, 18, 0.16)',
	'--ha-hq-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 -8px 16px rgba(0, 0, 0, 0.4)',

	'--ha-band-bg': 'linear-gradient(#3b4148, #2c3137)',
	'--ha-band-ink': '#e9ecef',

	// Segments of the rail across the top of the case.
	'--ha-cell-divider': '1px solid #171b1f',
	'--ha-cell-bg': 'linear-gradient(#333940, #282d33)',

	// Embossed label tape: dark stock, raised caps, rounded ends.
	'--ha-hq-label-bg': '#1a1d21',
	'--ha-hq-label-ink': '#e9ecef',
	'--ha-hq-label-edge': '1px solid #101315',
	'--ha-hq-label-radius': '3px',
	'--ha-hq-label-clip': 'none',
	'--ha-hq-label-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 1px 2px rgba(0, 0, 0, 0.5)',

	// Tamper tape, which reads as claimed from across the room at any size and without a word — and
	// nothing whatsoever when the team is unclaimed, because an unsealed tray is already the
	// statement. This is the one direction of the three that says it by absence.
	'--ha-claim-bg': 'repeating-linear-gradient(45deg, #c49a45 0 6px, #9d7a33 6px 12px)',
	'--ha-claim-ink': '#22150f',
	'--ha-claim-frame': '0 1px 3px rgba(0, 0, 0, 0.5)',
	'--ha-claim-rotate': '-3deg',
	'--ha-claim-align': 'center',
	'--ha-claim-rule': '1px solid transparent',
	'--ha-claim-holder-rule': '1px solid transparent',

	'--ha-mark-display': 'none',
	'--ha-mark-ink': 'transparent',
	'--ha-mark-rule': 'transparent',

	'--ha-control-radius-primary': '2px',

	'--ha-mark-initials': 'none',

	'--ha-stamp-edge': '1px solid #7d5e20',
	'--ha-stamp-ink': '#c49a45',
	'--ha-stamp-rotate': '0deg',
	// A milled recess with brass in it.
	'--ha-tally-bg': 'linear-gradient(#1f2327, #191c1f)',
	'--ha-tally-edge': '1px solid #101315',
	'--ha-strip-mark-display': 'none',

	'--ha-field-bg': 'linear-gradient(#1f2327, #191c1f)',
	'--ha-field-ink': '#e5e7ea',
	'--ha-field-edge': '1px solid #101315',
};

export const SKIN_TOKENS = {
	[SKINS.DOSSIER]: DOSSIER,
	[SKINS.BLUEPRINT]: BLUEPRINT,
	[SKINS.VAULT]: VAULT,
};

export { SHARED };

/**
 * The words a direction says, per language.
 *
 * These six tokens are the only ones in this file whose value is *text* rather than a look, and they
 * are here rather than in the string catalog because which words they are is the skin's business as
 * much as the language's: a file stamps CONTROL:, a drawing signs a sheet off, a case is taped shut
 * and says CLAIMED. Three voices, and each of them has to be said in two languages — so this is a
 * table of skin × language rather than either on its own.
 *
 * They stay CSS custom properties for the reason everything else here is one: `content` on a
 * pseudo-element is the mechanism, so the component says `content: var(--ha-claim-key)` once and
 * never learns which direction or which language it is in.
 *
 * Two hazards, both of which the header note explains and both of which apply doubly to text:
 * stylis strips `//` and cannot cope with a bare `(` inside a quoted value, and either one silently
 * swallows the rest of the block. Nothing in here may contain a slash or a bracket. Accented
 * characters and the en dash are fine — the stylesheet is injected as a UTF-8 string.
 *
 * An empty word is `"''"` and not an absent key: a direction that says nothing here says it
 * deliberately, and a missing token would be an inherited one.
 */
export const SKIN_WORDS = {
	[SKINS.DOSSIER]: {
		en: {
			// A file numbers its enclosures, not its words.
			'--ha-card-fig-friend': "''",
			'--ha-card-fig-foe': "''",
			'--ha-card-swatch-key': "'colour of record'",
			// Claiming a team is a stamp on the file, and the file says so even when nobody has claimed it.
			'--ha-claim-key': "'CONTROL: '",
			'--ha-claim-empty': "'CONTROL: UNCLAIMED'",
			// A file has no sections.
			'--ha-strip-mark': "''",
		},
		es: {
			'--ha-card-fig-friend': "''",
			'--ha-card-fig-foe': "''",
			'--ha-card-swatch-key': "'color de registro'",
			'--ha-claim-key': "'CONTROL: '",
			'--ha-claim-empty': "'CONTROL: SIN RECLAMAR'",
			'--ha-strip-mark': "''",
		},
	},

	[SKINS.BLUEPRINT]: {
		en: {
			// A drawing numbers its figures.
			'--ha-card-fig-friend': "'FIG. 1 — '",
			'--ha-card-fig-foe': "'FIG. 2 — '",
			// And references a part by its number rather than by its name.
			'--ha-card-swatch-key': "'colour ref'",
			'--ha-claim-key': "'SIGNED OFF '",
			'--ha-claim-empty': "'UNASSIGNED'",
			'--ha-strip-mark': "'SECTION A–A'",
		},
		es: {
			'--ha-card-fig-friend': "'FIG. 1 — '",
			'--ha-card-fig-foe': "'FIG. 2 — '",
			'--ha-card-swatch-key': "'ref. de color'",
			'--ha-claim-key': "'FIRMADO POR '",
			'--ha-claim-empty': "'SIN ASIGNAR'",
			'--ha-strip-mark': "'SECCIÓN A–A'",
		},
	},

	[SKINS.VAULT]: {
		en: {
			// A tag is stamped, not catalogued.
			'--ha-card-fig-friend': "''",
			'--ha-card-fig-foe': "''",
			// A plate is engraved with a finish, not a part number.
			'--ha-card-swatch-key': "'anodised'",
			// Tamper tape, which reads as claimed from across the room at any size. This direction would
			// rather say nothing at all than say UNCLAIMED — an unsealed tray is already the statement.
			// It says it anyway, because the line is what a player clicks to claim the team and a control
			// nobody can see is not a control.
			'--ha-claim-key': "'CLAIMED · '",
			'--ha-claim-empty': "'UNCLAIMED'",
			'--ha-strip-mark': "''",
		},
		es: {
			'--ha-card-fig-friend': "''",
			'--ha-card-fig-foe': "''",
			'--ha-card-swatch-key': "'anodizado'",
			'--ha-claim-key': "'RECLAMADO · '",
			'--ha-claim-empty': "'SIN RECLAMAR'",
			'--ha-strip-mark': "''",
		},
	},
};

// What a direction changes about the *board itself*: the plinth the tiles are seated in, and the
// recess it is seated in. Read by three/palette.js, which is why these are plain strings and not
// custom properties — the renderer cannot resolve a var().
//
// The `well` is the board section's own ground, and it has to be painted by the renderer rather than
// by CSS: the canvas is a sibling of `.game` and sits UNDER it, so a background on the board element
// would be a filter over every tile drawn instead of a surface beneath them. stage.js clears each
// view's own rectangle with it before the scene draws, which puts it exactly where a DOM background
// would have gone and behind everything instead of in front of it. `--ha-well` below is the same
// colour for the flat path, where there is no canvas to get in front of.
//
// A little lighter than the plinth in every direction, which is the study's reading and the right way
// round: the recess is the table showing through, and the tray sits on it.
export const SKIN_PLINTH = {
	[SKINS.DOSSIER]: { plinth: '#16211c', plinthEdge: '#3a5145', well: '#1c2b25', wellAlpha: 1 },
	// The one translucent well of the three, so the drawing grid ghosts through its own board the way
	// a print does. An alpha in the clear, not a blend: the canvas is composited over the page.
	[SKINS.BLUEPRINT]: { plinth: '#0a1b2b', plinthEdge: '#38648a', well: '#081a2a', wellAlpha: 0.55 },
	[SKINS.VAULT]: { plinth: '#111417', plinthEdge: '#3a3f45', well: '#14171a', wellAlpha: 1 },
};

export default SKIN_TOKENS;
