import { useCallback, useContext } from 'react';
import { StateContext } from 'State';
import py, { REVEAL_COST } from 'Domain/py';
import { revealFriend, revealFoe } from 'Game/actions';
import useT from 'Client/i18n';
import { Button, Buttons } from 'Client/components/button';
import { Alignments, AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import { ScreenStyled, ScreenBody, ScreenTitle, ScreenNote, VerdictCost } from './components';

// Going public, on purpose.
//
// The old menu was two chips reading "Friend" and "Foe" in the action bar, and it said nothing about
// either half of the trade: that it costs fifty points, and that it buys immediate control of that
// team whether or not its CEO is on the board. Both facts decide whether the button is a good idea,
// so both are on it.
//
// The cards are the ones the game deals, at the size it deals them, and a revealed one stays on
// screen turned face up — so the screen is also the answer to "what have I already given away".
function RevealScreen({ onClose }) {
	const t = useT();
	const [{ players }, dispatch] = useContext(StateContext);

	const player = players.find(entry => entry.turn);
	const friendRevealed = py.isOwnFriendRevealed(players);
	const foeRevealed = py.isOwnFoeRevealed(players);

	const onFriend = useCallback(() => !friendRevealed && dispatch(revealFriend()), [friendRevealed, dispatch]);
	const onFoe = useCallback(() => !foeRevealed && dispatch(revealFoe()), [foeRevealed, dispatch]);

	const both = friendRevealed && foeRevealed;

	return (
		<ScreenStyled id="reveal-screen" role="dialog" aria-modal="true" aria-label={t('revealScreen.title')}>
			<ScreenBody>
				<ScreenTitle>{t(both ? 'revealScreen.bothTitle' : 'revealScreen.title')}</ScreenTitle>

				<ScreenNote id="reveal-note">
					{both ? t('revealScreen.bothNote') : t('revealScreen.note', { points: REVEAL_COST })}
				</ScreenNote>

				<Alignments>
					<AlignmentFriend
						id="reveal-friend"
						active={!friendRevealed}
						disabled={friendRevealed}
						player={player.name}
						team={friendRevealed ? player.alignment.friend : undefined}
						onClick={onFriend}
					>
						{friendRevealed ? t(`team.${player.alignment.friend}`) : null}
					</AlignmentFriend>
					<AlignmentFoe
						id="reveal-foe"
						active={!foeRevealed}
						disabled={foeRevealed}
						player={player.name}
						team={foeRevealed ? player.alignment.foe : undefined}
						onClick={onFoe}
					>
						{foeRevealed ? t(`team.${player.alignment.foe}`) : null}
					</AlignmentFoe>
				</Alignments>

				{/* Face up rather than gone: what a reveal has already cost is as much use to a player as
				    what the next one would cost. */}
				{(friendRevealed || foeRevealed) && (
					<VerdictCost id="reveal-spent">
						{t('revealScreen.spent', { points: REVEAL_COST * (Number(friendRevealed) + Number(foeRevealed)) })}
					</VerdictCost>
				)}

				<Buttons>
					<Button id="reveal-close" active onClick={onClose}>
						{t(friendRevealed || foeRevealed ? 'common.backToBoard' : 'revealScreen.revealNothing')}
					</Button>
				</Buttons>
			</ScreenBody>
		</ScreenStyled>
	);
}

export default RevealScreen;
