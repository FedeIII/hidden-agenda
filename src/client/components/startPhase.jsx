import React from 'react';

class StartPhase extends React.Component {

    // ({
    //     onStart
    // })

    constructor (props) {
        super(props);
        this.nameInputs = {};
        this.state = {
            numberPlayers: 2
        };
    }

    onNumberPlayersChange (event) {
        this.setState({
            numberPlayers: parseInt(event.target.value)
        });
    }

    renderNumberPlayersOption (n) {
        const selected = n === this.state.numberPlayers;
        return (
            <div key={`players${n}`} className="start-phase__number-players-option">
                <input type="radio" id={`players${n}`} name="number-players" value={n} defaultChecked={selected} onChange={(e) => this.onNumberPlayersChange(e)} />
                <label htmlFor={n}>{n}</label>
            </div>
        );
    }

    renderPlayerOption (n) {
        return (
            <div key={`player${n}`} className="start-phase__player">
                <div className="start-phase__title">PLAYER {n}</div>
                <input type="text" id={`player-name${n}`} name="player1" className="start-phase__player-name" ref={(input) => this.nameInputs[`input${n}`] = input}/>
            </div>
        );
    }

    renderNumberPlayersOptions () {
        return Array(5).fill().map((_, i) => this.renderNumberPlayersOption(i + 2));
    }

    renderPlayersOptions () {
        return Array(this.state.numberPlayers).fill().map((_, i) => this.renderPlayerOption(i + 1));
    }

    onStartClick () {
        const names = Object.keys(this.nameInputs)
            .map(key => this.nameInputs[key] && this.nameInputs[key].value)
            .filter(Boolean);

        this.props.onStart(names);
    }

    render () {
        return (
            <div className="start-phase">
                <div className="start-phase__options">
                    <div className="start-phase__number-players">
                        <div className="start-phase__main-title">1. NUMBER OF PLAYERS</div>
                        <div className="start-phase__number-players-options">
                            {this.renderNumberPlayersOptions()}
                        </div>
                    </div>

                    <div className="start-phase__main-title">
                        2. PLAYERS
                    </div>

                    <div className="start-phase__players">
                        {this.renderPlayersOptions()}
                    </div>
                </div>

                <div className="start-phase__buttons">
                    <button className="btn" onClick={() => this.onStartClick()}>START</button>
                </div>
            </div>
        );
    }
}

export default StartPhase;
