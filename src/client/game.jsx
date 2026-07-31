import { useState, useContext } from 'react';

import GlobalStyle from './globalStyle';
import { DragProvider } from './drag';
import { withState, StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { PHASES } from 'Domain/phases';
import useTest from 'Hooks/useTest';
import StartPhase from 'Phases/startPhase';
import AlignmentPhase from 'Phases/alignmentPhase';
import PlayPhase from 'Phases/playPhase';
import EndPhase from 'Phases/endPhase';

const { START, ALIGNMENT, PLAY, END } = PHASES;

// The ?test= mocks used to reach their phase by falling through two <Redirect>s.
function initialPhase(test) {
	if (test === 'play') {
		return PLAY;
	}

	if (test === 'endgame') {
		return END;
	}

	return START;
}

// There are no routes to navigate, so there is no router: phases are a value, and each phase
// hands control on when it is done. Phase 2 replaces this useState with the phase the server
// reports, leaving the switch below untouched.
function Game() {
	const [{ pieces }] = useContext(StateContext);
	const test = useTest();
	const [phase, setPhase] = useState(() => initialPhase(test));

	// Was a <Redirect> inside PlayPhase. Deriving it keeps it idempotent.
	const activePhase = pz.hasGameFinished(pieces) ? END : phase;

	return (
		<DragProvider>
			<GlobalStyle />
			{activePhase === START && <StartPhase onReady={() => setPhase(ALIGNMENT)} />}
			{activePhase === ALIGNMENT && <AlignmentPhase onReady={() => setPhase(PLAY)} />}
			{activePhase === PLAY && <PlayPhase />}
			{activePhase === END && <EndPhase />}
		</DragProvider>
	);
}

export default withState(Game);
