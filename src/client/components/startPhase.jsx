import React from 'react';

function StartPhase(props) {
  return (
    <div className="start-phase">
      <div className="start-phase__options">
        <div className="start-phase__number-players">
          <div className="start-phase__main-title">1. NUMBER OF PLAYERS</div>
          <div className="start-phase__number-players-options"></div>
        </div>

        <div className="start-phase__main-title">2. PLAYERS</div>

        <div className="start-phase__players"></div>
      </div>

      <div className="start-phase__buttons">
        <button className="btn btn--active" onClick={() => {}}>
          START
        </button>
      </div>
    </div>
  );
}

export default StartPhase;
