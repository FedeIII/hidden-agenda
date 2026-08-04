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
	// Not an error and not a lost connection: this seat is being played from a window that asked for
	// it more recently. Said plainly, because the alternative is a tab that silently does nothing.
	displaced: 'This seat is open in another window — play there, or reload here to take it back.',
};

// Silent while everything is fine, and absent entirely in a local game. A player whose connection
// drops mid-turn needs to know that is why nothing is responding.
//
// It also needs a seat. The lobby opens a socket the moment it is shown now, because the room finder
// is fed by one — so on a build with no server at all (GitHub Pages) an unseated client is *always*
// reconnecting, and shouting "connection lost" at somebody who has not tried to do anything yet is a
// message about nothing. The lobby says it in its own words, next to the way out.
function ConnectionBanner() {
	const { mode, status, seatId } = useSession();

	if (mode !== 'online' || status === 'ready' || !seatId) {
		return null;
	}

	const message = MESSAGES[status];

	if (!message) {
		return null;
	}

	return (
		<Banner id="connection-banner" lost={status !== 'connecting'}>
			{message}
		</Banner>
	);
}

export default ConnectionBanner;
