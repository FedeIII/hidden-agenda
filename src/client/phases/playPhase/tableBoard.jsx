import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { pz } from 'Domain/pieces';
import { areCoordsInList } from 'Domain/utils';
import { CELLS_BY_ROW, ROW_NUMBERS } from 'Domain/cells';
import { StateContext } from 'State';
import createBoardScene from 'Client/three/boardScene';
import useSkin from 'Hooks/useSkin';
import useThreeView from 'Client/three/useThreeView';
import { TableBoardStyled, BoardRow } from './components';
import Hexagon from './hexagon';

// One cell either side of every row, plus a row above and below the board, so a piece on the
// border can still be pointed outwards.
const EDGE_ROW_CELLS = 3;

function renderRow(row, numberOfCells, board) {
	const hexagons = [];

	for (let cell = -1; cell <= numberOfCells; cell++) {
		hexagons.push(
			<Hexagon
				key={`hex-${row}-${cell}`}
				row={row}
				cell={cell}
				edge={cell === -1 || cell === numberOfCells || row < 0 || row >= ROW_NUMBERS.length}
				piece={pz.getPieceAtPosition([row, cell], board.pieces)}
				highlighted={areCoordsInList([row, cell], board.highlightedPositions)}
				aim={board.aim}
				onHover={board.onHover}
				// Where the renderer put this cell's tile, in pixels across and down the board.
				// Absent when there is no renderer, and then every hexagon draws itself as before.
				box={board.layout && board.layout[`${row}-${cell}`]}
			/>,
		);
	}

	return (
		<BoardRow key={`row-${row}`} dimensional={!!board.layout}>
			{hexagons}
		</BoardRow>
	);
}

function TableBoard() {
	const [{ pieces, pieceState, snipe }] = useContext(StateContext);
	const boardRef = useRef(null);
	const skin = useSkin();

	// Which cell the pointer is on. React state rather than something imperative, because it only
	// changes when the pointer crosses a cell boundary — a few times a second while moving, not
	// once a frame.
	const [hovered, setHovered] = useState(null);
	const onHover = useCallback(
		cell => setHovered(at => (at && cell && at[0] === cell[0] && at[1] === cell[1] ? at : cell)),
		[],
	);
	const onLeave = useCallback(() => setHovered(null), []);

	// Worked out once for the whole board. This used to live in a function called for each of
	// the 53 cells, which recomputed the highlights every time and — because that function also
	// held useContext and useCallback — called hooks in a loop.
	const highlightedPositions = useMemo(() => pz.getHighlightedPositions(pieces, pieceState), [pieces, pieceState]);
	const selectedPiece = pz.getSelectedPiece(pieces);

	// Pointing is only offered once the selected piece has nowhere left to move, which is what
	// keeps a hover from hijacking a move. A piece still in its HQ has no position to aim from.
	const canAim = !!selectedPiece && !!selectedPiece.position && !highlightedPositions.length;

	// Memoised because the renderer takes it too, and a fresh object every render would have it
	// replacing six aim markers on every keystroke elsewhere in the app.
	const aim = useMemo(
		() =>
			canAim
				? {
						from: selectedPiece.position,
						directions: pz.getPossibleDirections(selectedPiece, pieces, pieceState),
					}
				: null,
		[canAim, selectedPiece, pieces, pieceState],
	);

	// The renderer is a view of the same state the hexagons are drawn from, never a second copy
	// of it. Everything it needs arrives here and nothing else does.
	const scene = useMemo(
		() => ({ pieces, highlightedPositions, snipe, aim, hovered }),
		[pieces, highlightedPositions, snipe, aim, hovered],
	);

	// Bound to the skin so a change rebuilds the scene, which only ever happens once per game —
	// the board does not exist until the phase after the skin is settled.
	const createScene = useCallback(element => createBoardScene(element, skin), [skin]);
	const layout = useThreeView(boardRef, createScene, scene);

	const board = { pieces, highlightedPositions, layout, aim, onHover: layout ? onHover : undefined };

	return (
		<TableBoardStyled ref={boardRef} dimensional={!!layout} onMouseLeave={onLeave}>
			{renderRow(-1, EDGE_ROW_CELLS, board)}

			{ROW_NUMBERS.map(row => renderRow(row, CELLS_BY_ROW[row], board))}

			{renderRow(ROW_NUMBERS.length, EDGE_ROW_CELLS, board)}
		</TableBoardStyled>
	);
}

export default TableBoard;
