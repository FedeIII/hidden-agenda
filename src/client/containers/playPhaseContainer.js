import PlayPhase from 'components/playPhase';
import {connect} from 'react-redux';
import {nextTurn} from 'client/actions';

function mapStateToProps ({players, hasTurnEnded}) {
    return {
        players,
        hasTurnEnded
    }
}

function mergeProps (stateProps, {dispatch}) {
    return Object.assign(
        stateProps,
        {
            nextPlayerTurn() {
                if (stateProps.hasTurnEnded) {
                    dispatch(nextTurn());
                }
            }
        }
    );
}

const PlayPhaseContainer = connect(
    mapStateToProps,
    null,
    mergeProps
)(PlayPhase);

export default PlayPhaseContainer;
