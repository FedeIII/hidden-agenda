import {connect} from 'react-redux';

import Board from 'components/board';
import {movePiece} from 'client/actions';

function getSelectedPiece (state) {
    return state.find(piece => piece.selected);
}

function mapStateToProps (state) {
    return {
        pieces: state,
        selectedPiece: getSelectedPiece(state)
    };
}

function mergeProps (stateProps, dispatchProps, ownProps) {
    return Object.assign({},
        ownProps,
        stateProps,
        {
            onHexagonClick: coords => {
                dispatchProps.dispatch(movePiece(stateProps.selectedPiece.id, coords))
            }
        }
    );
}

const BoardContainer = connect(
    mapStateToProps,
    null,
    mergeProps
)(Board);

export default BoardContainer;
