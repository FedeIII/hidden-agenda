import React from 'react';
import BoardContainer from 'containers/boardContainer';
import HqContainer from 'containers/hqContainer';

function PlayPhase ({
    players,
    hasTurnEnded,
    isSnipeOn,
    onNextTurn,
    onSnipe
}) {

    function renderTurn () {
        return `Player's turn: ${players.find(player => player.turn).name}`;
    }

    const nextTurnBtnClass = 'btn' + (hasTurnEnded ? ' btn--active' : '');
    const snipeBtnClass = 'btn btn--small' + (isSnipeOn ? ' btn--active' : '');

    return (
        <div className="play-phase">
            <div className="play-phase__turn">
                {renderTurn()}
            </div>
            <div className="play-phase__board">
                <div className="play-phase__hqs">
                    <HqContainer team="0" />
                    <HqContainer team="1" />
                </div>
                <div className="board">
                    <BoardContainer />
                </div>
                <div className="play-phase__hqs">
                    <HqContainer team="2" />
                    <HqContainer team="3" />
                </div>
            </div>
            <div className="play-phase__buttons">
                <button className={snipeBtnClass} onClick={onSnipe}>SNIPE!</button>
                <button className={nextTurnBtnClass} onClick={onNextTurn}>NEXT TURN</button>
            </div>
        </div>
    );
}

export default PlayPhase;
