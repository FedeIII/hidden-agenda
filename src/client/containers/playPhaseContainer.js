import PlayPhase from 'components/playPhase';
import {connect} from 'react-redux';
import {nextTurn, snipe} from 'client/actions';
import pz from 'shared/pz';

function mapStateToProps ({pieces, players, hasTurnEnded, isSniping}) {
    return {
        players,
        hasTurnEnded,
        isSnipeOn: pz.isSniperOnBoard(pieces) && !isSniping
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
                if (stateProps.isSnipeOn) {
                    dispatch(snipe());
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
