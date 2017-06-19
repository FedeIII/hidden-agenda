import {connect} from 'react-redux';
import Game from 'components/game';
import {startGame} from 'client/actions';

function mapStateToProps ({phase, players}) {
    return {
        phase,
        players
    };
}

function mapDispatchToProps (dispatch) {
    return {
        onStart: players => dispatch(startGame(players))
    };
}

const GameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);

export default GameContainer;
