import React, {PropTypes} from 'react';
import pz from 'shared/pz';

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
    highlighted,
    onClick,
    onHover
}) {

    function getClassName () {
        let className = 'piece';

        if (selectedDirection) {
            const verticalClass = directionClassMap.vertical[selectedDirection[0]];
            const horizontalClass = directionClassMap.horizontal[selectedDirection[1]];
            className += ` piece--direction${verticalClass}${horizontalClass}`;
        } else {
            className += ` piece--hq piece--hq--${type}${pieceNumber}`;
        }

        className += selected || highlighted ? ' piece--selected' : '';


        return className;
    }

    const team = pz.getTeam(id);
    const type = pz.getType(id);
    const pieceNumber = pz.getNumber(id);
    const image = `img/${team}-${type}.png`;
    const className = getClassName();

    return (
        <img
            src={image}
            className={className}
            onClick={() => onClick(id)}
            onMouseOver={() => onHover(id)}
        />
    );
}

export default Piece;
