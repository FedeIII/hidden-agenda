import PlayPhase from 'components/playPhase';
import {connect} from 'react-redux';
import {endTurn} from 'client/actions';

function mapStateToProps ({players, turn}) {
    return {
        players,
        turn
    }
}

function mapDispatchToProps (dispatch) {
    return {
        endPlayerTurn() {
            dispatch(endTurn());
        }
    };
}

const PlayPhaseContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayPhase);

export default PlayPhaseContainer;
