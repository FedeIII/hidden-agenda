import React from 'react';

import BoardContainer from 'containers/boardContainer';
import HqContainer from 'containers/hqContainer';

function Game () {
    return (
        <div className="mouse-capture">
            <div className="game">
                <div className="game-container">
                    <div className="hqs">
                        <HqContainer team="0" />
                        <HqContainer team="1" />
                    </div>
                    <div className="game-board">
                        <BoardContainer />
                    </div>
                    <div className="hqs">
                        <HqContainer team="2" />
                        <HqContainer team="3" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;
