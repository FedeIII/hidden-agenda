import styled from 'styled-components';

// The waiting room, which is the first place an online table sees the skin the server drew for it:
// the room frame carries it alongside the seat list, so by the time a code is on screen everyone
// looking at that code is looking at the same material.

export const LobbyContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18px;
	padding: 24px 16px;
`;

export const Panel = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	max-width: 420px;
`;

export const RoomCode = styled.div`
	font-family: var(--ha-face-data);
	font-size: 42px;
	letter-spacing: 0.24em;
	padding-left: 0.24em;
	color: var(--ha-ink);
`;

export const ShareHint = styled.div`
	font-family: var(--ha-face-data);
	font-size: 12px;
	color: var(--ha-ink-dim);
	letter-spacing: var(--ha-track-label);
	word-break: break-all;
	text-align: center;
`;

export const SeatList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

export const SeatRow = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-family: var(--ha-face-data);
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	padding: 7px 10px;
	color: var(--ha-ink);
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	border-radius: var(--ha-panel-radius);
	opacity: ${({ dim }) => (dim ? 0.55 : 1)};
`;

export const SeatTag = styled.span`
	font-size: 11px;
	color: var(--ha-ink-faint);
	text-transform: uppercase;
`;

export const Field = styled.input`
	font-family: var(--ha-face-data);
	font-size: 17px;
	padding: 8px 10px;
	width: 100%;
	box-sizing: border-box;
	text-align: center;
	background: var(--ha-field-bg);
	color: var(--ha-field-ink);
	border: var(--ha-field-edge);
	border-radius: var(--ha-panel-radius);
	text-transform: ${({ code }) => (code ? 'uppercase' : 'none')};
	letter-spacing: ${({ code }) => (code ? '0.3em' : 'var(--ha-track-label)')};

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 1px;
	}
`;

export const Row = styled.div`
	display: flex;
	gap: 8px;
	width: 100%;
`;

export const Notice = styled.div`
	font-family: var(--ha-face-data);
	font-size: 13px;
	padding: 6px 10px;
	letter-spacing: var(--ha-track-label);
	color: ${({ bad }) => (bad ? 'var(--ha-accent)' : 'var(--ha-ink-dim)')};
`;
