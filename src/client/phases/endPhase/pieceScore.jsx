import PieceStyled from 'Client/components/pieceStyled';
import { artSrc } from 'Client/art';
import { PieceTable, PieceRow, PieceCell } from './components';

// A legend of piece types and their points, so the face here names no team. It borrows the dark
// one — team 2 owns it now — because that face reads on all three panels: the mark is white for
// the two dark skins, the hexagon is dark for the manila one.
function PieceType({ type }) {
	const image = artSrc('2', type);

	return <PieceStyled src={image} killed />;
}

function PieceScore() {
	return (
		<PieceTable>
			<PieceRow>
				<PieceCell>
					<PieceType type="A" /> 5 pts
				</PieceCell>
				<PieceCell>
					<PieceType type="S" /> 10 pts
				</PieceCell>
			</PieceRow>

			<PieceRow>
				<PieceCell>
					<PieceType type="N" /> 10 pts
				</PieceCell>
				<PieceCell>
					<PieceType type="C" /> 20 pts
				</PieceCell>
			</PieceRow>
		</PieceTable>
	);
}

export default PieceScore;
