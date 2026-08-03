import { DEFAULT_SKIN, SKIN_NAMES } from 'Domain/skins';
import { SHARED, SKIN_TOKENS } from './tokens';

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

export default skinBlocks;
