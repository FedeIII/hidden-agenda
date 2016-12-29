import {combineReducers} from 'redux';
import {TOGGLE_PIECE, MOVE_PIECE} from './actions';

const initialState = {
    team0: {
        agent1: {
            pieceId: '0-A1',
            onBoard: false,
            position: null,
            selected: false
        }
    },
    team1: {
        agent1: {
            pieceId: '1-A1',
            onBoard: false,
            position: null,
            selected: false
        }
    },
    team2: {
        agent1: {
            pieceId: '2-A1',
            onBoard: false,
            position: null,
            selected: false
        }
    },
    team3: {
        agent1: {
            pieceId: '3-A1',
            onBoard: false,
            position: null,
            selected: false
        }
    },
    availableCells: []
};

function getTeamFromPiece (pieceId) {
    return 'team' + pieceId.charAt(0);
}

function getPieceNameFromPiece (pieceId) {
    return 'agent' + pieceId.charAt(3);
}

function getPieceInfo (pieceId) {
    return {
        pieceTeam: getTeamFromPiece(pieceId),
        pieceName: getPieceNameFromPiece(pieceId)
    };
}

function createNewTeamInfo (teamInfo, teamKey) {
    const newTeamInfo = {};
    newTeamInfo[teamKey] = teamInfo;

    return newTeamInfo;
}

function toggledPieceState (state, pieceId) {
    const {pieceTeam, pieceName} = getPieceInfo(pieceId);
    const pieceSelected = state[pieceTeam][pieceName].selected;
    const changedState = createNewTeamInfo(state[pieceTeam], pieceTeam);
    changedState[pieceTeam][pieceName].selected = !pieceSelected;

    return changedState;
}

function movedPieceState (state, {pieceId, coords}) {
    const {pieceTeam, pieceName} = getPieceInfo(pieceId);
    const changedState = createNewTeamInfo(state[pieceTeam], pieceTeam);
    changedState[pieceTeam][pieceName].position = coords;
    changedState[pieceTeam][pieceName].selected = false;

    return changedState;
}

export default function gameReducer (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_PIECE:
            return Object.assign({}, state,
                toggledPieceState(state, action.payload.pieceId)
            );
        case MOVE_PIECE:
            return Object.assign({}, state,
                movedPieceState(state, action.payload)
            );
        default:
            return state;
    }
}
