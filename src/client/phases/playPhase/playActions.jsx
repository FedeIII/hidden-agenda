import { useContext, useCallback } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import useBooleanState from 'Hooks/useBooleanState';
import { useCanAct, useCanSnipe } from 'Hooks/useSession';
import { snipe } from 'Game/actions';
import { Button } from 'Client/components/button';
import { Actions, Action, ActionButton } from './components';
import AccuseScreen from './accuseScreen';
import RevealScreen from './revealScreen';
import AlignmentScreen from './alignmentScreen';

// Not gated on canAct like every other action here: sniping is the rest of the table's answer to
// the move the player on turn has just made, so it is theirs and not the mover's.
function useSnipe() {
	const [{ pieces, snipe: armed }, dispatch] = useContext(StateContext);
	const canSnipe = useCanSnipe();

	const isSniperOnBoard = pz.isSniperOnBoard(pieces);

	const onSnipe = useCallback(() => {
		if (isSniperOnBoard && canSnipe) {
			dispatch(snipe());
		}
	}, [isSniperOnBoard, canSnipe, dispatch]);

	return [canSnipe, onSnipe, armed];
}

// Accusing and revealing are screens now rather than rows of buttons that grew out of the bar. Both
// are decisions with a price — a wrong accusation is spent forever, a reveal costs fifty points — and
// neither was saying so from inside a strip of chips three items wide.
//
// No auto-close on a turn change for any of them: a screen covers NEXT TURN, so the turn cannot move
// while one is open. See the note in alignmentScreen.jsx.
function useScreens() {
	const [isAccuseShown, showAccuse, hideAccuse] = useBooleanState(false);
	const [isRevealShown, showReveal, hideReveal] = useBooleanState(false);
	const [isAlignmentShown, showAlignment, hideAlignment] = useBooleanState(false);

	return {
		accuse: { shown: isAccuseShown, show: showAccuse, hide: hideAccuse },
		reveal: { shown: isRevealShown, show: showReveal, hide: hideReveal },
		alignment: { shown: isAlignmentShown, show: showAlignment, hide: hideAlignment },
	};
}

function PlayActions() {
	const [{ players }] = useContext(StateContext);
	const canAct = useCanAct();
	const [canSnipe, onSnipe, isSnipeArmed] = useSnipe();
	const screens = useScreens();

	const player = players.find(entry => entry.turn);
	// Both alignments already public means there is nothing left to reveal, and both accusations spent
	// means there is nothing left to accuse. A dead button that says why beats one that just sits there.
	const canReveal = py.isRevealActive(players) && canAct;
	const canAccuse = (player.allowedToAccuse.friend || player.allowedToAccuse.foe) && canAct;

	return (
		<Actions>
			<Action>
				{/* A toggle, and it says so: with a shot lined up the table can either take it or
				    stand down, and standing down is what gives the turn back to the player who
				    moved. */}
				<Button id="snipe" small $primary active={canSnipe} onClick={onSnipe}>
					{isSnipeArmed ? 'STAND DOWN' : 'SNIPE!'}
				</Button>
			</Action>

			<Action>
				<ActionButton id="accuse" active={canAccuse} onClick={() => canAccuse && screens.accuse.show()}>
					ACCUSE
				</ActionButton>
				<ActionButton id="reveal" active={canReveal} onClick={() => canReveal && screens.reveal.show()}>
					REVEAL
				</ActionButton>
			</Action>

			<Action>
				<Button id="friend-foe" small active onClick={screens.alignment.show}>
					FRIEND &amp; FOE
				</Button>
			</Action>

			{/* Outside the bar on purpose: these are screens, not menus that grow out of a button. */}
			{screens.accuse.shown && <AccuseScreen onClose={screens.accuse.hide} />}
			{screens.reveal.shown && <RevealScreen onClose={screens.reveal.hide} />}
			{screens.alignment.shown && <AlignmentScreen onClose={screens.alignment.hide} />}
		</Actions>
	);
}

export default PlayActions;
