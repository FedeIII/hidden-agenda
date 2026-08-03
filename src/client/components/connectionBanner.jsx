import styled from 'styled-components';
import useSession from 'Hooks/useSession';

// Losing a connection is bad news in every skin, so it keeps a warning colour of its own rather
// than the accent — Vault's accent is brass, and a brass banner reads as decoration.
const Banner = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 2000;
	padding: 6px 10px;
	text-align: center;
	font-family: var(--ha-face-data);
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	color: #1c1c1c;
	background: ${({ lost }) => (lost ? '#ff9a9a' : '#ffd479')};
`;

const MESSAGES = {
	connecting: 'Connecting…',
	reconnecting: 'Connection lost — reconnecting…',
};

// Silent while everything is fine, and absent entirely in a local game. A player whose connection
// drops mid-turn needs to know that is why nothing is responding.
function ConnectionBanner() {
	const { mode, status } = useSession();

	if (mode !== 'online' || status === 'ready') {
		return null;
	}

	const message = MESSAGES[status];

	if (!message) {
		return null;
	}

	return (
		<Banner id="connection-banner" lost={status === 'reconnecting'}>
			{message}
		</Banner>
	);
}

export default ConnectionBanner;
