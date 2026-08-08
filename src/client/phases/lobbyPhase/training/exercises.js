import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import { areCoordsEqual } from 'Domain/utils';
import {
	TOGGLE_PIECE,
	MOVE_PIECE,
	DIRECT_PIECE,
	CLAIM_CONTROL,
	NEXT_TURN,
	SNIPE,
	REVEAL_FRIEND,
	ACCUSE,
} from 'Game/actions';
import { FACING } from './seed';

// The course: ten exercises, each a real board with a scripted way through it.
//
// The whole design rule here is that a step is a *click*, and what it teaches is what the game
// itself does in answer to it. So there is one stamped verb per step and nothing else to read —
// which cells light up, which way a piece turns, whose name lands on an HQ card, all of that is the
// game answering. The prose that explains any of it lives in the rule pages, and every exercise
// carries the slug of its own.
//
// Two things a step declares beyond the verb. `allows` is the gate: an off-script click does
// nothing at all, so an exercise cannot be walked into a dead end, and the learner never has to
// undo anything. `done` is read off the state after every dispatch, so a step finishes when the
// board actually says so rather than when a handler thinks it should — a drop is a MOVE_PIECE and
// then a TOGGLE_PIECE, and only the state knows the pair landed.
//
// Every `done` is written to stay true once it is true. The engine advances while the current step
// is done, so a learner who does two things with one click steps past both.

// Turning over one of your own cards is not a game action — nothing about the state changes, you
// are simply looking. It still has to go through the gate like everything else, so it travels as an
// action the reducer never sees.
export const NOTE = 'TRAINING_NOTE';

export function note(flag) {
	return { type: NOTE, payload: { flag } };
}

//////////////
// READERS  //
//////////////

const pieceOf = (state, id) => pz.getPieceById(id, state.pieces);
const isHeld = (state, id) => !!pieceOf(state, id).selected;
const isDown = (state, id) => !pieceOf(state, id).selected;
const stands = (state, id, cell) => !!areCoordsEqual(pieceOf(state, id).position, cell);
const isDead = (state, id) => !!pieceOf(state, id).killed;
const isLit = (state, id) => !!pieceOf(state, id).highlight;
// A shot that has been lined up, or taken and not yet passed on. Either way the board is held still.
const isArmed = state => !!state.snipe;
const isBuffed = (state, id) => !!pieceOf(state, id).buffed;
const turnIs = (state, name) => py.getTurn(state.players) === name;
const holds = (state, team) => !!state.teamControl[team].controlling;
const turnSpent = state => state.hasTurnEnded;
const playerOf = (state, name) => state.players.find(player => player.name === name);
const hasShown = (state, name, which) => !!playerOf(state, name).revealed[which];
const hasGuessed = (state, name) => !!playerOf(state, name).lastAccusation;

////////////
// GATES  //
////////////

const picks =
	(...ids) =>
	action =>
		action.type === TOGGLE_PIECE && ids.includes(action.payload.pieceId);

const lands =
	(...spots) =>
	action =>
		action.type === MOVE_PIECE && spots.some(spot => areCoordsEqual(spot, action.payload.coords));

const claims = team => action => action.type === CLAIM_CONTROL && String(action.payload.team) === String(team);

const presses = type => action => action.type === type;

// One accusation and one only: the exercise is teaching what a correct guess does, and the verdict
// screen says what a wrong one would have cost without anybody having to pay it.
const guesses =
	({ accusee, alignment, team }) =>
	action =>
		action.type === ACCUSE &&
		action.payload.accusee === accusee &&
		action.payload.alignment === alignment &&
		String(action.payload.team) === String(team);

const looks = flag => action => action.type === NOTE && action.payload.flag === flag;

/**
 * Whether a step lets an action through. The one gate, read by the runner and by the specs alike.
 *
 * Aiming is exempt and no step has to say so. It is a hover rather than a click, it only ever
 * touches the piece already in hand, and hovering somewhere else undoes it — so there is nothing it
 * could spoil, and a step that had to remember to allow it would eventually forget.
 */
export function allowsAction(step, action) {
	return action.type === DIRECT_PIECE || !!step.allows(action);
}

//////////////////
// THE COURSE   //
//////////////////

// Two seats, so passing the turn actually passes it to somebody and an exercise can say whose it
// is. The alignment is the same in every exercise: BLACK is the friend, RED is the foe — which is
// why the enemy a lesson kills is nearly always red. SARA is dealt a pair as well, because there is
// no accusing somebody who is holding nothing.
const TABLE = {
	players: ['YOU', 'SARA'],
	alignments: { YOU: { friend: '0', foe: '1' }, SARA: { friend: '2', foe: '3' } },
};

// One seat, for the exercise that passes the turn to reach the *next* one rather than to hand it to
// anybody. A table of one wraps straight back round to itself, which is what that lesson wants.
const SOLO = { players: ['YOU'], alignments: { YOU: { friend: '0', foe: '1' } } };

export const EXERCISES = [
	{
		slug: 'cards',
		title: 'Friend & Foe',
		file: 'secret-cards',
		finding: 'Two cards. Nobody else sees them.',
		// No board at all. This one is the premise rather than a mechanic, and the premise is a pair
		// of cards on a desk — so it is the pair of cards, at the size they are dealt at.
		cards: { friend: '0', foe: '1' },
		steps: [
			{
				verb: 'LOOK',
				marks: [{ control: 'training-card-friend' }],
				allows: looks('friend'),
				done: (_state, notes) => notes.has('friend'),
			},
			{
				verb: 'LOOK',
				marks: [{ control: 'training-card-foe' }],
				allows: looks('foe'),
				done: (_state, notes) => notes.has('foe'),
			},
		],
	},

	{
		slug: 'move',
		title: 'Making a Move',
		file: 'making-a-move',
		finding: 'One piece action, then pass.',
		strip: true,
		seed: {
			...TABLE,
			board: { '0-A1': { at: [3, 1], facing: FACING.RIGHT } },
		},
		steps: [
			{
				verb: 'SELECT',
				marks: [{ piece: '0-A1' }],
				allows: picks('0-A1'),
				done: state => isHeld(state, '0-A1'),
			},
			{
				verb: 'MOVE',
				marks: [{ cell: [3, 3] }],
				allows: lands([3, 3]),
				done: state => stands(state, '0-A1', [3, 3]),
			},
			{
				// Pointing and putting down are one click, on the cell you are pointing at: crossing a
				// cell aims the piece and clicking it lets go. Going back to click the *piece* would
				// cross its own cell on the way, which aims it there — so the facing you had just
				// chosen would be quietly undone by the click meant to keep it.
				//
				// The two cells marked are the two that actually turn it. The one straight ahead is
				// already its facing, and would look like nothing had happened.
				verb: 'POINT',
				hint: 'click the way it should face',
				marks: [{ cell: [2, 3] }, { cell: [4, 3] }],
				allows: picks('0-A1'),
				done: turnSpent,
			},
			{
				verb: 'PASS',
				marks: [{ control: 'next-turn' }],
				allows: presses(NEXT_TURN),
				done: state => turnIs(state, 'SARA'),
			},
		],
	},

	{
		slug: 'agent',
		title: 'The Agent',
		file: 'the-agent',
		finding: 'Two ahead. Landing on them kills.',
		// Both HQs, because the point of the second half is where the dead piece ends up: the
		// cemetery along the foot of the *killer's* card.
		hqs: { left: ['0'], right: ['1'] },
		seed: {
			...TABLE,
			board: {
				'0-A1': { at: [3, 1], facing: FACING.RIGHT },
				'1-A1': { at: [3, 3], facing: FACING.LEFT },
			},
		},
		steps: [
			{
				verb: 'SELECT',
				marks: [{ piece: '0-A1' }],
				allows: picks('0-A1'),
				done: state => isHeld(state, '0-A1'),
			},
			{
				verb: 'STRIKE',
				marks: [{ cell: [3, 3] }],
				allows: lands([3, 3]),
				done: state => isDead(state, '1-A1'),
			},
			{
				verb: 'PUT DOWN',
				marks: [{ piece: '0-A1' }],
				allows: picks('0-A1'),
				done: turnSpent,
			},
		],
	},

	{
		slug: 'ceo',
		title: 'The CEO',
		file: 'the-ceo',
		finding: 'Any distance. Never kills.',
		seed: {
			...TABLE,
			board: {
				'0-C': { at: [3, 1], facing: FACING.RIGHT },
				'1-A1': { at: [3, 4], facing: FACING.LEFT },
			},
		},
		steps: [
			{
				verb: 'SELECT',
				marks: [{ piece: '0-C' }],
				allows: picks('0-C'),
				done: state => isHeld(state, '0-C'),
			},
			{
				// The crossed cell is the lesson. Every ray runs to the edge of the board except this
				// one, which stops one short of the red agent — a CEO cannot land on anybody, so it
				// cannot kill anybody either.
				verb: 'MOVE',
				marks: [{ cell: [3, 3] }, { cell: [3, 4], deny: true }],
				allows: lands([3, 3]),
				done: state => stands(state, '0-C', [3, 3]),
			},
			{
				verb: 'PUT DOWN',
				marks: [{ piece: '0-C' }],
				allows: picks('0-C'),
				done: turnSpent,
			},
		],
	},

	{
		slug: 'spy',
		title: 'The Spy',
		file: 'the-spy',
		finding: 'Two steps. Kills from behind only.',
		seed: {
			...TABLE,
			board: {
				'0-S': { at: [3, 1], facing: FACING.RIGHT },
				// Facing away, which is the only angle a spy can take anybody from.
				'1-A1': { at: [3, 3], facing: FACING.RIGHT },
				// And a second one exactly as close, looking straight back at the spy. Both are two
				// steps away and only one of them lights up, which says the rule without a word of it:
				// what decides a spy's kill is which way the target is facing, not how near it is.
				'1-A2': { at: [2, 2], facing: FACING.DOWN_LEFT },
			},
		},
		steps: [
			{
				verb: 'SELECT',
				hint: 'red is now, teal is next',
				marks: [{ piece: '0-S' }],
				allows: picks('0-S'),
				done: state => isHeld(state, '0-S'),
			},
			{
				verb: 'STEP',
				marks: [{ cell: [3, 2] }],
				allows: lands([3, 2]),
				done: state => stands(state, '0-S', [3, 2]),
			},
			{
				// A spy has no turning step: the last one both points it and puts it down, so this
				// click ends the turn on its own.
				verb: 'STRIKE',
				hint: 'the one with its back turned',
				marks: [{ cell: [3, 3] }, { cell: [2, 2], deny: true }],
				allows: lands([3, 3]),
				done: state => isDead(state, '1-A1'),
			},
		],
	},

	{
		slug: 'sniper',
		title: 'The Sniper',
		file: 'snipers-in-action',
		finding: 'Snipe belongs to everyone else.',
		note: 'And a line of fire stops at the first piece standing in it.',
		hqs: { left: ['0'], right: ['1'] },
		snipe: true,
		strip: true,
		// The line of fire is drawn for this exercise only. The real board never draws it — you read
		// it off the cells another piece is refused — and learning that it is there at all is the
		// whole of this lesson.
		sight: true,
		seed: {
			...TABLE,
			board: {
				'1-N': { at: [3, 0], facing: FACING.RIGHT },
				'0-A1': { at: [2, 2], facing: FACING.DOWN_RIGHT },
				// Kept out of the way for the first half, and the second half is its own: it walks onto
				// the line rather than across it, and the line is drawn stopping at it.
				'0-A2': { at: [1, 1], facing: FACING.DOWN_RIGHT },
			},
		},
		steps: [
			{
				verb: 'SELECT',
				marks: [{ piece: '0-A1' }],
				allows: picks('0-A1'),
				done: state => isHeld(state, '0-A1'),
			},
			{
				// It lands clear of the line and is marked anyway: the whole path is checked, not
				// just where it stops.
				verb: 'MOVE',
				marks: [{ cell: [4, 3] }],
				allows: lands([4, 3]),
				done: state => stands(state, '0-A1', [4, 3]),
			},
			{
				verb: 'PUT DOWN',
				marks: [{ piece: '0-A1' }],
				allows: picks('0-A1'),
				done: state => isDown(state, '0-A1') && stands(state, '0-A1', [4, 3]),
			},
			{
				verb: 'SNIPE',
				hint: 'a different player can click this',
				marks: [{ control: 'snipe' }],
				allows: presses(SNIPE),
				done: state => isLit(state, '1-N') || isDead(state, '0-A1'),
			},
			{
				verb: 'FIRE',
				marks: [{ piece: '1-N' }],
				allows: picks('1-N'),
				done: state => isDead(state, '0-A1'),
			},

			// ── And the other half of a line of fire: how far it reaches ──────────────────────
			//
			// A shot taken is a turn spent, and a spent turn holds the board still — nothing can be
			// picked up until it is passed on. So the second half opens the only way it can.
			{
				verb: 'PASS',
				marks: [{ control: 'next-turn' }],
				allows: presses(NEXT_TURN),
				done: state => !isArmed(state),
			},
			{
				verb: 'SELECT',
				marks: [{ piece: '0-A2' }],
				allows: picks('0-A2'),
				done: state => isHeld(state, '0-A2'),
			},
			{
				// Onto the line rather than across it. The board is drawing six cells; the moment this
				// one lands on the third of them there are three, and the rest of the row is out of the
				// sniper's reach for as long as somebody is standing there.
				verb: 'MOVE',
				hint: 'stand on the line this time',
				marks: [{ cell: [3, 3] }],
				allows: lands([3, 3]),
				done: state => stands(state, '0-A2', [3, 3]),
			},
			{
				verb: 'PUT DOWN',
				hint: 'everything behind it is safe now',
				marks: [{ piece: '0-A2' }],
				allows: picks('0-A2'),
				done: turnSpent,
			},
		],
	},

	{
		slug: 'buff',
		title: 'CEO Buffs',
		file: 'ceo-buffs',
		finding: 'Beside its own CEO, a piece gets more.',
		note: 'Worked out once, at the start of every turn — never mid-turn.',
		strip: true,
		// One seat, so passing the turn hands it straight back. What this exercise needs the turn
		// change for is the moment buffs are recomputed, and a second name on the slip in between
		// would be a fact about turn order rather than about the CEO.
		seed: {
			...SOLO,
			board: {
				'0-C': { at: [4, 2], facing: FACING.RIGHT },
				// Both already beside it, so the first two acts need no setting up: the board is
				// showing the buffed reading from the moment each piece is picked up.
				'0-S': { at: [4, 1], facing: FACING.RIGHT },
				'0-N': { at: [5, 2], facing: FACING.LEFT },
				// What the sniper's new line runs straight through.
				'1-A2': { at: [3, 4], facing: FACING.LEFT },
				// Out of the CEO's reach, and nose to nose with an enemy — an unbuffed agent moves
				// exactly two ahead, so a piece one cell in front of it is not a target, it is a wall.
				'0-A1': { at: [2, 2], facing: FACING.RIGHT },
				'1-A1': { at: [2, 3], facing: FACING.LEFT },
			},
		},
		steps: [
			{
				verb: 'SELECT',
				hint: 'the spy: three rings, not two',
				marks: [{ piece: '0-S' }],
				allows: picks('0-S'),
				done: state => isHeld(state, '0-S'),
			},
			{
				verb: 'PUT DOWN',
				marks: [{ piece: '0-S' }],
				allows: picks('0-S'),
				done: state => isDown(state, '0-S'),
			},
			{
				verb: 'SELECT',
				hint: 'the sniper, and where it is looking',
				marks: [{ piece: '0-N' }],
				allows: picks('0-N'),
				done: state => isHeld(state, '0-N'),
				sight: true,
			},
			{
				// Turning it is its whole move, and one click on the cell does both halves of it. The
				// line that comes with it is the lesson: it runs through the red agent instead of
				// stopping at it.
				verb: 'POINT',
				hint: 'click up and to the right',
				marks: [{ cell: [4, 3] }],
				allows: picks('0-N'),
				done: turnSpent,
				sight: true,
			},
			{
				verb: 'PASS',
				marks: [{ control: 'next-turn' }],
				allows: presses(NEXT_TURN),
				done: state => !turnSpent(state),
				sight: true,
			},
			{
				verb: 'SELECT',
				hint: 'the agent: nowhere to go',
				marks: [{ piece: '0-A1' }],
				allows: picks('0-A1'),
				done: state => isHeld(state, '0-A1'),
			},
			{
				verb: 'PUT DOWN',
				marks: [{ piece: '0-A1' }],
				allows: picks('0-A1'),
				done: state => isDown(state, '0-A1'),
			},
			{
				verb: 'SELECT',
				hint: 'the CEO instead',
				marks: [{ piece: '0-C' }],
				allows: picks('0-C'),
				done: state => isHeld(state, '0-C'),
			},
			{
				verb: 'MOVE',
				hint: 'next to the stuck agent',
				marks: [{ cell: [3, 2] }],
				allows: lands([3, 2]),
				done: state => stands(state, '0-C', [3, 2]),
			},
			{
				verb: 'PUT DOWN',
				marks: [{ piece: '0-C' }],
				allows: picks('0-C'),
				done: turnSpent,
			},
			{
				// Nothing about the agent has changed yet. Buffs are worked out at the start of a turn,
				// so standing a CEO beside it mid-turn does nothing until this button is pressed.
				verb: 'PASS',
				marks: [{ control: 'next-turn' }],
				allows: presses(NEXT_TURN),
				done: state => isBuffed(state, '0-A1'),
			},
			{
				verb: 'SELECT',
				hint: 'the wall is a target now',
				marks: [{ piece: '0-A1' }],
				allows: picks('0-A1'),
				done: state => isHeld(state, '0-A1'),
			},
			{
				verb: 'STRIKE',
				marks: [{ cell: [2, 3] }],
				allows: lands([2, 3]),
				done: state => isDead(state, '1-A1'),
			},
		],
	},

	{
		slug: 'control',
		title: 'Taking Control',
		file: 'taking-control',
		finding: 'Claim it, then land its CEO.',
		// The rule is about the HQ and not about the board: nobody else may bring RED's pieces *out*,
		// while anything of theirs already on the table is moved by whoever is on turn, like every
		// other piece in this game.
		note: 'Nobody else can bring that team out of its HQ now.',
		// The line that has just changed is at the foot of a card two hundred pixels from where the
		// last click landed, so the finding rings it rather than trusting anybody to look.
		spotlight: [{ control: 'hq-control-1' }],
		hqs: { left: ['0', '1'], right: ['2', '3'] },
		seed: TABLE,
		steps: [
			{
				verb: 'CLAIM',
				marks: [{ control: 'claim-1' }],
				allows: claims('1'),
				done: state => isHeld(state, '1-C') || holds(state, 1),
			},
			{
				verb: 'DEPLOY',
				hint: 'anywhere at all',
				marks: [{ cell: [3, 3] }],
				allows: lands([3, 3]),
				done: state => holds(state, 1),
			},
			{
				verb: 'PUT DOWN',
				// It arrives facing nowhere, so it goes through the same point-then-drop every fresh
				// piece does — and the drop is what spends the turn.
				marks: [{ piece: '1-C' }],
				allows: picks('1-C'),
				done: turnSpent,
			},
		],
	},

	{
		slug: 'reveal',
		title: 'Revealing',
		file: 'revealing',
		// Not "fifty points", which says nothing about which way they go.
		finding: 'Fifty points off your final score.',
		note: 'And the team named on the card is yours at once, with no CEO to deploy.',
		// The screen is the game's own, and so is the button that opens it. What the board is for here
		// is the answer: BLACK's HQ says CONTROL: YOU the moment the card is up.
		screen: 'reveal',
		spotlight: [{ control: 'hq-control-0' }],
		hqs: { left: ['0'], right: ['1'] },
		seed: TABLE,
		steps: [
			{
				verb: 'REVEAL',
				marks: [{ control: 'reveal' }],
				allows: looks('open'),
				done: (_state, notes) => notes.has('open'),
			},
			{
				verb: 'SHOW IT',
				hint: 'the friend card',
				marks: [{ control: 'reveal-friend' }],
				allows: presses(REVEAL_FRIEND),
				done: state => hasShown(state, 'YOU', 'friend'),
			},
			{
				verb: 'CLOSE',
				marks: [{ control: 'reveal-close' }],
				allows: looks('shut'),
				done: (_state, notes) => notes.has('shut'),
			},
		],
	},

	{
		slug: 'accuse',
		title: 'Accusing',
		file: 'accusing',
		finding: 'Guess right and they pay, not you.',
		screen: 'accuse',
		seed: TABLE,
		steps: [
			{
				verb: 'ACCUSE',
				marks: [{ control: 'accuse' }],
				allows: looks('open'),
				done: (_state, notes) => notes.has('open'),
			},
			{
				// Three marks, one step, and only ever one of them on the screen: the accuse screen
				// asks its three questions one at a time and takes the previous one away. So the ring
				// lands on whichever answer is being asked for, and the screen's own title is the
				// question — which is the one place in this course where the words are already there.
				verb: 'GUESS',
				marks: [{ control: 'accuse-player-1' }, { control: 'accuse-foe' }, { control: 'accuse-team-3' }],
				allows: guesses({ accusee: 'SARA', alignment: 'foe', team: '3' }),
				done: state => hasGuessed(state, 'YOU'),
			},
			{
				verb: 'CLOSE',
				marks: [{ control: 'accuse-close' }],
				allows: looks('shut'),
				done: (_state, notes) => notes.has('shut'),
			},
		],
	},
];

export function findExercise(slug) {
	return EXERCISES.find(exercise => exercise.slug === slug) || null;
}

export default EXERCISES;
