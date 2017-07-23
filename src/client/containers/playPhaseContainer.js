import PlayPhase from 'components/playPhase';
import {connect} from 'react-redux';
import {nextTurn, snipe} from 'client/actions';

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
            onNextTurn() {
                if (stateProps.hasTurnEnded) {
                    dispatch(nextTurn());
                }
            },

            onSnipe() {
                dispatch(snipe());
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
