import { createGlobalStyle } from 'styled-components';
import { useLang } from 'Client/i18n';
import { wordBlocks } from './skinStyle';

// The six text-valued tokens, as a global rule of their own.
//
// A second `createGlobalStyle` rather than a language argument threaded into the first, because the
// first is a constant on purpose: `globalStyle.js` is six hundred declarations that must be injected
// once and never again, and interpolating a language into it would mint a whole second copy of them
// per language. This is the small language-dependent corner, kept where its cost is visible.
//
// Mounted after GlobalStyle, which is what makes a `:root[data-skin]` word block win over the
// default one — equal specificity, later wins.
const Words = createGlobalStyle`
	${({ $blocks }) => $blocks}
`;

export default function SkinWords() {
	return <Words $blocks={wordBlocks(useLang())} />;
}
