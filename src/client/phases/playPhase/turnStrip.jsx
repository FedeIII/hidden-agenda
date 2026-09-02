import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { StateContext } from 'State';
import py from 'Domain/py';
import { pz, NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END } from 'Domain/pieces';
import { SKINS, DEFAULT_SKIN } from 'Domain/skins';
import { Button } from 'Client/components/button';
import { useCanAct } from 'Hooks/useSession';
import useSkin from 'Hooks/useSkin';
import useT from 'Client/i18n';
import { nextTurn } from 'Game/actions';
import { Title } from 'Client/components/title';
import { prefersReducedMotion } from 'Client/motion';
import { Cell, CellKey, CellValue, CellMark, Initials, InitialBox, TurnAnnounceStyled, DELIVER_MS } from './components';

// The strip above the board, as the cells it always wanted to be.
//
// It used to be one sentence — "Player's turn: FEDE" — and a button. The three directions each read
// this same markup as something their own world already has: Dossier types it on a routing slip with
// a box per seat that has had the turn, Blueprint sets it in the ruled cells a drawing keeps its
// facts in, Vault mounts it on the rail across the top of the case. One structure, three readings,
// because moving it would move #next-turn and most of the suite clicks that. The reading now goes
// as far as the words themselves — see `TURN_KEY` below.
//
// It also finally says how close the game is to over. The game ends when three CEOs are dead and
// nothing on screen has ever mentioned it, which is a strange thing to keep to yourself.

// Whose turn it is, in each direction's own voice — and the words are the skin's business as much as
// the language's, exactly as `CONTROL:` and `SECTION A–A` are. Each direction already has a place a
// name goes: a file sits on somebody's desk, a drawing is drawn by somebody in its title block, and a
// case is open in front of one person at a time.
//
// It is a catalog key per direction rather than a seventh entry in `SKIN_WORDS`, and the difference
// is what the line IS. Those six are prefixes and flags with no node of their own, so `content` on a
// pseudo-element is the only place they could live. This one has a node — it is the label on the one
// fact at this table nobody may miss — so it stays a real string a reader can read, a spec can
// assert and `t()` can fall back to English for. The skin only chooses which of the three it is.
const TURN_KEY = {
	[SKINS.DOSSIER]: 'play.onTheDeskOf',
	[SKINS.BLUEPRINT]: 'play.drawnBy',
	[SKINS.VAULT]: 'play.caseOpenFor',
};

// The line the strip's first cell holds, as its own component, because the announcement is a copy of
// that cell flown in from the middle of the table and the two have to be the same markup — at the end
// of the flight they are the same size in the same place, and anything that differed would show as
// the swap. Only the one in the strip is `named`: `#turn-player` is read by a dozen specs and an id
// is not a thing to have two of.
function OnTheDesk({ turn, players, upTo, named }) {
	const t = useT();
	const skin = useSkin();

	return (
		<>
			<CellKey id={named ? 'turn-key' : undefined}>{t(TURN_KEY[skin] || TURN_KEY[DEFAULT_SKIN])}</CellKey>
			<CellValue id={named ? 'turn-player' : undefined}>{turn}</CellValue>
			<Initials aria-hidden="true">
				{players.map((player, at) => (
					<InitialBox key={player.name} $on={at < upTo}>
						{player.name.charAt(0)}
					</InitialBox>
				))}
			</Initials>
		</>
	);
}

// Where the announcement starts from, and how big it is while it is there. Measured off the cell it
// will land in rather than chosen, so the flight is a FLIP: the element is laid on the target's box
// and then transformed away from it, which is what makes the landing exact at every viewport and
// every name length. Undoing a transform cannot miss; animating towards a box can.
function flightFrom(box) {
	// Big enough to read across a room, and never wider than the room. Both bounds earn their place:
	// the fraction is what stops a long name blowing the card off the sides of a phone, and the
	// ceiling is what stops the same card being a banner across a desktop monitor. This is the width
	// of the LINE, not of the card — the stock it travels on adds 18px each side and that margin
	// scales with it, so what is on screen is about 70px wider again.
	const room = Math.min(window.innerWidth * 0.62, 470);
	const scale = Math.max(1, Math.min(2.2, room / box.width));

	return {
		left: `${box.left}px`,
		top: `${box.top}px`,
		width: `${box.width}px`,
		height: `${box.height}px`,
		'--ha-fly-x': `${Math.round(window.innerWidth / 2 - (box.left + box.width / 2))}px`,
		'--ha-fly-y': `${Math.round(window.innerHeight / 2 - (box.top + box.height / 2))}px`,
		'--ha-fly-k': String(scale),
	};
}

// The turn, handed over rather than swapped.
//
// It runs on the turn CHANGING, not on the button being pressed, and that is the wider reading of the
// same event on purpose: online, the seat that pressed NEXT TURN is the one seat that already knew.
// Everybody else is told by a 9px key at the top of the screen quietly saying a different name, which
// is how a player comes back to a table that has been waiting for them for a minute. The server
// passing over a seat that has gone is announced by the same rule, for the same reason.
//
// **The first turn is a turn changing hands too, and `held` starts at null so that it counts.** The
// game deals the cards, the board appears, and the first player was simply expected to notice that a
// 9px key already had their name in it — the one arrival at this table that nobody was told about was
// the first. `getTurn` throws rather than returning a seat with no name, so null can never be a real
// turn and this cannot miss.
//
// The consequence to accept: a refresh mid-game announces as well, because a remount is the first
// render again and nothing in this state distinguishes the two. That is the right answer anyway — a
// player who has just come back to the table is exactly the player who needs telling whose turn it
// is, and it is the same news in the same words.
function useTurnDelivery(turn, target, enabled) {
	const [flight, setFlight] = useState(null);
	const held = useRef(null);
	const flights = useRef(0);

	// A layout effect, so the measurement, the hush and the card all land in the frame the new name
	// does. In a plain effect the strip paints the new turn once before the card covers it, which is
	// the one thing this whole feature exists to avoid.
	useLayoutEffect(() => {
		const changed = turn !== held.current;

		held.current = turn;

		// `turn` is asked for a name, and a snapshot that has not landed yet has none. A seat with no
		// name is not a seat the turn has been handed to, so there is nothing to announce.
		if (!enabled || !changed || !turn || prefersReducedMotion() || !target.current) {
			return undefined;
		}

		flights.current += 1;
		setFlight({ at: flights.current, style: flightFrom(target.current.getBoundingClientRect()) });

		// The card is unmounted and the cell handed back its line in one commit, so there is no frame
		// with both and no frame with neither.
		const done = setTimeout(() => setFlight(null), DELIVER_MS);

		return () => clearTimeout(done);
	}, [turn, enabled, target]);

	return flight;
}

// `announce` is off by default because the training course renders this very strip inside its game
// mat, where a turn ending is the lesson's own event and already has a card of its own coming down
// on it. Two arrivals over one small board is one too many.
function TurnStrip({ announce = false }) {
	const [{ players, pieces, hasTurnEnded }, dispatch] = useContext(StateContext);
	const canAct = useCanAct();
	const t = useT();
	const desk = useRef(null);

	const turn = py.getTurn(players);
	const ceosDown = pz.getKilledCeoCount(pieces);

	// Which seats have already held the turn this round. In Dossier they are the initials boxes on the
	// slip; the other two directions have no use for them and the token hides them.
	const upTo = players.findIndex(player => player.turn);

	const flight = useTurnDelivery(turn, desk, announce);

	return (
		<Title>
			<Cell id="turn-cell" ref={desk} $hushed={Boolean(flight)}>
				<OnTheDesk turn={turn} players={players} upTo={upTo} named />
			</Cell>

			<Cell>
				<CellMark>
					<CellKey>{t('play.ceosDown')}</CellKey>
					<CellValue id="ceos-down">
						{ceosDown} / {NUMBER_OF_PLAYERS_KILLED_FOR_GAME_END}
					</CellValue>
				</CellMark>
			</Cell>

			<Cell>
				<Button
					small
					id="next-turn"
					active={hasTurnEnded && canAct}
					$beat={hasTurnEnded && canAct}
					onClick={() => hasTurnEnded && dispatch(nextTurn())}
				>
					{t('play.nextTurn')}
				</Button>
			</Cell>

			{/* Inside the strip, not beside it, and that is not tidiness. It is `position: fixed` so the
			    flex row never sees it, but half of what makes a cell look like a cell is INHERITED from
			    here — the weight, the tracking, the transform, and a smaller face on a narrow screen.
			    Rendered as a sibling of the strip it landed a hair off in three ways at once, which is
			    the one thing a flight measured to the pixel cannot afford.

			    Keyed by the flight rather than by the turn: the same seat can be handed the turn twice
			    running when the table has thinned out, and a key that did not change would leave the
			    card mounted with its animation already spent. Hidden from the reader, because the
			    strip's own cell is still there saying the same thing to anything that is listening. */}
			{flight && (
				<TurnAnnounceStyled key={flight.at} id="turn-announce" style={flight.style} aria-hidden="true">
					<OnTheDesk turn={turn} players={players} upTo={upTo} />
				</TurnAnnounceStyled>
			)}
		</Title>
	);
}

export default TurnStrip;
