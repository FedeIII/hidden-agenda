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
    selectedDirection,
    selected,
    onClick
}) {

    function getClassName () {
        let className = 'piece';

        //TODO: give value to direction once placed on board
        if (selectedDirection) {
            const verticalClass = directionClassMap.vertical[selectedDirection[0]];
            const horizontalClass = directionClassMap.horizontal[selectedDirection[1]];
            className += ` piece--direction${verticalClass}${horizontalClass}`;
        } else {
            className += ` piece--hq piece--hq--${id.slice(2)}`;
        }

        className += selected ? ' piece--selected' : '';


        return className;
    }

    let className = getClassName();

    return (
        <img
            src="img/agent.png"
            className={className}
            onClick={() => onClick(id)}
        />
    );
}

export default Piece;
