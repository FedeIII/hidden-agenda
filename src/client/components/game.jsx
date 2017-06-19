import React from 'react';
import StartPhase from 'components/startPhase';
import PlayPhaseContainer from 'containers/playPhaseContainer';

function Game ({phase, players, onStart}) {

    function getPhase () {
        switch (phase) {
            case 'start':
                return (<StartPhase onStart={onStart} />);
                break;
            case 'play':
                return (<PlayPhaseContainer />);
                break;
            default:
                return (<PlayPhaseContainer />);
        }
    }

    return (
        <div className="game">
            {getPhase()}
        </div>
    );
}

export default Game;
