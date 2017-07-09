import React from 'react';

function NumberPlayersOption ({n, numberPlayers, onChange}) {
    const selected = n === numberPlayers;
    return (
        <div key={`players${n}`} className="start-phase__number-players-option">
            <input type="radio"
                id={`players${n}`}
                name="number-players"
                value={n}
                defaultChecked={selected}
                onChange={onChange}
            />
            <label htmlFor={n}>{n}</label>
        </div>
    );
}

function PlayerOptions ({n, names}) {
    return (
        <div key={`player${n}`} className="start-phase__player">
            <div className="start-phase__title">PLAYER {n}</div>
            <input
                type="text"
                id={`player-name${n}`}
                name="player1"
                className="start-phase__player-name"
                ref={(input) => names[`input${n}`] = input}
            />
        </div>
    );
}

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
                            {Array(5).fill().map((_, i) =>
                                <NumberPlayersOption
                                    key={i + 2}
                                    n={i + 2}
                                    numberPlayers={this.state.numberPlayers}
                                    onChange={(e) => this.onNumberPlayersChange(e)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="start-phase__main-title">
                        2. PLAYERS
                    </div>

                    <div className="start-phase__players">
                        {Array(this.state.numberPlayers).fill().map((_, i) =>
                            <PlayerOptions
                                key={i + 1}
                                n={i + 1}
                                names={this.nameInputs}
                            />
                        )}
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
