import { useContext } from 'react';

import GlobalStyle from './globalStyle';
import { DragProvider } from './drag';
import { withState, StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { PHASES } from 'Domain/phases';
import useSession from 'Hooks/useSession';
import { Title } from 'Client/components/title';
import ConnectionBanner from 'Client/components/connectionBanner';
import LobbyPhase from 'Phases/lobbyPhase';
import StartPhase from 'Phases/startPhase';
import AlignmentPhase from 'Phases/alignmentPhase';
import PlayPhase from 'Phases/playPhase';
import EndPhase from 'Phases/endPhase';

const { START, ALIGNMENT, PLAY, END } = PHASES;

const NEEDS_GAME_STATE = [ALIGNMENT, PLAY, END];

// Phases are a value, not a route. Locally the session owns it and each phase hands control on
// when it is done; online the server reports it and this switch is untouched — which was the whole
// point of dropping the router in phase −1.
function Game() {
	const [{ pieces }] = useContext(StateContext);
	const session = useSession();
	const online = session.mode === 'online';

	// Was a <Redirect> inside PlayPhase. Deriving it keeps it idempotent. Online the server says
	// so instead, since it is the one that knows the game is over.
	const finished = online ? session.phase === END : pz.hasGameFinished(pieces);
	const phase = finished ? END : session.phase;

	// The server sends the room and the snapshot as separate frames, so on a rejoin the phase can
	// say "play" a beat before any players exist. Rendering the board against an empty table threw
	// on py.getTurn, which is what a refresh mid-game used to do.
	const waitingForState = NEEDS_GAME_STATE.includes(phase) && !session.synced;

	// Online, everything before the game starts is the lobby: making a room, sharing a code and
	// waiting for players. Locally it is the hot-seat name form.
	const preGame = online ? <LobbyPhase /> : <StartPhase onReady={() => session.actions.advance(ALIGNMENT)} />;

	return (
		<DragProvider>
			<GlobalStyle />
			<ConnectionBanner />

			{waitingForState ? (
				<Title>Loading the game…</Title>
			) : (
				<>
					{(phase === START || phase === null) && preGame}
					{phase === ALIGNMENT && (
						<AlignmentPhase
							online={online}
							onReady={() => (online ? session.actions.ready() : session.actions.advance(PLAY))}
						/>
					)}
					{phase === PLAY && <PlayPhase />}
					{phase === END && <EndPhase />}
				</>
			)}
		</DragProvider>
	);
}

export default withState(Game);
