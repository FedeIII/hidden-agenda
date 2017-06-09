import {connect} from 'react-redux';

import piecesHelper from 'shared/pieces';
import cells from 'shared/cells';

import Board from 'components/board';
import {movePiece, directPiece, setDirection} from 'client/actions';

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
                    dispatch(setDirection());
                } else if (cells.isCellInList(coords, stateProps.highlightedCells)) {
                    dispatch(movePiece(stateProps.selectedPiece.id, coords));
                }
            },

            onMouseEnter: (r, c) => {
                if (!stateProps.highlightedCells.length && stateProps.selectedPiece) {
                    dispatch(directPiece([r, c]));
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
