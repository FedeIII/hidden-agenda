import React, {PropTypes} from 'react';

import PieceContainer from 'containers/pieceContainer';

function Hexagon ({
    row, cell,
    piece,
    highlighted,
    onClick,
    onMouseEnter
}) {

    function renderPiece () {
        if (piece) {
            return (
                <PieceContainer
                    {...piece}
                />
            );
        }
    }

    let className = `hexagon hexagon--row-${row}-cell-${cell}`;
    className += highlighted ? ' hexagon--highlighted' : '';
    const PieceComponent = renderPiece();

    return (
        <div className={className} onClick={() => onClick()} onMouseEnter={onMouseEnter}>
            {PieceComponent}
        </div>
    );
}

Hexagon.propTypes = {
    row: PropTypes.number.isRequired,
    cell: PropTypes.number.isRequired,
    piece: PropTypes.object,
    highlighted: PropTypes.bool
};

export default Hexagon;
