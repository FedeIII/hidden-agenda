import { useContext, useMemo, useState } from 'react';
import { StateContext } from 'State';
import py, { BASE_POINTS, REVEAL_COST } from 'Domain/py';
import { TEAM_NAMES } from 'Domain/teams';
import useSession from 'Hooks/useSession';
import { Button, Buttons } from 'Client/components/button';
import { Alignments, AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import {
	ScreenStyled,
	ScreenNote,
	ScreenBody,
	Ledger,
	LedgerRow,
	LedgerWho,
	LedgerName,
	LedgerScore,
	LedgerNote,
	LedgerPair,
	LedgerCell,
	LedgerKey,
	LedgerHow,
	Redacted,
} from './components';

// Your own two cards, at the size they were dealt at.
//
// This used to be two label-sized chips wedged into the action bar between ACCUSE and REVEAL, which
// is a strange way to show a player the single most important thing they know. It is now the same
// pair, the same green and red, and the same team colours as the screen they were dealt on — so
// remembering them is looking at them again rather than reading a summary of them.
//
// It is also the one place in the game that deliberately covers the table, and the only one. The
// rule everywhere else is that nothing may sit over the board, because every hexagon is a
// transparent DOM element and an overlay silently eats the clicks. This is the safe case: it is
// opaque, modal, and dismissed by the player. While it is up there is nothing on the board anyone
// should be clicking.

// Whose cards these are.
//
// Online: always the seat's own, never the turn holder's. That was a real bug — the old reminder
// read `players.find(player => player.turn)`, so on somebody else's turn it went looking for
// *their* pair, which is the one thing this game must never show. It only ever looked harmless
// because the server redacts what it sends, so the fields arrived null and the cards came up blank
// instead of lying.
//
// Hot-seat: the turn holder, because there is one screen and the player on turn is the person
// sitting in front of it.
function useOwnPlayer() {
	const session = useSession();
	const [{ players }] = useContext(StateContext);

	return useMemo(() => {
		if (session.mode === 'online') {
			return players.find(player => player.name === session.name) || null;
		}

		return players.find(player => player.turn) || null;
	}, [session.mode, session.name, players]);
}

// What the rest of the table has admitted to, and what it has not.
//
// A revealed alignment is public and was paid for, so it belongs on screen. An unrevealed one is a
// black bar rather than an absence, because "there is something here you are not allowed to see" is
// a better thing to show a player than nothing at all — redaction as a state, which is the premise
// of the game written down as an interface.
// Two very different facts, and the state used to record only that one of them had happened: an
// alignment is public because its owner paid to reveal it, or because somebody guessed it correctly.
function how(player, alignment) {
	const by = player.exposed && player.exposed[alignment];

	return by ? `accused by ${by}` : 'revealed';
}

// What everyone is on, which is the same table read as a score.
//
// Only the baseline, and that is not a simplification: the rest of a score is the friend team's points
// less the foe team's, which needs a pair of cards this game spends its whole length hiding. The
// hundred and the fifties are public for everybody — `revealed` survives redaction because the ledger
// beside it is built out of the same field — so this is exactly as much of the score as can honestly
// be shown before the end, and it is the half a player can do something about.
//
// It comes from `py.getBaseScore`, the same function the final score sheet starts from, so a player
// cannot be told one number here and find a different one behind it at the end.
function BaseScore({ player }) {
	const base = py.getBaseScore(player);

	return (
		<LedgerScore id={`ledger-score-${player.name}`} data-base={base} $spent={base < BASE_POINTS}>
			<LedgerKey>on</LedgerKey>
			{base}
		</LedgerScore>
	);
}

function TableLedger({ players, own }) {
	return (
		<>
			<Ledger id="friend-foe-ledger">
				{players.map(player => {
					const isOwn = !!own && player.name === own.name;
					const { friend, foe } = player.alignment;

					return (
						<LedgerRow key={player.name} $own={isOwn}>
							<LedgerWho>
								<LedgerName>
									{player.name}
									{isOwn ? ' (you)' : ''}
								</LedgerName>
								<BaseScore player={player} />
							</LedgerWho>
							<LedgerPair>
								<LedgerCell $alignment="friend">
									<LedgerKey>friend</LedgerKey>
									{isOwn || player.revealed.friend ? TEAM_NAMES[friend] : <Redacted aria-label="withheld" />}
									{player.revealed.friend && <LedgerHow>{how(player, 'friend')}</LedgerHow>}
								</LedgerCell>
								<LedgerCell $alignment="foe">
									<LedgerKey>foe</LedgerKey>
									{isOwn || player.revealed.foe ? TEAM_NAMES[foe] : <Redacted aria-label="withheld" />}
									{player.revealed.foe && <LedgerHow>{how(player, 'foe')}</LedgerHow>}
								</LedgerCell>
							</LedgerPair>
						</LedgerRow>
					);
				})}
			</Ledger>

			<LedgerNote id="friend-foe-base-note">
				everyone is on {BASE_POINTS} · an alignment becoming public costs its owner {REVEAL_COST} · the teams are
				counted at the end
			</LedgerNote>
		</>
	);
}

function AlignmentScreen({ onClose }) {
	const [{ players }] = useContext(StateContext);
	const session = useSession();
	const own = useOwnPlayer();

	// Hot-seat shares one screen, so the cards stay covered until somebody says the right person is
	// looking. Online the screen is yours and a gate would be friction with nothing behind it.
	const online = session.mode === 'online';
	const [uncovered, setUncovered] = useState(online);

	const name = own ? own.name : '';

	return (
		<ScreenStyled id="friend-foe-screen" role="dialog" aria-modal="true" aria-label="Your friend and foe">
			<ScreenBody>
				<ScreenNote id="friend-foe-eyes">{online ? 'nobody else can see these' : `only for ${name}'s eyes`}</ScreenNote>

				{!uncovered && (
					<Buttons>
						<Button id="friend-foe-confirm" active onClick={() => setUncovered(true)}>
							{name} IS LOOKING
						</Button>
					</Buttons>
				)}

				{uncovered && own && (
					<>
						<Alignments>
							<AlignmentFriend id="friend-foe-friend" disabled player={own.name} team={own.alignment.friend}>
								{TEAM_NAMES[own.alignment.friend]}
							</AlignmentFriend>
							<AlignmentFoe id="friend-foe-foe" disabled player={own.name} team={own.alignment.foe}>
								{TEAM_NAMES[own.alignment.foe]}
							</AlignmentFoe>
						</Alignments>

						<TableLedger players={players} own={own} />
					</>
				)}

				<Buttons>
					<Button id="friend-foe-close" active onClick={onClose}>
						PUT IT AWAY
					</Button>
				</Buttons>
			</ScreenBody>
		</ScreenStyled>
	);
}

export default AlignmentScreen;
