import styled from 'styled-components';
import { narrowOrShort } from './breakpoints';

// The app's one brand mark: a seal cut from the board's own pointy-top hexagon. It only ever
// appears on the lobby, which is always Dossier regardless of what skin a game later draws, so
// the stamp red is a literal value here rather than a token.
const Mark = styled.svg`
	width: 26px;
	height: 26px;
	flex-shrink: 0;

	${narrowOrShort} {
		width: 20px;
		height: 20px;
	}
`;

export default function Logo() {
	return (
		<Mark viewBox="0 0 120 120" aria-hidden="true" focusable="false">
			<polygon points="60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35" fill="none" stroke="#a3282b" strokeWidth="7" />
			<text
				x="60"
				y="76"
				textAnchor="middle"
				fontFamily="'American Typewriter', 'Courier New', Courier, monospace"
				fontWeight="700"
				fontSize="44"
				letterSpacing="-1"
				fill="#a3282b"
			>
				HA
			</text>
		</Mark>
	);
}
