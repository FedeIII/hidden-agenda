import { useContext, useState } from 'react';
import { StateContext } from 'State';
import py, { REVEAL_COST } from 'Domain/py';
import { TEAM_NAMES } from 'Domain/teams';
import { accuse } from 'Game/actions';
import useT from 'Client/i18n';
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

// Every sentence on this screen names an alignment, and half of them put it somewhere a language
// gets to choose — "SARA's foe" is "el enemigo de SARA". So a key per alignment rather than one
// sentence with the word dropped into it: `friendYes`, `foeNo`, `blockedFriend`. Verbose, and the
// only way a translation can put the words in the order its own grammar wants.
const KEY = { friend: 'Friend', foe: 'Foe' };

// What a player has already gone public about. Team names in, not the player: same reason as
// `blockedBecause` below — a function that takes both a player object and an opaque callable is one
// the React Compiler has to assume mutates the object, and `players` is where `accuser` comes from.
function known(t, friendTeam, foeTeam) {
	const parts = [];

	if (friendTeam) {
		parts.push(t('accuseScreen.knownFriend', { team: friendTeam }));
	}

	if (foeTeam) {
		parts.push(t('accuseScreen.knownFoe', { team: foeTeam }));
	}

	return parts.length ? parts.join(' · ') : t('accuseScreen.nothingPublic');
}

// Why an alignment cannot be accused, in the words of the thing standing in the way. Two reasons, and
// they are completely different: you have already spent this accusation, or there is nothing left to
// take because the answer is already on the table.
//
// Two booleans rather than the two players they are read off. The caller does the reading, because
// handing a player object to a function that also takes an opaque callable is enough for the React
// Compiler to give up on the memoized handler next door — it cannot prove the object is not mutated
// in here, so `accuser` in a dependency list becomes something that "may be modified later".
function blockedBecause(t, allowed, alreadyPublic, alignment) {
	if (!allowed) {
		return t(`accuseScreen.blocked${KEY[alignment]}`);
	}

	if (alreadyPublic) {
		return t('accuseScreen.blockedPublic');
	}

	return null;
}

function AccuseScreen({ onClose }) {
	const t = useT();
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
	// No `useCallback` here any more, and that is the fix rather than a regression.
	//
	// Every string on this screen now comes from `t`, which the React Compiler sees as an opaque
	// value out of an unknown hook — so it can no longer prove that nothing in this render mutates
	// `players`, which is where `accuser` comes from. A hand-written dependency list naming
	// `accuser.name` is then a list the compiler cannot honour, and `preserve-manual-memoization`
	// says so: it would rather skip optimising the whole component than quietly keep a memo whose
	// premise it cannot check.
	//
	// The compiler memoizes this handler for us either way, and nothing depends on its identity — it
	// is an onClick. So the manual memo was the only thing standing between this file and a clean
	// lint, and it was not buying anything.
	const onAccuse = team => {
		dispatch(accuse({ accuser: accuser.name, accusee: target, alignment, team }));
		setTarget(null);
		setAlignment(null);
		setAnswered(true);
	};

	// The result of the last guess, held on the accuser by the reducer so it survives the round trip
	// to a server and back rather than being a fact only this tab knows.
	if (verdict) {
		const subject = verdict.accusee;
		const key = KEY[verdict.alignment];

		return (
			<ScreenStyled id="accuse-screen" role="dialog" aria-modal="true" aria-label={t('accuseScreen.verdictTitle')}>
				<ScreenBody>
					<ScreenTitle>{t('accuseScreen.verdictTitle')}</ScreenTitle>

					<Verdict id="accuse-verdict" $correct={verdict.correct}>
						<VerdictHead id="accuse-outcome" $correct={verdict.correct}>
							{t(verdict.correct ? 'accuseScreen.correct' : 'accuseScreen.wrong')}
						</VerdictHead>

						<VerdictLine id="accuse-detail">
							{t(`accuseScreen.detail${key}${verdict.correct ? 'Yes' : 'No'}`, {
								name: subject,
								team: t(`team.${verdict.team}`),
							})}
						</VerdictLine>

						<VerdictCost id="accuse-consequence">
							{verdict.correct
								? t('accuseScreen.costCorrect', { name: subject, points: REVEAL_COST })
								: t(`accuseScreen.costWrong${key}`)}
						</VerdictCost>
					</Verdict>

					<Buttons>
						<Button id="accuse-close" active onClick={onClose}>
							{t('common.backToBoard')}
						</Button>
					</Buttons>
				</ScreenBody>
			</ScreenStyled>
		);
	}

	return (
		<ScreenStyled id="accuse-screen" role="dialog" aria-modal="true" aria-label={t('accuseScreen.title')}>
			<ScreenBody>
				{!accusee && (
					<>
						<ScreenTitle>{t('accuseScreen.whom')}</ScreenTitle>
						<ScreenNote>{t('accuseScreen.cost')}</ScreenNote>
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
										<ChoiceWhy>
											{known(
												t,
												player.revealed.friend ? t(`team.${player.alignment.friend}`) : null,
												player.revealed.foe ? t(`team.${player.alignment.foe}`) : null,
											)}
										</ChoiceWhy>
									</Choice>
								),
							)}
						</ScreenChoices>
					</>
				)}

				{accusee && !alignment && (
					<>
						<ScreenTitle>{t('accuseScreen.whichAlignment', { name: accusee.name })}</ScreenTitle>
						<ScreenChoices>
							{['friend', 'foe'].map(which => {
								const why = blockedBecause(t, accuser.allowedToAccuse[which], accusee.revealed[which], which);

								return (
									<Choice
										key={which}
										id={`accuse-${which}`}
										type="button"
										active={!why}
										onClick={() => !why && setAlignment(which)}
									>
										{t(`alignment.${which}.word`)}
										{why && <ChoiceWhy>{why}</ChoiceWhy>}
									</Choice>
								);
							})}
						</ScreenChoices>
					</>
				)}

				{accusee && alignment && (
					<>
						<ScreenTitle>{t(`accuseScreen.whichTeam${KEY[alignment]}`, { name: accusee.name })}</ScreenTitle>
						<ScreenChoices>
							{/* The teams still come from the domain record, because what is being iterated is
							    the four team INDICES — what a player reads is looked up per index. */}
							{Object.keys(TEAM_NAMES).map(team => (
								<AccuseTeam key={team} id={`accuse-team-${team}`} active team={team} onClick={() => onAccuse(team)}>
									{t(`team.${team}`)}
								</AccuseTeam>
							))}
						</ScreenChoices>
					</>
				)}

				<Buttons>
					<Button id="accuse-close" active onClick={onClose}>
						{t('common.cancel')}
					</Button>
				</Buttons>
			</ScreenBody>
		</ScreenStyled>
	);
}

export default AccuseScreen;
