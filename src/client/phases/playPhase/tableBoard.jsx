import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { pz } from 'Domain/pieces';
import { areCoordsInList } from 'Domain/utils';
import { CELLS_BY_ROW, ROW_NUMBERS } from 'Domain/cells';
import { StateContext } from 'State';
import createBoardScene from 'Client/three/boardScene';
import useSkin from 'Hooks/useSkin';
import useThreeView from 'Client/three/useThreeView';
import { TableBoardStyled, BoardRow, BoardMarks, Tick, Dimension, Callout } from './components';
import Hexagon from './hexagon';

// One cell either side of every row, plus a row above and below the board, so a piece on the
// border can still be pointed outwards.
const EDGE_ROW_CELLS = 3;

// Derived rather than imported: the column coordinates hang off the widest row, and asking the grid
// which that is beats a second copy of the number.
const WIDEST_ROW = CELLS_BY_ROW.indexOf(Math.max(...CELLS_BY_ROW));
const PLAYABLE_CELLS = CELLS_BY_ROW.reduce((total, cells) => total + cells, 0);

// What a dimension line measures is the thing's extent, so this is the board's width in cells — the
// widest row, seven — and not the number of rows. It said ROWS for a while, which is a different
// number that happens to be seven as well.
const BOARD_CELLS = Math.max(...CELLS_BY_ROW);

// Spelled out for the callout, because "A" is a fine id and a poor label.
const TYPE_NAMES = { A: 'AGENT', C: 'CEO', S: 'SPY', N: 'SNIPER' };

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

// Row and column coordinates, so the table can say R3C4 out loud instead of pointing.
//
// Positioned from the layout the renderer already handed back, which is the same projection the
// invisible click boxes come from — so a tick cannot drift from the tile it names. Rows sit on the
// ring cell to the left of each row; columns take their x from the widest row and their y from the
// phantom row below the board, because row 7's own width is three cells and would bunch them up.
//
// Every offset goes through the `style` prop. In a styled-components template each distinct px value
// mints a class that is never reclaimed.
function centreOf(box) {
	if (!box) {
		return null;
	}

	return {
		x: parseFloat(box.left) + parseFloat(box.width) / 2,
		y: parseFloat(box.top) + parseFloat(box.height) / 2,
	};
}

// A drawing names the part it is pointing at. The selected piece gets a leader line and its own id,
// which is the honest item number here — `0-A1` already encodes team, type and number.
function SelectedCallout({ layout, piece }) {
	if (!piece || !piece.position) {
		return null;
	}

	const at = centreOf(layout[`${piece.position[0]}-${piece.position[1]}`]);

	if (!at) {
		return null;
	}

	return (
		<Callout style={{ left: `${at.x}px`, top: `${at.y}px` }}>
			<i>{pz.getNumber(piece.id) || pz.getType(piece.id)}</i>
			<b>
				{piece.id} · {TYPE_NAMES[pz.getType(piece.id)]}, TEAM {pz.getTeam(piece.id)}
			</b>
		</Callout>
	);
}

function BoardCoordinates({ layout, selected }) {
	if (!layout) {
		return null;
	}

	const below = centreOf(layout[`${ROW_NUMBERS.length}-1`]);

	return (
		<BoardMarks aria-hidden="true">
			<Dimension>
				<span>
					{BOARD_CELLS} CELLS &middot; {PLAYABLE_CELLS} PLAYABLE
				</span>
			</Dimension>

			{ROW_NUMBERS.map(row => {
				const at = centreOf(layout[`${row}--1`]);

				return (
					at && (
						<Tick key={`row-${row}`} style={{ left: `${at.x}px`, top: `${at.y}px` }}>
							{row}
						</Tick>
					)
				);
			})}

			{below &&
				CELLS_BY_ROW.map((_cells, cell) => {
					const at = centreOf(layout[`${WIDEST_ROW}-${cell}`]);

					return (
						at && (
							<Tick key={`cell-${cell}`} style={{ left: `${at.x}px`, top: `${below.y}px` }}>
								{cell}
							</Tick>
						)
					);
				})}

			<SelectedCallout layout={layout} piece={selected} />
		</BoardMarks>
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
		<TableBoardStyled id="board" ref={boardRef} dimensional={!!layout} onMouseLeave={onLeave}>
			<BoardCoordinates layout={layout} selected={selectedPiece} />

			{renderRow(-1, EDGE_ROW_CELLS, board)}

			{ROW_NUMBERS.map(row => renderRow(row, CELLS_BY_ROW[row], board))}

			{renderRow(ROW_NUMBERS.length, EDGE_ROW_CELLS, board)}
		</TableBoardStyled>
	);
}

export default TableBoard;
