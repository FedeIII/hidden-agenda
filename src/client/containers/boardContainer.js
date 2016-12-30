import {connect} from 'react-redux';

import Board from 'components/board';

function concatPieces (team0, team1, team2, team3) {
    return []
        .concat(Object.values(team0))
        .concat(Object.values(team1))
        .concat(Object.values(team2))
        .concat(Object.values(team3));
}

function mapStateToProps ({team0, team1, team2, team3}) {
    return {
        pieces: concatPieces(team0, team1, team2, team3)
    }
}

const BoardContainer = connect(
    mapStateToProps
)(Board);

export default BoardContainer;
