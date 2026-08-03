import { useMemo, useContext, useCallback, useEffect } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import { TEAM_NAMES } from 'Domain/teams';
import py from 'Domain/py';
import useBooleanState from 'Hooks/useBooleanState';
import { useCanAct, useCanSnipe } from 'Hooks/useSession';
import { snipe, revealFriend, revealFoe } from 'Game/actions';
import { AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import { Button } from 'Client/components/button';
import {
	Actions,
	Action,
	ActionCancelButton,
	ActionButton,
	RevealContainer,
	RevealMessage,
	RevealActions,
	RevealCard,
} from './components';
import AccuseMenu from './accuseMenu';
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

function useAccuseMenu() {
	const [isAccusedShown, showAccuseMenu, hideAccuseMenu] = useBooleanState(false);
	const [{ players }] = useContext(StateContext);
	const playerName = py.getTurn(players);

	useEffect(() => hideAccuseMenu(), [playerName, hideAccuseMenu]);

	return [isAccusedShown, showAccuseMenu, hideAccuseMenu];
}

function useRevealMenu() {
	const [isRevealShown, showRevealMenu, hideRevealMenu] = useBooleanState(false);
	const [{ players }] = useContext(StateContext);
	const playerName = py.getTurn(players);

	useEffect(() => hideRevealMenu(), [playerName, hideRevealMenu]);

	const isRevealActive = useMemo(() => py.isRevealActive(players), [players]);

	const onReveal = useCallback(() => {
		if (isRevealActive) {
			showRevealMenu();
		}
	}, [isRevealActive, showRevealMenu]);

	return [isRevealShown, isRevealActive, onReveal, hideRevealMenu];
}

// No auto-close on a turn change, and that is a decision rather than an omission.
//
// The leak worth worrying about is a pair of cards still up when the next player takes the mouse, and
// the screen already makes that impossible: it covers the viewport, so NEXT TURN is behind it and
// nobody can hand the turn over without putting the cards away first. An effect that closed on a
// turn change would be unreachable code in hot-seat — and actively wrong online, where somebody
// else's move can land at any moment and your own two cards have not changed.
function useAlignmentScreen() {
	return useBooleanState(false);
}

function RevealedAlignments() {
	const [{ players }] = useContext(StateContext);
	const player = useMemo(() => players.find(player => player.turn), [players]);

	const showFriend = player.revealed.friend;
	const showFoe = player.revealed.foe;

	return (
		<>
			{showFriend && (
				<AlignmentFriend id="revealed-friend" small disabled player={player.name} team={player.alignment.friend}>
					{TEAM_NAMES[player.alignment.friend]}
				</AlignmentFriend>
			)}
			{showFoe && (
				<AlignmentFoe id="revealed-foe" small disabled player={player.name} team={player.alignment.foe}>
					{TEAM_NAMES[player.alignment.foe]}
				</AlignmentFoe>
			)}
		</>
	);
}

function RevealAlignmentMenu(props) {
	const { onClose } = props;
	const [{ players }, dispatch] = useContext(StateContext);

	const player = useMemo(() => players.find(player => player.turn), [players]);

	const isFriendRevealed = py.isOwnFriendRevealed(players);
	const isFoeRevealed = py.isOwnFoeRevealed(players);

	const onRevealFriend = useCallback(() => dispatch(revealFriend()), [dispatch]);
	const onRevealFoe = useCallback(() => dispatch(revealFoe()), [dispatch]);

	return (
		<RevealContainer>
			<RevealMessage>Reveal Alignment: </RevealMessage>
			<RevealActions>
				{isFriendRevealed ? (
					<AlignmentFriend small disabled player={player.name} team={player.alignment.friend}>
						{TEAM_NAMES[player.alignment.friend]}
					</AlignmentFriend>
				) : (
					<RevealCard id="reveal-friend" onClick={onRevealFriend}>
						Friend
					</RevealCard>
				)}

				{isFoeRevealed ? (
					<AlignmentFoe small disabled player={player.name} team={player.alignment.foe}>
						{TEAM_NAMES[player.alignment.foe]}
					</AlignmentFoe>
				) : (
					<RevealCard id="reveal-foe" onClick={onRevealFoe}>
						Foe
					</RevealCard>
				)}

				<ActionCancelButton small active onClick={onClose}>
					CANCEL
				</ActionCancelButton>
			</RevealActions>
		</RevealContainer>
	);
}

function PlayActions() {
	const canAct = useCanAct();
	const [canSnipe, onSnipe, isSnipeArmed] = useSnipe();
	const [isAccusedShown, showAccuseMenu, hideAccuseMenu] = useAccuseMenu();
	const [isRevealShown, isRevealActive, onReveal, hideReveal] = useRevealMenu();
	const [isAlignmentShown, showAlignment, hideAlignment] = useAlignmentScreen();

	const isMainActions = !isAccusedShown && !isRevealShown;

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
				{isMainActions && (
					<>
						<ActionButton active={canAct} id="accuse" onClick={showAccuseMenu}>
							ACCUSE
						</ActionButton>{' '}
						<RevealedAlignments />{' '}
						<ActionButton id="reveal" active={isRevealActive && canAct} onClick={onReveal}>
							REVEAL
						</ActionButton>
					</>
				)}
				{isRevealShown && <RevealAlignmentMenu onClose={hideReveal} />}
				{isAccusedShown && <AccuseMenu onClose={hideAccuseMenu} />}
			</Action>
			<Action>
				<Button id="friend-foe" small active onClick={showAlignment}>
					FRIEND &amp; FOE
				</Button>
			</Action>
			{/* Outside the bar on purpose: it is a screen, not a menu that grows out of a button. */}
			{isAlignmentShown && <AlignmentScreen onClose={hideAlignment} />}
		</Actions>
	);
}

export default PlayActions;
