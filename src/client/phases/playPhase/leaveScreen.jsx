import { useContext } from 'react';
import { StateContext } from 'State';
import { MIN_PLAYERS } from 'Domain/py';
import useSession from 'Hooks/useSession';
import { Button } from 'Client/components/button';
import { ScreenStyled, ScreenBody, ScreenTitle, ScreenNote, ScreenChoices, VerdictCost } from './components';

// A screen rather than a second click on a chip in the bar, for the reason accusing and revealing are
// screens: it is a decision with a price, and the price is the whole of what a player needs to know
// before pressing it. Leaving a game that has been dealt is final — a started room takes no new seats,
// so there is no way back in — and the bar is three items wide and says nothing.
//
// It also sits over NEXT TURN, like every other screen here, so the turn cannot move while somebody is
// deciding. See the note in alignmentScreen.jsx.
function LeaveScreen({ onClose }) {
	const [{ players }] = useContext(StateContext);
	const { actions } = useSession();

	// The table as it would be without this player. Below the minimum means the game ends here, and for
	// everybody — so say so, because it is a different decision from walking away from a game that
	// carries on without you.
	const strands = players.length - 1 < MIN_PLAYERS;

	return (
		<ScreenStyled id="leave-screen" role="dialog" aria-modal="true" aria-label="Leave the game">
			<ScreenBody>
				<ScreenTitle>{strands ? 'End the game?' : 'Leave the game?'}</ScreenTitle>

				<ScreenNote id="leave-note">
					{strands
						? `a game needs ${MIN_PLAYERS}, so the last player leaves with you`
						: 'the game carries on without you'}
				</ScreenNote>

				<VerdictCost id="leave-cost">
					{strands
						? 'nobody scores, and the room is gone'
						: 'a started room takes no new seats, so there is no way back'}
				</VerdictCost>

				{/* ScreenChoices rather than Buttons: two controls side by side need the gap, and in Dossier
				    they are stamps that would otherwise share an edge. Neither is louder than the other —
				    both are decisions, which is the point of the screen. */}
				<ScreenChoices>
					<Button id="leave-confirm" active onClick={actions.leave}>
						{strands ? 'END IT' : 'LEAVE'}
					</Button>
					<Button id="leave-close" active onClick={onClose}>
						BACK TO THE BOARD
					</Button>
				</ScreenChoices>
			</ScreenBody>
		</ScreenStyled>
	);
}

export default LeaveScreen;
