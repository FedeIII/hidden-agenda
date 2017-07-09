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

function PlayerOptions ({n, names, onChange}) {
    return (
        <div key={`player${n}`} className="start-phase__player">
            <div className="start-phase__title">PLAYER {n}</div>
            <input
                type="text"
                id={`player-name${n}`}
                name={`player${n}`}
                className="start-phase__player-name"
                onBlur={onChange}
            />
        </div>
    );
}

class StartPhase extends React.Component {

    // ({
    //     onStart
    // })

    constructor(props) {
        super(props);
        this.state = {
            numberPlayers: 2,
            names: {}
        };
    }

    onNumberPlayersChange(event) {
        this.setState({
            numberPlayers: parseInt(event.target.value),
            names: Object.entries(this.state.names)
                    .slice(0, event.target.value)
                    .reduce((acc, [input, name]) => Object.assign(acc, {[input]: name}), {})
        });
    }

    selectOptions({target}) {
        this.setState({
            names: Object.assign(
                this.state.names,
                {
                    [target.name]: target.value
                }
            )
        });
    }

    onStartClick() {
        if (this.areAllPlayersReady) {
            this.props.onStart(Object.values(this.state.names));
        }
    }

    getStartButtonClass() {
        return 'btn' + (this.areAllPlayersReady ? ' btn--active' : '');
    }

    render () {
        this.areAllPlayersReady = Object.keys(this.state.names).length === this.state.numberPlayers;

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
                                onChange={(e) => this.selectOptions(e)}
                            />
                        )}
                    </div>
                </div>

                <div className="start-phase__buttons">
                    <button className={this.getStartButtonClass()} onClick={() => this.onStartClick()}>START</button>
                </div>
            </div>
        );
    }
}

export default StartPhase;
