import React from 'react';
import ReactDOM from 'react-dom';

import Board from 'components/board';
import cells from 'shared/cells';
import pieces from 'shared/pieces';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            pieces: pieces.getInitialState(),
            pieceSelected: null,
            availableCells: null
        };
    }

    movePiece(pieceName, r, c) {
        this.setState({
            pieces: pieces.movePiece(this.state.pieces, pieceName, [r, c]),
            pieceSelected: null,
            availableCells: null
        });
    }

    getAvailableCells(pieceName) {
        const piece = this.state.pieces[pieceName];
        const adjacentCells = cells.getAdjacentCells(piece.position[0], piece.position[1]);
        const availableCells = pieces.getAvailableCells(piece, adjacentCells);

        return availableCells;
    }

    selectPiece(pieceName) {
        this.setState({
            pieceSelected: pieceName,
            availableCells: this.getAvailableCells(pieceName)
        });
    }

    deselectPiece() {
        this.setState({
            pieceSelected: false,
            availableCells: null
        });
    }

    render() {
        return (
            <div className="game">
                <div className="game-container">
                    <div className="game-board">
                        <Board
                            pieces={this.state.pieces}
                            pieceSelected={this.state.pieceSelected}
                            availableCells={this.state.availableCells}
                            selectPiece={(p) => this.selectPiece(p)}
                            deselectPiece={() => this.deselectPiece()}
                            movePiece={(p, r, c) => this.movePiece(p, r, c)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.querySelector('.app')
);
