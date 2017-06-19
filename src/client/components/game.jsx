import React from 'react';
import StartPhase from 'components/startPhase';
import PlayPhase from 'components/playPhase';

function Game ({phase, onStart}) {

    function getPhase () {
        switch (phase) {
            case 'start':
                return (<StartPhase onStart={onStart}/>);
                break;
            case 'play':
                return (<PlayPhase />);
                break;
            default:
                return (<PlayPhase />);
        }
    }

    return (
        <div className="game">
            {getPhase()}
        </div>
    );
}

export default Game;
