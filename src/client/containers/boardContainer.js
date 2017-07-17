import {connect} from 'react-redux';

import piecesHelper from 'shared/pieces';
import cells from 'shared/cells';
import {areCoordsInList} from 'shared/utils';

import Board from 'components/board';
import {togglePiece, movePiece, directPiece} from 'client/actions';

function getHighlightedCells (pieces) {
    if (pieces.find(piece => piece.showMoveCells)) {
        return piecesHelper.getHighlightedCells(pieces);
    } else {
        return [];
    }
}

function mapStateToProps ({pieces, followMouse, pieceState}) {
    return {
        pieces: pieces,
        selectedPiece: piecesHelper.getSelectedPiece(pieces),
        highlightedCells: getHighlightedCells(pieces),
        followMouse: followMouse,
        pieceState: pieceState
    };
}

function mergeProps (stateProps, {dispatch}, ownProps) {
    return Object.assign({},
        ownProps,
        stateProps,
        {
            onHexagonClick: coords => {
                if (stateProps.followMouse) {
                    const selectedPiece = piecesHelper.getSelectedPiece(stateProps.pieces);
                    if (selectedPiece) {
                        dispatch(togglePiece(selectedPiece.id));
                    }
                } else if (areCoordsInList(coords, stateProps.highlightedCells)) {
                    dispatch(movePiece(stateProps.selectedPiece.id, coords));
                }
            },

            onMouseEnter: (r, c) => {
                if (!stateProps.highlightedCells.length && stateProps.selectedPiece) {
                    const possibleDirections = piecesHelper.getPossibleDirections(stateProps.selectedPiece, stateProps.pieces, stateProps.pieceState);
                    const intendedDirection = cells.getDirection(stateProps.selectedPiece.position, [r, c]);
                    if (areCoordsInList(intendedDirection, possibleDirections)) {
                        dispatch(directPiece(intendedDirection));
                    }
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
