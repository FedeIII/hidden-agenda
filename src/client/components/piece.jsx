import React from 'react';

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

function Piece(props) {
    const verticalClass = directionClassMap.vertical[props.direction[0]];
    const horizontalClass = directionClassMap.horizontal[props.direction[1]];
    let directionClass = `piece--direction${verticalClass}${horizontalClass}`;

    let className = `piece ${directionClass}`;
    className += props.selected ? ' piece--selected' : '';

    return (
        <img src="img/agent.png" className={className} onClick={() => {
            if (props.selected) {
                props.deselectPiece();
            } else {
                props.selectPiece();
            }
        }} />
    );
}

export default Piece;
