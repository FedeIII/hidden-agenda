import useT from 'Client/i18n';
import { FallenSniperMark, HexTag } from './components';

/**
 * The cell a sniper that is no longer on the board is fired from.
 *
 * Drawn from two places, because the board is drawn two ways and neither can do the other's job.
 * Flat, this is a child of the hexagon it marks and fills it. In 3D the hexagons are transparent
 * hit targets — `opacity: 0`, so nothing inside one is visible at all — and the mark is laid on the
 * board itself at the box the renderer projected, which is what `box` carries. `useCellAction`
 * answers the click either way, so the two paths differ in where the label is and nothing else.
 *
 * @param {object} props
 * @param {string} props.id      the sniper this cell fires
 * @param {object} [props.box]   projected `{left, top, width, height}`, absent on the flat board
 */
function FallenSniper({ id, box }) {
	const t = useT();

	return (
		<FallenSniperMark id={`snipe-fallen-${id}`} style={box} aria-hidden="true">
			<HexTag>
				{t('play.fallenSniper')}
				<i>{t('play.fallenSniperNote')}</i>
			</HexTag>
		</FallenSniperMark>
	);
}

export default FallenSniper;
