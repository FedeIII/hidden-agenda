import styled from 'styled-components';

// The main menu, and the one screen that is always Dossier: a game starts as a form on a desk and
// only picks a look of its own once the table sits down to its cards. Everything here still reads
// through the tokens, so the other two directions render correctly if a skin is pinned.

export const StartPhaseContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 40px;
	max-width: 960px;
	width: 66vw;

	@media (max-width: 780px) {
		width: 100%;
		padding: 18px 14px;
	}
`;

export const Options = styled.div`
	width: 100%;
	background: var(--ha-panel);
	background-image: var(--ha-panel-texture);
	background-repeat: no-repeat;
	background-position: bottom;
	background-size: 100% 5px;
	border: 1px solid var(--ha-panel-edge);
	border-radius: var(--ha-panel-radius);
	box-shadow: var(--ha-panel-shadow);
	color: var(--ha-ink);
`;

export const NumberPlayers = styled.div`
	display: flex;
	flex-direction: column;
`;

// The section header: a filled band in every direction — typed on ink, a drawing's chalk title
// strip, the case's own rail. Deliberately not the accent, which is reserved for things you press;
// a full-width bar of stamp red reads as a warning rather than as a heading.
export const MainTitle = styled.div`
	color: var(--ha-band-ink);
	background: var(--ha-band-bg);
	padding: 6px 10px;
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
`;

export const Title = styled.div`
	font-size: 10px;
	padding: 5px 10px;
	color: var(--ha-ink-dim);
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
`;

export const NumberPlayersOptions = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	font-size: 20px;
	padding: 15px;
	accent-color: var(--ha-accent);
`;

export const NumberPlayersOptionLabel = styled.label`
	margin-left: 5px;
	color: var(--ha-ink);
`;

export const Players = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
`;

export const Player = styled.div`
	border-top: 1px solid var(--ha-rule);
	border-right: 1px solid var(--ha-rule);
	flex-basis: 33%;
	flex-grow: 1;
`;

export const PlayerNameInput = styled.input`
	margin: 5px 5px 10px 10px;
	padding: 5px 5px 2px 5px;
	background: var(--ha-field-bg);
	color: var(--ha-field-ink);
	font-size: 20px;
	position: relative;
	text-transform: uppercase;
	width: 75%;

	&,
	&:focus,
	&:active {
		border: none;
		border-bottom: var(--ha-field-edge);
		outline: none;
		font-family: var(--ha-face-data);
		letter-spacing: var(--ha-track);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 1px;
	}
`;
