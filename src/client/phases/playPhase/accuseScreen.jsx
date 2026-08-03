import { useCallback, useContext, useState } from 'react';
import { StateContext } from 'State';
import py, { REVEAL_COST } from 'Domain/py';
import { TEAM_NAMES } from 'Domain/teams';
import { accuse } from 'Game/actions';
import { Button, Buttons } from 'Client/components/button';
import {
	ScreenStyled,
	ScreenBody,
	ScreenTitle,
	ScreenNote,
	ScreenChoices,
	Choice,
	ChoiceWhy,
	AccuseTeam,
	Verdict,
	VerdictHead,
	VerdictLine,
	VerdictCost,
} from './components';

// Accusing somebody, and being told what happened.
//
// The flow was three rows of buttons in the action bar that closed silently when the guess was in,
// which left a player with no idea of the two things that matter most: whether they were right, and
// whether they had just spent their one and only chance at that alignment. A wrong guess costs the
// right to guess that alignment again for the rest of the game, and nothing said so — before, during
// or after.
//
// Each step now also carries the evidence the choice should be made on. Who has already gone public,
// what about, and how it happened.

const WORDS = { friend: 'friend', foe: 'foe' };

function known(player) {
	const parts = [];

	if (player.revealed.friend) {
		parts.push(`friend: ${TEAM_NAMES[player.alignment.friend]}`);
	}

	if (player.revealed.foe) {
		parts.push(`foe: ${TEAM_NAMES[player.alignment.foe]}`);
	}

	return parts.length ? parts.join(' · ') : 'nothing public yet';
}

// Why an alignment cannot be accused, in the words of the thing standing in the way. Two reasons, and
// they are completely different: you have already spent this accusation, or there is nothing left to
// take because the answer is already on the table.
function blockedBecause(accuser, accusee, alignment) {
	if (!accuser.allowedToAccuse[alignment]) {
		return `you guessed a ${WORDS[alignment]} wrong already`;
	}

	if (accusee.revealed[alignment]) {
		return 'already public';
	}

	return null;
}

function AccuseScreen({ onClose }) {
	const [{ players }, dispatch] = useContext(StateContext);
	const [target, setTarget] = useState(null);
	const [alignment, setAlignment] = useState(null);
	// Whether a guess was made while this screen was open. `lastAccusation` is durable — it is how the
	// accuser finds out what happened even in an online game — so on its own it would put the previous
	// verdict back up every time the screen is opened again.
	const [answered, setAnswered] = useState(false);

	const accuser = players.find(player => player.turn);
	const accusee = players.find(player => player.name === target) || null;
	const verdict = answered ? accuser.lastAccusation : null;

	const onAccuse = useCallback(
		team => {
			dispatch(accuse({ accuser: accuser.name, accusee: target, alignment, team }));
			setTarget(null);
			setAlignment(null);
			setAnswered(true);
		},
		[dispatch, accuser.name, target, alignment],
	);

	// The result of the last guess, held on the accuser by the reducer so it survives the round trip
	// to a server and back rather than being a fact only this tab knows.
	if (verdict) {
		const subject = verdict.accusee;
		const word = WORDS[verdict.alignment];

		return (
			<ScreenStyled id="accuse-screen" role="dialog" aria-modal="true" aria-label="Your accusation">
				<ScreenBody>
					<ScreenTitle>Your accusation</ScreenTitle>

					<Verdict id="accuse-verdict" $correct={verdict.correct}>
						<VerdictHead id="accuse-outcome" $correct={verdict.correct}>
							{verdict.correct ? 'Correct' : 'Wrong'}
						</VerdictHead>

						<VerdictLine id="accuse-detail">
							{subject}&apos;s {word} {verdict.correct ? 'is' : 'is not'} {TEAM_NAMES[verdict.team]}
						</VerdictLine>

						<VerdictCost id="accuse-consequence">
							{verdict.correct
								? `it is public now, and it cost ${subject} ${REVEAL_COST} points`
								: `you may never accuse a ${word} again`}
						</VerdictCost>
					</Verdict>

					<Buttons>
						<Button id="accuse-close" active onClick={onClose}>
							BACK TO THE BOARD
						</Button>
					</Buttons>
				</ScreenBody>
			</ScreenStyled>
		);
	}

	return (
		<ScreenStyled id="accuse-screen" role="dialog" aria-modal="true" aria-label="Accuse a player">
			<ScreenBody>
				{!accusee && (
					<>
						<ScreenTitle>Accuse whom?</ScreenTitle>
						<ScreenNote>a wrong guess costs you that accusation for the rest of the game</ScreenNote>
						<ScreenChoices>
							{players.map((player, index) =>
								py.isPlayerTurn(players, player) ? null : (
									<Choice
										key={player.name}
										id={`accuse-player-${index}`}
										type="button"
										active
										onClick={() => setTarget(player.name)}
									>
										{player.name}
										<ChoiceWhy>{known(player)}</ChoiceWhy>
									</Choice>
								),
							)}
						</ScreenChoices>
					</>
				)}

				{accusee && !alignment && (
					<>
						<ScreenTitle>{accusee.name}&apos;s what?</ScreenTitle>
						<ScreenChoices>
							{['friend', 'foe'].map(which => {
								const why = blockedBecause(accuser, accusee, which);

								return (
									<Choice
										key={which}
										id={`accuse-${which}`}
										type="button"
										active={!why}
										onClick={() => !why && setAlignment(which)}
									>
										{WORDS[which]}
										{why && <ChoiceWhy>{why}</ChoiceWhy>}
									</Choice>
								);
							})}
						</ScreenChoices>
					</>
				)}

				{accusee && alignment && (
					<>
						<ScreenTitle>
							{accusee.name}&apos;s {WORDS[alignment]} is which team?
						</ScreenTitle>
						<ScreenChoices>
							{Object.keys(TEAM_NAMES).map(team => (
								<AccuseTeam key={team} id={`accuse-team-${team}`} active team={team} onClick={() => onAccuse(team)}>
									{TEAM_NAMES[team]}
								</AccuseTeam>
							))}
						</ScreenChoices>
					</>
				)}

				<Buttons>
					<Button id="accuse-close" active onClick={onClose}>
						CANCEL
					</Button>
				</Buttons>
			</ScreenBody>
		</ScreenStyled>
	);
}

export default AccuseScreen;
