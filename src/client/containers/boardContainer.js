import {connect} from 'react-redux';

import piecesHelper from 'shared/pieces';
import cells from 'shared/cells';
import {areCoordsInList} from 'shared/utils';

import Board from 'components/board';
import {togglePiece, movePiece, directPiece} from 'client/actions';

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
                    const possibleDirections = piecesHelper.getPossibleDirections(stateProps.selectedPiece, stateProps.pieces);
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
