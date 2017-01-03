import {connect} from 'react-redux';

import pieces from 'shared/pieces';

import Board from 'components/board';
import {movePiece} from 'client/actions';

function getSelectedPiece (state) {
    return state.find(piece => piece.selected);
}

function getHighlightedCells (selectedPiece) {
    return pieces.getHighlightedCells(selectedPiece);
}

function mapStateToProps (state) {
    const selectedPiece = getSelectedPiece(state);

    return {
        pieces: state,
        selectedPiece: selectedPiece,
        highlightedCells: getHighlightedCells(selectedPiece)
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
