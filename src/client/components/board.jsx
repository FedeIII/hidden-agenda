import React from 'react';

import Hexagon from './hexagon';

class Board extends React.Component {
    getCellAvailability(r, c) {
        if (this.props.availableCells) {
            const isCellAvailable = this.props.availableCells.some((cell) => {
                return cell[0] === r && cell[1] === c;
            });

            return isCellAvailable;
        }
    }

    selectPiece(piece) {
        let pieceName;

        for (let key in this.props.pieces) {
            if (this.props.pieces[key] === piece) {
                pieceName = key;
            }
        }

        this.props.selectPiece(pieceName);
    }

    renderHexagon(r, c) {
        let pieceInHexagon, pieceInHexagonName;
        const pieces = this.props.pieces;
        for (let pieceName in pieces) {
            const piece = pieces[pieceName];
            if (piece.position[0] === r &&
                piece.position[1] === c) {
                    pieceInHexagon = piece;
                    pieceInHexagonName = pieceName;
                }
        }
        const isAvailable = this.getCellAvailability(r, c);
        const isPieceSelected = (pieceInHexagonName === this.props.pieceSelected);

        return (
            <Hexagon
                key={`${r}${c}`}
                row={r} cell={c}
                piece={pieceInHexagon}
                isPieceSelected={isPieceSelected}
                highlighted={isAvailable}
                selectPiece={(p) => this.selectPiece(p)}
                deselectPiece={() => this.props.deselectPiece()}
                movePiece={(r, c) => this.props.movePiece(this.props.pieceSelected, r, c)}
            />
        );
    }

    render() {
        const i = [0, 1, 2, 3, 4, 5, 6];

        const rows = i.map(row => {
            const className = `board-row board-row-${row}`;
            const numberOfCells = (row < 4) * (row + 4) +
                                    (row > 3) * (10 - row);
            const cells = [];

            for (let cell = 0; cell < numberOfCells; cell++) {
                cells.push(this.renderHexagon(row, cell));
            }

            return (
                <div key={row} className={className}>
                    {cells}
                </div>
            );
        });

        return (
            <div>
                {rows}
            </div>
        );
    }
}

export default Board;
