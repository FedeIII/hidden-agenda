import {connect} from 'react-redux';

import Hq from 'components/hq';

function getTeamPieces (state, team) {
    return state.filter(piece => piece.id.charAt(0) === team);
}

function mapStateToProps (state, {team}) {
    return {
        pieces: getTeamPieces(state, team)
    }
}

const HqContainer = connect(
    mapStateToProps,
    null
)(Hq);

export default HqContainer;
