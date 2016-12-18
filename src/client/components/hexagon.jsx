import React from 'react';

import Piece from './piece';

class Hexagon extends React.Component {
    handleClick() {
        if (this.props.highlighted) {
            this.props.movePiece(this.props.row, this.props.cell);
        }
    }

    renderPiece() {
        if (this.props.piece) {
            return (
                <Piece
                    direction={this.props.piece.direction}
                    selected={this.props.isPieceSelected}
                    selectPiece={() => this.props.selectPiece(this.props.piece)}
                    deselectPiece={() => this.props.deselectPiece()}
                />
            );
        }
    }

    render() {
        let className = `hexagon hexagon--row-${this.props.row}-cell-${this.props.cell}`;
        className += this.props.highlighted ? ' hexagon--highlighted' : '';
        const piece = this.renderPiece();

        return (
            <div className={className} onClick={() => this.handleClick()}>
                {piece}
            </div>
        );
    }
}

export default Hexagon;
