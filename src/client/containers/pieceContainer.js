import {connect} from 'react-redux';
import {togglePiece} from 'client/actions';

import Piece from 'components/piece';

function mapStateToProps ({hasTurnEnded}) {
    return {hasTurnEnded};
}

function mergeProps ({hasTurnEnded}, {dispatch}, ownProps) {
    return Object.assign({},
        ownProps,
        {
            onClick: id => {
                if (!hasTurnEnded) {
                    dispatch(togglePiece(id));
                }
            }
        }
    );
}

const PieceContainer = connect(
    mapStateToProps,
    null,
    mergeProps
)(Piece);

export default PieceContainer;
