import {connect} from 'react-redux';

import Board from 'components/board';
import {movePiece} from 'client/actions';

function concatPieces ({team0, team1, team2, team3}) {
    return []
        .concat(Object.values(team0))
        .concat(Object.values(team1))
        .concat(Object.values(team2))
        .concat(Object.values(team3));
}

function getSelectedPiece (pieces) {
    return pieces.find(piece => piece.selected);
}

function mapStateToProps (state) {
    const pieces = concatPieces(state);

    return {
        pieces: pieces,
        selectedPiece: getSelectedPiece(pieces)
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
