import useBooleanState from 'Hooks/useBooleanState';
import { useCanAccuse, useCanReveal } from 'Hooks/useSession';
import useSnipe from 'Hooks/useSnipe';
import { Button } from 'Client/components/button';
import useT from 'Client/i18n';
import LeaveGame from 'Client/components/leaveGame';
import { Actions, Action, ActionButton } from './components';
import AccuseScreen from './accuseScreen';
import RevealScreen from './revealScreen';
import AlignmentScreen from './alignmentScreen';
import LeaveScreen from './leaveScreen';

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
	const [isLeaveShown, showLeave, hideLeave] = useBooleanState(false);

	return {
		accuse: { shown: isAccuseShown, show: showAccuse, hide: hideAccuse },
		reveal: { shown: isRevealShown, show: showReveal, hide: hideReveal },
		alignment: { shown: isAlignmentShown, show: showAlignment, hide: hideAlignment },
		leave: { shown: isLeaveShown, show: showLeave, hide: hideLeave },
	};
}

function PlayActions() {
	const t = useT();
	const [canSnipe, onSnipe, isSnipeArmed] = useSnipe();
	const canReveal = useCanReveal();
	const canAccuse = useCanAccuse();
	const screens = useScreens();

	return (
		<Actions>
			<Action>
				{/* A toggle, and it says so: with a shot lined up the table can either take it or
				    stand down, and standing down is what gives the turn back to the player who
				    moved. */}
				<Button id="snipe" small $primary active={canSnipe} onClick={onSnipe}>
					{t(isSnipeArmed ? 'play.standDown' : 'play.snipe')}
				</Button>
			</Action>

			<Action>
				<ActionButton id="accuse" active={canAccuse} onClick={() => canAccuse && screens.accuse.show()}>
					{t('play.accuse')}
				</ActionButton>
				<ActionButton id="reveal" active={canReveal} onClick={() => canReveal && screens.reveal.show()}>
					{t('play.reveal')}
				</ActionButton>
			</Action>

			{/* Both of these are about the player rather than about the board: the cards they were dealt,
			    and the seat they are sitting in. They share a group rather than LEAVE getting a fourth one
			    of its own, because the bar is `flex-basis: 33%` three ways and the landscape phone layout
			    has no slack to give. LEAVE renders nothing at all in a hot-seat game. */}
			<Action>
				<Button id="friend-foe" small active onClick={screens.alignment.show}>
					{t('play.friendFoe')}
				</Button>
				<LeaveGame onClick={screens.leave.show} />
			</Action>

			{/* Outside the bar on purpose: these are screens, not menus that grow out of a button. */}
			{screens.accuse.shown && <AccuseScreen onClose={screens.accuse.hide} />}
			{screens.reveal.shown && <RevealScreen onClose={screens.reveal.hide} />}
			{screens.alignment.shown && <AlignmentScreen onClose={screens.alignment.hide} />}
			{screens.leave.shown && <LeaveScreen onClose={screens.leave.hide} />}
		</Actions>
	);
}

export default PlayActions;
