import useT from 'Client/i18n';
import { HexMark, HexTag } from './components';

/**
 * The cell the last player's move ended on.
 *
 * Everybody moves everybody's pieces here, so a player arriving at their turn is looking at a board
 * that has changed without being told which of 32 tokens changed it. The mark says that much and no
 * more: no ring and no arrow to a second cell, because it is a caption rather than a control and
 * the cell underneath is an ordinary one.
 *
 * Drawn from two places, because the board is drawn two ways and neither can do the other's job —
 * see FallenSniper, which has the same pair of paths for the same reason.
 *
 * @param {object} props
 * @param {string} props.id      the piece that moved
 * @param {object} [props.box]   projected `{left, top, width, height}`, absent on the flat board
 */
function LastMove({ id, box }) {
	const t = useT();

	return (
		<HexMark id={`last-move-${id}`} style={box} aria-hidden="true">
			<HexTag>{t('play.lastMove')}</HexTag>
		</HexMark>
	);
}

export default LastMove;
