import {connect} from 'react-redux';

import pieces from 'shared/pieces';

import Board from 'components/board';
import {movePiece, directPiece} from 'client/actions';

function getSelectedPiece (statePieces) {
    return statePieces.find(piece => piece.selected);
}

function getHighlightedCells (showMoveCells, selectedPiece) {
    if (showMoveCells) {
        return pieces.getHighlightedCells(selectedPiece);
    } else {
        return [];
    }
}

function mapStateToProps ({pieces, followMouse, showMoveCells}) {
    const selectedPiece = getSelectedPiece(pieces);

    return {
        pieces: pieces,
        selectedPiece: selectedPiece,
        highlightedCells: getHighlightedCells(showMoveCells, selectedPiece),
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

            onMouseMove: id => {
                if (stateProps.followMouse) {
                    dispatchProps.dispatch(directPiece(id));
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
