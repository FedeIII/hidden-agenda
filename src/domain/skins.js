// The three visual directions the interface can be dressed in, and how one gets chosen.
//
// Held in `domain` for the same reason `phases.js` is: the server picks the skin for an online
// room and sends this exact string in its `room` frame, so the name has to live somewhere both
// halves already import. Nothing about how a skin *looks* belongs here — that is client/theme.
//
// A skin never changes geometry. Only colour, type, borders and ornament, because the invisible
// DOM boxes a click lands on are projected from the board's own size and every browser spec
// asserts against them: a skin that moved a hexagon would break the game, not merely restyle it.
export const SKINS = {
	// The file room. Manila card, typewriter, stamps. The default, and the only one the main menu
	// ever shows — a game starts as a document and only becomes a table later.
	DOSSIER: 'dossier',
	// Industrial secrets, taken literally: the whole screen is the stolen drawing.
	BLUEPRINT: 'blueprint',
	// The attaché case. Milled gunmetal, oxblood, brass.
	VAULT: 'vault',
};

export const SKIN_NAMES = Object.values(SKINS);

export const DEFAULT_SKIN = SKINS.DOSSIER;

export function isSkin(value) {
	return SKIN_NAMES.includes(value);
}

/**
 * Picks a skin for a game.
 *
 * Takes an `rng` for the same reason `deal.js` does — the server calls it with its own, and a
 * test needs to be able to make the choice deterministic. Dossier stays in the draw: keeping the
 * style you started the menu in is one of the three outcomes, not a failure to change.
 */
export function pickSkin(rng = Math.random) {
	return SKIN_NAMES[Math.floor(rng() * SKIN_NAMES.length) % SKIN_NAMES.length];
}

export default SKINS;
