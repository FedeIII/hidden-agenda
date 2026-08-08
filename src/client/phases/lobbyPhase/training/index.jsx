import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { SessionContext, StateContext } from 'State';
import { DragProvider } from 'Client/drag';
import { gameReducer } from 'Game/reducer';
import { PHASES } from 'Domain/phases';
import { pz } from 'Domain/pieces';
import { TEAM_NAMES } from 'Domain/teams';
import { invalidateStage } from 'Client/three/stage';
import useSkin from 'Hooks/useSkin';
import useSnipe from 'Hooks/useSnipe';
import { useCanAccuse, useCanReveal } from 'Hooks/useSession';
import { Button, Buttons } from 'Client/components/button';
import HQs from 'Client/components/hqs';
import { AlignmentFriend, AlignmentFoe } from 'Client/components/alignments';
import HQ from 'Phases/playPhase/hq';
import TableBoard from 'Phases/playPhase/tableBoard';
import TurnStrip from 'Phases/playPhase/turnStrip';
import AccuseScreen from 'Phases/playPhase/accuseScreen';
import RevealScreen from 'Phases/playPhase/revealScreen';
import { ActionButton } from 'Phases/playPhase/components';
import { EXERCISES, allowsAction, findExercise, note, NOTE } from './exercises';
import { seedState } from './seed';
import CoachMarks from './marks';
import {
	TrainingPanel,
	HeadRow,
	TrainingHead,
	Strip,
	Record,
	RecordLabel,
	RecordBox,
	Slip,
	SlipKey,
	Verb,
	Hint,
	TrainingBoard,
	CardTable,
	CardBack,
	CardSeal,
	CardWord,
	Finding,
	FindingStamp,
	FindingLine,
	FindingSmall,
	FindingNote,
	Placard,
	PlacardSheet,
	TRAVEL_MS,
	ExerciseActions,
	DoneList,
} from './components';

// Field training: the rule book with the reading taken out.
//
// This is a real game — the real reducer, the real board, the real hexagons and tokens and HQ cards,
// under a `StateContext` of its own — with a hand-authored board per exercise and a gate on the
// dispatch. So the answer to every click is the game's own answer, and a lesson cannot teach a move
// the rules would refuse. What the tutorial adds is only the ring round what to click next, one
// stamped verb, and one line at the end of each exercise saying what just happened.
//
// Three things hold it up:
//
// - **Its own contexts.** Everything below here reads `StateContext` and `SessionContext`, and the
//   ones the lobby is running are a socket to a server. Nesting a pair means a click moves the piece
//   in front of the learner rather than sending an intent to a room that does not exist. The session
//   is `mode: 'local'`, which is what makes `useCanAct` and `useCanSnipe` both true: one screen, one
//   mouse, exactly like a hot-seat table.
// - **Its own `DragProvider`.** The app's is mounted above the lobby and calls `useCellAction`
//   against the outer store, so a piece dropped on a cell would dispatch into the lobby's transport
//   and the training board would simply not move — with nothing thrown to say so.
// - **A gate rather than a script.** A step names the clicks it accepts and a predicate over the
//   board that says it is finished. Everything else does nothing at all, so there is no wrong path
//   to be rescued from, and the exercise cannot be walked into a state it cannot leave.

// One seat, whose name is on the routing slip and on the HQ card of anything claimed.
const LEARNER = 'YOU';

function domIdFor(mark) {
	if (mark.piece) {
		return `pz-${mark.piece}`;
	}

	if (mark.cell) {
		return `hex-${mark.cell[0]}-${mark.cell[1]}`;
	}

	return mark.control;
}

// Where every sniper on the board is looking, as the marks that draw it. Read off `pz` rather than
// worked out here: the line a lesson points at has to be the line the kill is worked out from.
function sightMarks(pieces) {
	return pieces
		.filter(piece => pz.isSniper(piece.id) && piece.position && piece.direction)
		.flatMap(sniper => pz.getSnipedPositionsBy(sniper, pieces))
		.map(([row, cell]) => ({ id: `hex-${row}-${cell}`, kind: 'sight' }));
}

// The SNIPE control, on its own. The real bar carries three groups and a leave button, none of which
// an exercise has anything to say about — but the button itself is the real one, down to the hook
// that decides whether it may be pressed and whether it now says STAND DOWN.
function SnipeAction() {
	const [canSnipe, onSnipe, armed] = useSnipe();

	return (
		<ExerciseActions>
			<Button id="snipe" small $primary active={canSnipe} onClick={onSnipe}>
				{armed ? 'STAND DOWN' : 'SNIPE!'}
			</Button>
		</ExerciseActions>
	);
}

// The two free moves, and the screens behind them. Both are the game's own components, opened by the
// game's own buttons, and both are full screens that cover the table — so the slip goes with it and
// the screen's own title is the instruction, with the ring on the answer. Opening and closing are
// facts about this screen rather than about the board, so they travel as notes.
const SCREENS = { reveal: RevealScreen, accuse: AccuseScreen };

function ScreenAction({ which, notes, onLook }) {
	const canReveal = useCanReveal();
	const canAccuse = useCanAccuse();
	const Screen = SCREENS[which];
	const open = notes.has('open') && !notes.has('shut');

	return (
		<>
			<ExerciseActions>
				{which === 'reveal' ? (
					<ActionButton id="reveal" active={canReveal} onClick={() => onLook('open')}>
						REVEAL
					</ActionButton>
				) : (
					<ActionButton id="accuse" active={canAccuse} onClick={() => onLook('open')}>
						ACCUSE
					</ActionButton>
				)}
			</ExerciseActions>

			{open && <Screen onClose={() => onLook('shut')} />}
		</>
	);
}

// The first exercise has no board. Two cards face down on the desk, turned over by hand — which is
// the whole of what a player owns, and the only thing in this game nobody else may see.
function CardStage({ cards, notes, onLook }) {
	const seen = { friend: notes.has('friend'), foe: notes.has('foe') };

	return (
		<CardTable>
			{seen.friend ? (
				<AlignmentFriend id="training-card-friend" disabled player={LEARNER} team={cards.friend}>
					{TEAM_NAMES[cards.friend]}
				</AlignmentFriend>
			) : (
				<CardBack id="training-card-friend" type="button" onClick={() => onLook('friend')}>
					<CardSeal>Classified</CardSeal>
					<CardWord>Card 1 of 2</CardWord>
				</CardBack>
			)}

			{seen.foe ? (
				<AlignmentFoe id="training-card-foe" disabled player={LEARNER} team={cards.foe}>
					{TEAM_NAMES[cards.foe]}
				</AlignmentFoe>
			) : (
				<CardBack id="training-card-foe" type="button" onClick={() => onLook('foe')}>
					<CardSeal>Classified</CardSeal>
					<CardWord>Card 2 of 2</CardWord>
				</CardBack>
			)}
		</CardTable>
	);
}

function BoardStage({ exercise }) {
	const hqs = exercise.hqs;
	// Two cards or fewer go under the board together on a phone rather than one above it and one
	// below — see TrainingBoard. Counted here because the count is a fact about the exercise, and
	// CSS cannot ask how many children another element has.
	const compact = Boolean(hqs) && hqs.left.length + hqs.right.length <= 2;

	return (
		<TrainingBoard $solo={!hqs} $compact={compact}>
			{hqs && (
				<HQs>
					{hqs.left.map(team => (
						<HQ key={team} team={team} />
					))}
				</HQs>
			)}

			<TableBoard />

			{hqs && (
				<HQs>
					{hqs.right.map(team => (
						<HQ key={team} team={team} />
					))}
				</HQs>
			)}
		</TrainingBoard>
	);
}

// How far along the exercise the board now is. Walked forward from where it was rather than counted
// from the start, because a step's `done` describes the board at that moment and not for ever after:
// "the agent is in your hand" stops being true the moment you put it down. Forward `while` rather
// than `if` because one click is often two steps — the click that lands a spy's second step also
// ends the turn — and a learner who does two things at once should step past both.
/**
 * The one box the slip and the finding share, travelling between their two heights.
 *
 * It measures whatever is in it rather than being told, because the two things it holds are a line of
 * chrome and a card and neither knows about the other — and because a hint that wraps, or a window
 * that narrows, changes the answer without either of them being swapped.
 *
 * The measured height goes through the `style` prop and never through a styled-components template:
 * every distinct interpolated value mints a class that is never reclaimed, which is the same rule the
 * projected hexagons follow. `null` until the first measurement, so the box opens at the height it
 * would have had anyway and nothing travels on mount.
 *
 * `onSettled` fires when the box has finished moving. What needs it is the spotlight: the thing a
 * finished exercise points at is often at the foot of an HQ card, and scrolling to it while the card
 * above is still opening leaves it as far below the fold as it started.
 */
function StepPlacard({ children, onSettled }) {
	const sheet = useRef(null);
	const measured = useRef(null);
	const [height, setHeight] = useState(null);
	const [travelling, setTravelling] = useState(false);

	useLayoutEffect(() => {
		const observer = new ResizeObserver(([entry]) => {
			const next = entry.contentRect.height;

			// The first measurement is the height the box already had, so nothing travels on mount.
			// The ref rather than the state, because a state read here would be the one from the
			// render this observer was created in.
			if (measured.current !== null && measured.current !== next) {
				setTravelling(true);
			}

			measured.current = next;
			setHeight(next);
		});

		observer.observe(sheet.current);

		return () => observer.disconnect();
	}, []);

	// The board sits directly under this box and travels with it, and the board is painted by WebGL —
	// which, with nothing in the scene moving, only looks for a shifted element ten times a second. So
	// every frame of the travel is asked for, or the tiles come down the screen in five steps while the
	// card slides. A timeout rather than `transitionend`: this has to end even when there is no
	// transition to end, which is every player who has asked for less movement.
	useEffect(() => {
		if (!travelling) {
			return;
		}

		let frame = requestAnimationFrame(function pump() {
			invalidateStage();
			frame = requestAnimationFrame(pump);
		});

		const settled = setTimeout(() => setTravelling(false), TRAVEL_MS + 80);

		return () => {
			cancelAnimationFrame(frame);
			clearTimeout(settled);
		};
	}, [travelling]);

	// transitionend bubbles, so a control inside the card finishing its own hover would otherwise
	// report the box as settled.
	const onEnd = useCallback(
		event => {
			if (event.target === event.currentTarget && event.propertyName === 'height') {
				onSettled();
			}
		},
		[onSettled],
	);

	return (
		<Placard
			id="training-placard"
			style={height === null ? undefined : { height: `${height}px` }}
			onTransitionEnd={onEnd}
		>
			<PlacardSheet ref={sheet}>{children}</PlacardSheet>
		</Placard>
	);
}

function advance(exercise, from, game, notes) {
	let next = from;

	while (next < exercise.steps.length && exercise.steps[next].done(game, notes)) {
		next += 1;
	}

	return next;
}

/**
 * The exercise, as one reducer.
 *
 * The gate, the board and how far along it is all move together, in one place, on one dispatch —
 * which is what a step needs: whether an action is allowed depends on which step is current, and
 * which step is current depends on what the last action did to the board. Split across a state and
 * an effect, the two would be a frame apart, and a click that arrived in that frame would be judged
 * against the step before it.
 */
function createRunner(exercise) {
	return function runner(current, action) {
		const step = exercise.steps[current.step];

		// Nothing at all happens off script. There is no wrong path to be rescued from, so an
		// exercise cannot be walked into a state it has no way out of.
		if (!step || !allowsAction(step, action)) {
			return current;
		}

		// Looking at one of your own cards changes nothing about the board — you are simply looking —
		// so it never reaches the game reducer.
		if (action.type === NOTE) {
			const notes = new Set(current.notes).add(action.payload.flag);

			return { ...current, notes, step: advance(exercise, current.step, current.game, notes) };
		}

		const game = gameReducer(current.game, action);

		return { ...current, game, step: advance(exercise, current.step, game, current.notes) };
	};
}

// An exercise with no `seed` is one with no board — the pair of cards — and a default state is what
// the tree below still wants to read a player and a turn out of.
function openExerciseAt(exercise) {
	const game = seedState(exercise.seed);
	const notes = new Set();

	return { game, notes, step: advance(exercise, 0, game, notes) };
}

/**
 * One exercise, from its first click to its finding.
 *
 * Mounted with a key of its own, so changing exercise — or starting this one again — rebuilds the
 * board rather than trying to walk it backwards. A reducer's initialiser only runs on mount, which
 * is exactly the lifetime an exercise wants.
 */
function ExerciseRunner({ exercise, onNext, onOpenFile, isLast }) {
	const documentSkin = useSkin();
	const runner = useMemo(() => createRunner(exercise), [exercise]);
	const [{ game: state, notes, step: stepIndex }, dispatch] = useReducer(runner, exercise, openExerciseAt);

	const stateValue = useMemo(() => [state, dispatch], [state, dispatch]);
	const session = useMemo(
		() => ({
			// Local is what makes the turn holder whoever is holding the mouse, and hands the snipe to
			// them as well — one screen, one player, nobody to take turns with.
			mode: 'local',
			skin: documentSkin,
			phase: PHASES.PLAY,
			status: 'ready',
			name: LEARNER,
			synced: true,
			seatId: null,
			hostSeatId: null,
			// An object rather than nothing: hooks that reach for an action destructure this before
			// they check whether they are allowed to use it.
			actions: {},
		}),
		[documentSkin],
	);

	const step = exercise.steps[stepIndex];
	const finished = !step;

	// Where a sniper is looking, drawn either for a whole exercise or for the few steps of one that
	// are about it — the other steps of the buff lesson have three rings of their own on the board
	// already, and a second thing hatched across it is noise rather than a lesson.
	const showSight = exercise.sight || (step && step.sight);

	const marks = useMemo(() => {
		// The exercise is over, so there is nothing left to click — but there is often something to
		// look at, and it is rarely where the last click landed.
		const asked = finished
			? (exercise.spotlight || []).map(mark => ({ id: domIdFor(mark), kind: 'target' }))
			: step.marks.map(mark => ({ id: domIdFor(mark), kind: mark.deny ? 'deny' : 'target' }));

		return showSight ? [...sightMarks(state.pieces), ...asked] : asked;
	}, [finished, step, exercise.spotlight, showSight, state.pieces]);

	// The thing a finished exercise is pointing at is often at the foot of an HQ card, and the finding
	// card that just replaced the slip has pushed the whole board down to make room for itself — so on
	// a short screen the one line worth reading can end up below the fold. Instant rather than smooth:
	// a box still travelling is a box Playwright refuses to look at.
	//
	// Run twice, and both times matter. Now, which is the only time it happens at all for a player who
	// has asked for no motion; and again when the placard has finished opening, because the target is
	// below it and has moved the whole way down with it.
	const revealSpotlight = useCallback(() => {
		if (!finished || !exercise.spotlight) {
			return;
		}

		const target = document.getElementById(domIdFor(exercise.spotlight[0]));

		if (target) {
			target.scrollIntoView({ block: 'center' });
		}
	}, [finished, exercise.spotlight]);

	useEffect(revealSpotlight, [revealSpotlight]);

	// One caption on the board, and only where the board is being asked to show something it never
	// shows in a real game.
	const tag = useMemo(() => {
		if (!showSight) {
			return null;
		}

		const line = sightMarks(state.pieces);

		return line.length ? { id: line[Math.floor(line.length / 2)].id, text: 'line of fire' } : null;
	}, [showSight, state.pieces]);

	return (
		<SessionContext.Provider value={session}>
			<StateContext.Provider value={stateValue}>
				<DragProvider>
					<StepPlacard onSettled={revealSpotlight}>
						{finished ? (
							<Finding id="training-finding">
								<FindingStamp>Passed</FindingStamp>
								<FindingLine id="training-finding-line">{exercise.finding}</FindingLine>
								{/* The second line is for the half of a rule the board cannot show. That a reveal
								    costs fifty points is visible on the screen; that they come *off* is not. */}
								{exercise.note && <FindingSmall id="training-finding-note">{exercise.note}</FindingSmall>}
								<Buttons>
									<Button id="training-file" small active onClick={() => onOpenFile(exercise.file)}>
										Read the file
									</Button>
									<Button id="training-next" active onClick={onNext}>
										{isLast ? 'Finish ›' : 'Next ›'}
									</Button>
								</Buttons>
							</Finding>
						) : (
							<Slip id="training-slip">
								<SlipKey id="training-step">
									Step {stepIndex + 1} / {exercise.steps.length}
								</SlipKey>
								<Verb id="training-verb">{step.verb}</Verb>
								{step.hint && <Hint id="training-hint">{step.hint}</Hint>}
							</Slip>
						)}
					</StepPlacard>

					{exercise.strip && (
						<Strip>
							<TurnStrip />
						</Strip>
					)}

					{exercise.cards ? (
						<CardStage cards={exercise.cards} notes={notes} onLook={flag => dispatch(note(flag))} />
					) : (
						<BoardStage exercise={exercise} />
					)}

					{exercise.snipe && <SnipeAction />}

					{exercise.screen && (
						<ScreenAction which={exercise.screen} notes={notes} onLook={flag => dispatch(note(flag))} />
					)}

					<CoachMarks marks={marks} tag={tag} />
				</DragProvider>
			</StateContext.Provider>
		</SessionContext.Provider>
	);
}

// Passed the whole course. What it never put on a board is named here with the pages that do — a
// tutorial that pretends it covered everything is worse than one that says what is left. Scoring is
// the honest gap: it is arithmetic done once, at the end, and there is nothing to click at it.
const UNCOVERED = [
	{ slug: 'how-it-ends', title: 'How It Ends' },
	{ slug: 'playing-online', title: 'Playing Online' },
];

function CourseComplete({ onOpenFile, onIndex, onPlay }) {
	return (
		<Finding id="training-complete">
			<FindingStamp>Cleared</FindingStamp>
			<FindingLine>That is the whole board game.</FindingLine>
			<FindingNote>Two pages left to read</FindingNote>
			<DoneList>
				{UNCOVERED.map(page => (
					<Button key={page.slug} id={`training-read-${page.slug}`} small active onClick={() => onOpenFile(page.slug)}>
						{page.title}
					</Button>
				))}
			</DoneList>
			<Buttons>
				<Button id="training-play" active onClick={onPlay}>
					Play now
				</Button>
				<Button id="training-back-to-index" small active onClick={onIndex}>
					Back to the index
				</Button>
			</Buttons>
		</Finding>
	);
}

/**
 * The course.
 *
 * `slug` comes off the hash the way a rule page's does, so the browser's own back button steps
 * through the exercises and a particular one can be linked to. `attempt` is bumped by START OVER,
 * and it is in the runner's key rather than in its state: rebuilding the component is the reset.
 */
export default function TrainingCourse({ slug, onOpen, onBack, onIndex, onOpenFile, onPlay }) {
	const exercise = findExercise(slug) || EXERCISES[0];
	const index = EXERCISES.indexOf(exercise);
	const isLast = index === EXERCISES.length - 1;
	const [attempt, setAttempt] = useState(0);
	const [passed, setPassed] = useState(() => new Set());
	const [complete, setComplete] = useState(false);

	const onNext = useCallback(() => {
		setPassed(done => new Set(done).add(exercise.slug));

		if (isLast) {
			setComplete(true);

			return;
		}

		onOpen(EXERCISES[index + 1].slug);
	}, [exercise.slug, index, isLast, onOpen]);

	// Leaving an exercise is leaving the course as far as "finished" goes: the closing card belongs
	// to the last one, not to whichever one you wandered back to.
	const openExercise = useCallback(
		next => {
			setComplete(false);
			onOpen(next);
		},
		[onOpen],
	);

	return (
		<TrainingPanel>
			{/* START OVER sits with the two ways out rather than under the board. It is chrome, and a
			    row of its own beneath the table is a band of the screen the board could have had. */}
			<Buttons>
				<Button id="rules-main-menu" small active onClick={onBack}>
					Main Menu
				</Button>
				<Button id="rules-index" small active onClick={onIndex}>
					Index
				</Button>
				{!complete && (
					<Button id="training-restart" small active onClick={() => setAttempt(count => count + 1)}>
						Start over
					</Button>
				)}
			</Buttons>

			<HeadRow>
				<TrainingHead id="training-title">
					{complete ? 'Field Training' : `${index + 1}. ${exercise.title}`}
				</TrainingHead>

				<Record id="training-record">
					<RecordLabel>Record</RecordLabel>
					{EXERCISES.map((entry, at) => (
						<RecordBox
							key={entry.slug}
							id={`training-go-${entry.slug}`}
							type="button"
							title={entry.title}
							aria-label={entry.title}
							$done={passed.has(entry.slug)}
							$current={!complete && entry.slug === exercise.slug}
							onClick={() => openExercise(entry.slug)}
						>
							{at + 1}
						</RecordBox>
					))}
				</Record>
			</HeadRow>

			{complete ? (
				<CourseComplete onOpenFile={onOpenFile} onIndex={onIndex} onPlay={onPlay} />
			) : (
				<ExerciseRunner
					key={`${exercise.slug}-${attempt}`}
					exercise={exercise}
					isLast={isLast}
					onNext={onNext}
					onOpenFile={onOpenFile}
				/>
			)}
		</TrainingPanel>
	);
}
