import React, {PropTypes} from 'react';

const directionClassMap = {
    vertical: {
        '-1': '-down',
        '0': '',
        '1': '-up'
    },
    horizontal: {
        '1': '-left',
        '0': '-right'
    }
};

function Piece ({
    pieceId,
    onBoard,
    position,
    direction,
    selected,
    onPieceClick
}) {
    const verticalClass = directionClassMap.vertical[direction[0]];
    const horizontalClass = directionClassMap.horizontal[direction[1]];
    let directionClass = `piece--direction${verticalClass}${horizontalClass}`;

    let className = `piece ${directionClass}`;
    className += selected ? ' piece--selected' : '';

    return (
        <img src="img/agent.png" className={className} onClick={() => onPieceClick(pieceId)} />
    );
}

export default Piece;
