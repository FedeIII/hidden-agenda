import PlayPhase from 'components/playPhase';
import {connect} from 'react-redux';
import {nextTurn} from 'client/actions';

function mapStateToProps ({players}) {
    return {players}
}

function mapDispatchToProps (dispatch) {
    return {
        nextPlayerTurn() {
            dispatch(nextTurn());
        }
    };
}

const PlayPhaseContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayPhase);

export default PlayPhaseContainer;
