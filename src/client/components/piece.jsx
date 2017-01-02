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
    id,
    position,
    direction,
    selected,
    onPieceClick
}) {

    function getClassName () {
        let className = 'piece';

        if (direction) {
            const verticalClass = directionClassMap.vertical[direction[0]];
            const horizontalClass = directionClassMap.horizontal[direction[1]];
            className += ` piece--direction${verticalClass}${horizontalClass}`;
        } else {
            className += ` piece--hq piece--hq--${id.slice(2)}`;
        }

        className += selected ? ' piece--selected' : '';


        return className;
    }

    let className = getClassName();

    return (
        <img src="img/agent.png" className={className} onClick={() => onPieceClick(id)} />
    );
}

export default Piece;
