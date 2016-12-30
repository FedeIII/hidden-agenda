import {connect} from 'react-redux';
import {togglePiece} from 'client/actions';

import Piece from 'components/piece';

function mapDispatchToProps (dispatch) {
    return {
        onPieceClick: (id) => {
            dispatch(togglePiece(id))
        }
    }
}

const PieceContainer = connect(
    null,
    mapDispatchToProps
)(Piece);

export default PieceContainer;
