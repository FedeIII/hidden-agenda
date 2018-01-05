import {connect} from 'react-redux';

import pz from 'shared/pz';
import cells from 'shared/cells';
import {areCoordsInList} from 'shared/utils';

import Board from 'components/board';
import {togglePiece, movePiece, directPiece, dehighlightSnipers} from 'client/actions';

function mapStateToProps ({pieces, followMouse, pieceState, isSniping}) {
    return {
        pieces,
        selectedPiece: pz.getSelectedPiece(pieces),
        highlightedCells: pz.getHighlightedCells(pieces),
        followMouse,
        pieceState,
        isSniping
    };
}

function mergeProps (stateProps, {dispatch}, ownProps) {
    return Object.assign({},
        ownProps,
        stateProps,
        {
            onHexagonClick: coords => {
                if (stateProps.followMouse) {
                    const selectedPiece = pz.getSelectedPiece(stateProps.pieces);
                    if (selectedPiece) {
                        dispatch(togglePiece(selectedPiece.id));
                    }
                } else if (areCoordsInList(coords, stateProps.highlightedCells)) {
                    dispatch(movePiece(stateProps.selectedPiece.id, coords));
                }
            },

            onMouseEnter: (r, c) => {
                if (!stateProps.highlightedCells.length && stateProps.selectedPiece) {
                    const possibleDirections = pz.getPossibleDirections(stateProps.selectedPiece, stateProps.pieces, stateProps.pieceState);
                    const intendedDirection = cells.getDirection(stateProps.selectedPiece.position, [r, c]);
                    if (areCoordsInList(intendedDirection, possibleDirections)) {
                        dispatch(directPiece(intendedDirection));
                    }
                }

                if (stateProps.isSniping) {
                    dispatch(dehighlightSnipers());
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
