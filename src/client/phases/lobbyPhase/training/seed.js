import py from 'Domain/py';
import { pz } from 'Domain/pieces';
import teams from 'Domain/teams';

// Hand-authored boards for the training exercises.
//
// A training board is a real game state — the same eight slices `Game/reducer` builds, run through
// the same reducer — so a lesson cannot teach a move the rules would refuse. What this file does is
// put a handful of the 32 pieces on the table and leave everything else exactly as a new game has
// it. Anything a lesson wants to happen is made to happen by clicking, never by writing it in here.

// The six bearings, named. `[v, h]` reads backwards — `h: 0` is *right* — and a lesson that says
// `facing: FACING.RIGHT` cannot get that the wrong way round. Same table as `utils.js`'s ring, in
// the same order, so `directions.getPrevious`/`getFollowing` still describe neighbours of these.
export const FACING = {
	UP_LEFT: [1, 1],
	UP_RIGHT: [1, 0],
	RIGHT: [0, 0],
	DOWN_RIGHT: [-1, 0],
	DOWN_LEFT: [-1, 1],
	LEFT: [0, 1],
};

// What a piece deployed from an HQ arrives facing, before anybody points it — `moveCeo` and its
// three siblings all write this literal. Named here so a lesson can ask "has it been aimed yet?"
// without repeating the pair.
export const DEFAULT_FACING = FACING.UP_RIGHT;

function place(piece, spot) {
	const facing = spot.facing || DEFAULT_FACING;

	return {
		...piece,
		position: spot.at,
		// A piece already standing on the board has committed its facing. `direction` is what the
		// rules read; `selectedDirection` is what a turn is aiming and what the token is drawn at.
		direction: facing,
		selectedDirection: facing,
	};
}

/**
 * A game state for one exercise.
 *
 * @param {object} spec
 * @param {string[]} spec.players       names, in turn order — entry 0 holds the turn
 * @param {object} spec.alignments      `{ YOU: { friend: '0', foe: '1' } }`, team indices as strings
 * @param {object} spec.board           `{ '0-A1': { at: [3, 1], facing: FACING.RIGHT } }`
 */
export function seedState({ players = ['YOU'], alignments = {}, board = {} } = {}) {
	const placed = pz.init().map(piece => (board[piece.id] ? place(piece, board[piece.id]) : piece));

	// Buffs are worked out once, on NEXT_TURN, so a board written down rather than played into
	// existence has none until this runs — and a lesson about standing next to your own CEO would
	// be teaching the unbuffed rule with a straight face.
	const pieces = placed.map(pz.setCeoBuffs);

	return {
		players: Object.entries(alignments).reduce(
			(list, [name, { friend, foe }]) => py.setAlignment(list, name, friend, foe),
			py.init(players),
		),
		hasTurnEnded: false,
		pieces,
		pieceState: undefined,
		followMouse: false,
		snipe: false,
		// The board as the turn found it. The sniper rollback restores every survivor from this, so
		// it has to carry all 32 ids — and it has to be *this* board, or the first exercise move
		// would look to the game like something the previous turn had already done.
		piecesPrevState: [...pieces],
		// Derived rather than left at the initial `true`, exactly as every writer in `teams.js` does
		// it: a team whose CEO is standing on the board cannot be claimed by anybody, and an HQ card
		// offering a CLAIM the rules refuse is a lesson in the wrong thing.
		teamControl: teams.initControl().map((control, team) => ({
			...control,
			claimEnabled: !!pz.canClaimControl(String(team), pieces),
		})),
	};
}

export default seedState;
