import {connect} from 'react-redux';

import piecesHelper from 'shared/pieces';

import Board from 'components/board';
import {movePiece, directPiece} from 'client/actions';

function getHighlightedCells (showMoveCells, pieces) {
    if (showMoveCells) {
        return piecesHelper.getHighlightedCells(pieces);
    } else {
        return [];
    }
}

function mapStateToProps ({pieces, followMouse, showMoveCells}) {
    return {
        pieces: pieces,
        selectedPiece: piecesHelper.getSelectedPiece(pieces),
        highlightedCells: getHighlightedCells(showMoveCells, pieces),
        followMouse: followMouse
    };
}

function mergeProps (stateProps, dispatchProps, ownProps) {
    return Object.assign({},
        ownProps,
        stateProps,
        {
            onHexagonClick: coords => {
                dispatchProps.dispatch(movePiece(stateProps.selectedPiece.id, coords));
            },

            onMouseEnter: (r, c) => {
                if (!stateProps.highlightedCells.length && stateProps.selectedPiece) {
                    const selectedPiece = piecesHelper.getSelectedPiece(stateProps.pieces);
                    dispatchProps.dispatch(directPiece(selectedPiece, [r, c]));
                }
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
