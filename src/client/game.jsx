import React from 'react';

import BoardContainer from 'containers/boardContainer';
import Hq from 'components/hq';

function Game () {
    return (
        <div className="game">
            <div className="game-container">
                <div className="hqs">
                    <Hq team="0" />
                    <Hq team="1" />
                </div>
                <div className="game-board">
                    <BoardContainer />
                </div>
                <div className="hqs">
                    <Hq team="2" />
                    <Hq team="3" />
                </div>
            </div>
        </div>
    );
}

export default Game;
