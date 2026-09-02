import { DEFAULT_SKIN, SKIN_NAMES } from 'Domain/skins';
import { DEFAULT_LANG } from 'Client/i18n';
import { SHARED, SKIN_TOKENS, SKIN_WORDS } from './tokens';

// The token blocks, as one static stylesheet fragment for createGlobalStyle.
//
// Built once at module load and interpolated as a constant, so styled-components sees a single
// unchanging global rule set no matter how many times the skin changes. Switching skin is then one
// attribute write on <html> and nothing is recompiled, re-hashed or re-injected.

function declarations(tokens) {
	return Object.entries(tokens)
		.map(([name, value]) => `\t${name}: ${value};`)
		.join('\n');
}

// The default block is unconditional so there is never a frame of unstyled page before the
// attribute lands — the main menu is Dossier, and it is Dossier from the first paint.
const skinBlocks = [
	`:root {\n${declarations(SHARED)}\n${declarations(SKIN_TOKENS[DEFAULT_SKIN])}\n}`,
	...SKIN_NAMES.map(skin => `:root[data-skin='${skin}'] {\n${declarations(SKIN_TOKENS[skin])}\n}`),
].join('\n\n');

/**
 * The same blocks again, for the six tokens whose value is a word — see SKIN_WORDS.
 *
 * Separate from the constant above because these depend on the language and that one must not: the
 * whole point of `skinBlocks` is that switching skin is one attribute write with nothing recompiled,
 * and threading a language through it would mint a second copy of all six hundred declarations.
 * This is thirty-six declarations, rebuilt when a player changes language and at no other time.
 *
 * Same shape as `skinBlocks`, and mounted after it, so the default block covers the first paint and
 * a `[data-skin]` block wins over it by coming later at equal specificity.
 */
export function wordBlocks(lang) {
	const words = skin => SKIN_WORDS[skin][lang] || SKIN_WORDS[skin][DEFAULT_LANG];

	return [
		`:root {\n${declarations(words(DEFAULT_SKIN))}\n}`,
		...SKIN_NAMES.map(skin => `:root[data-skin='${skin}'] {\n${declarations(words(skin))}\n}`),
	].join('\n\n');
}

export default skinBlocks;
