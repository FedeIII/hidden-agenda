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
// four team colours, sampled off the token art the same way three/palette.js samples them.
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
	'--ha-well': '#16211c',
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
	'--ha-card-bg-mix': 'rgba(255, 250, 235, 0.34)',
	'--ha-card-edge': '1px solid rgba(90, 70, 36, 0.55)',
	'--ha-card-shadow': '2px 3px 0 rgba(90, 60, 40, 0.28)',
	'--ha-card-rotate': '-1deg',
	'--ha-team-bezel': '1px solid rgba(44, 38, 32, 0.5)',
	'--ha-team-overlay': 'none',
	'--ha-team-tab': 'block',

	// The HQ card in 3D is smoked glass over a rack the renderer drew, and thinner than it looks
	// like it should be: the canvas is UNDER .game, so every pixel of this is a filter on the tray.
	// At the 0.28 it once carried it was quietly taking a quarter off an already dim rack.
	'--ha-hq-glass': 'rgba(60, 44, 20, 0.1)',
	'--ha-hq-inner': 'inset 0 0 18px rgba(90, 70, 36, 0.22)',

	'--ha-band-bg': '#2c2620',
	'--ha-band-ink': '#e0cfa4',

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
	'--ha-ground-wash': `radial-gradient(120% 100% at 50% -10%, rgba(255, 255, 255, 0.07), transparent 60%),
		repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px),
		repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px)`,
	'--ha-well': '#0a1b2b',
	'--ha-well-edge': '#38648a',

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
	'--ha-team-bezel': '1px solid rgba(220, 232, 242, 0.65)',
	// Half hatched, half solid: how a drawing calls out a finish it cannot print.
	'--ha-team-overlay': 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.3) 0 3px, transparent 3px 6px)',
	'--ha-team-tab': 'none',

	'--ha-hq-glass': 'rgba(10, 27, 43, 0.16)',
	'--ha-hq-inner': 'inset 0 0 18px rgba(0, 0, 0, 0.3)',

	'--ha-band-bg': 'rgba(220, 232, 242, 0.92)',
	'--ha-band-ink': '#123049',

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
	'--ha-well': '#111417',
	'--ha-well-edge': '#3a3f45',

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
	// Anodised in the team's colour, bezelled in brass.
	'--ha-team-bezel': '2px solid #a8842f',
	'--ha-team-overlay': 'linear-gradient(rgba(255, 255, 255, 0.22), transparent 60%)',
	'--ha-team-tab': 'none',

	'--ha-hq-glass': 'rgba(12, 15, 18, 0.16)',
	'--ha-hq-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 -8px 16px rgba(0, 0, 0, 0.4)',

	'--ha-band-bg': 'linear-gradient(#3b4148, #2c3137)',
	'--ha-band-ink': '#e9ecef',

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

// The one thing about the *board itself* that a direction changes: the plinth the tiles are seated
// in. Read by three/palette.js, which is why these are plain strings and not custom properties —
// the renderer cannot resolve a var().
export const SKIN_PLINTH = {
	[SKINS.DOSSIER]: { plinth: '#16211c', plinthEdge: '#3a5145' },
	[SKINS.BLUEPRINT]: { plinth: '#0a1b2b', plinthEdge: '#38648a' },
	[SKINS.VAULT]: { plinth: '#111417', plinthEdge: '#3a3f45' },
};

export default SKIN_TOKENS;
