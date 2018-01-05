import {connect} from 'react-redux';
import {togglePiece, snipe, highlightSniper} from 'client/actions';
import pz from 'shared/pz'

import Piece from 'components/piece';

function mapStateToProps ({hasTurnEnded, isSniping}) {
    return {hasTurnEnded, isSniping};
}

function mergeProps ({hasTurnEnded, isSniping}, {dispatch}, ownProps) {
    return Object.assign({},
        ownProps,
        {
            onClick: id => {
                if (isSniping && pz.isSniper(id)) {
                    dispatch(snipe());
                } else if (!hasTurnEnded) {
                    dispatch(togglePiece(id));
                }
            },

            onHover: id => {
                if (isSniping && pz.isSniper(id)) {
                    dispatch(highlightSniper(id));
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
