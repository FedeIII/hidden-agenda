import { pz, TYPES, MOVES } from 'Domain/pieces';
import useT from 'Client/i18n';
import { HexMark, HexTag } from './components';

// What the mark says, per MOVES. Four sentences rather than one with a verb slotted in: Spanish
// agrees the participle with the piece, and a catalog that hands a translator whole sentences is
// the rule the rule book follows for the same reason.
const EVENT_KEY = {
	[MOVES.PLACED]: 'play.lastMovePlaced',
	[MOVES.MOVED]: 'play.lastMoveMoved',
	[MOVES.KILLED]: 'play.lastMoveKilled',
	[MOVES.CLAIMED]: 'play.lastMoveClaimed',
};

// A piece is named by its type, and the type is a letter on the wire. Claiming a team names no
// piece at all — the CEO is the mechanism, the team is the news.
const PIECE_KEY = {
	[TYPES.AGENT]: 'play.pieceAgent',
	[TYPES.CEO]: 'play.pieceCeo',
	[TYPES.SPY]: 'play.pieceSpy',
	[TYPES.SNIPER]: 'play.pieceSniper',
};

/**
 * The cell the last player's move ended on, and what happened there.
 *
 * Everybody moves everybody's pieces here, so a player arriving at their turn is looking at a board
 * that has changed without being told which of 32 tokens changed it, or how. The mark says that much
 * and no more: no ring and no arrow to a second cell, because it is a caption rather than a control
 * and the cell underneath is an ordinary one.
 *
 * A kill names **what was taken**, not what took it — the killer is standing on the marked cell for
 * anybody to read, and the piece that is no longer anywhere is the news. `pz.getTurnMove` is where
 * that is decided; this only reads `victim` when there is one.
 *
 * Drawn from two places, because the board is drawn two ways and neither can do the other's job —
 * see FallenSniper, which has the same pair of paths for the same reason.
 *
 * @param {object} props
 * @param {object} props.move   the `lastMove` slice: `{ id, position, event, victim? }`
 * @param {object} [props.box]  projected `{left, top, width, height}`, absent on the flat board
 */
function LastMove({ move, box }) {
	const t = useT();

	const named = move.victim || move.id;
	const piece = t(PIECE_KEY[pz.getType(named)]);

	return (
		<HexMark id={`last-move-${move.id}`} style={box} aria-hidden="true">
			<HexTag>{t(EVENT_KEY[move.event], { piece })}</HexTag>
		</HexMark>
	);
}

export default LastMove;
