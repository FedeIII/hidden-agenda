import React from 'react';
import StartPhase from 'components/startPhase';
import PlayPhase from 'components/playPhase';

function Game ({phase, players, onStart}) {

    function getPhase () {
        switch (phase) {
            case 'start':
                return (<StartPhase onStart={onStart} />);
                break;
            case 'play':
                return (<PlayPhase players={players}/>);
                break;
            default:
                return (<PlayPhase players={players}/>);
        }
    }

    return (
        <div className="game">
            {getPhase()}
        </div>
    );
}

export default Game;
