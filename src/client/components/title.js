import styled from 'styled-components';
import { narrowOrShort } from './breakpoints';

// The turn strip, which is the one piece of chrome every phase shows.
//
// Each direction reads it as something its own world already has: Dossier types it on a routing
// slip and rules a line under it, Blueprint sets it in the bordered cells a drawing keeps its facts
// in, and Vault mounts it on the rail across the top of the case. All three are the same element —
// a frame token, a rule token and a ground token — because moving it would move #next-turn, and
// that button is clicked by most of the suite.
export const Title = styled.div`
	/* A drawing labels the section it is a view of. Held as a token rather than in the markup so the
	   two directions that have no sections contribute nothing at all rather than an empty box. */
	&::before {
		content: var(--ha-strip-mark);
		display: var(--ha-strip-mark-display);
		align-items: center;
		padding: 2px 8px 1px;
		font-family: var(--ha-face-data);
		font-size: 9px;
		letter-spacing: var(--ha-track-label);
		color: var(--ha-stamp-ink);
		border: var(--ha-stamp-edge);
	}

	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	flex-wrap: wrap;
	padding: 14px 22px;
	text-align: center;
	color: var(--ha-ink);
	font-weight: bold;
	font-size: 16px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	width: 90vw;
	background: var(--ha-title-bg);
	border: var(--ha-title-frame);
	border-bottom: var(--ha-title-rule);
	border-radius: var(--ha-panel-radius);

	${narrowOrShort} {
		padding: 7px 8px;
		font-size: 13px;
		gap: 8px;
		width: 100%;
	}
`;

export const Subtitle = styled.div`
	padding: 14px 20px;
	text-align: center;
	color: var(--ha-ink-dim);
	font-size: 16px;
	letter-spacing: var(--ha-track-label);

	${narrowOrShort} {
		padding: 8px 4px;
		font-size: 13px;
	}
`;
