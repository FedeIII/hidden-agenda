import {connect} from 'react-redux';

import Hq from 'components/hq';

function getTeamPieces (statePieces, team) {
    return statePieces.filter(piece =>
        piece.id.charAt(0) === team
        && !piece.position
    );
}

function mapStateToProps (state, {team}) {
    return {
        pieces: getTeamPieces(state.pieces, team)
    }
}

const HqContainer = connect(
    mapStateToProps,
    null
)(Hq);

export default HqContainer;