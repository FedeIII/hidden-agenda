import styled from 'styled-components';
import useSession from 'Hooks/useSession';

const Banner = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 2000;
	padding: 6px 10px;
	text-align: center;
	font-family: monospace;
	font-size: 13px;
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
