import React from 'react';
import BoardContainer from 'containers/boardContainer';
import HqContainer from 'containers/hqContainer';

function PlayPhase () {
    return (
        <div className="play-phase">
            <div className="hqs">
                <HqContainer team="0" />
                <HqContainer team="1" />
            </div>
            <div className="board">
                <BoardContainer />
            </div>
            <div className="hqs">
                <HqContainer team="2" />
                <HqContainer team="3" />
            </div>
        </div>
    );
}

export default PlayPhase;
