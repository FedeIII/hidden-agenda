import styled from 'styled-components';

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
	font-family: monospace;
	font-size: 42px;
	letter-spacing: 10px;
	padding-left: 10px;
	color: #fff;
`;

export const ShareHint = styled.div`
	font-family: monospace;
	font-size: 12px;
	color: #cfd6de;
	word-break: break-all;
	text-align: center;
`;

export const SeatList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	width: 100%;
`;

export const SeatRow = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-family: monospace;
	font-size: 15px;
	padding: 7px 10px;
	margin-bottom: 4px;
	color: #fff;
	background: rgba(0, 0, 0, ${({ dim }) => (dim ? 0.15 : 0.35)});
	opacity: ${({ dim }) => (dim ? 0.55 : 1)};
`;

export const SeatTag = styled.span`
	font-size: 11px;
	color: #a1abb7;
`;

export const Field = styled.input`
	font-family: monospace;
	font-size: 17px;
	padding: 8px 10px;
	width: 100%;
	box-sizing: border-box;
	text-align: center;
	text-transform: ${({ code }) => (code ? 'uppercase' : 'none')};
	letter-spacing: ${({ code }) => (code ? '6px' : 'normal')};
`;

export const Row = styled.div`
	display: flex;
	gap: 8px;
	width: 100%;
`;

export const Notice = styled.div`
	font-family: monospace;
	font-size: 13px;
	padding: 6px 10px;
	color: ${({ bad }) => (bad ? '#ffb4b4' : '#cfd6de')};
`;
