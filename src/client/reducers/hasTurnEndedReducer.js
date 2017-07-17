import {START_GAME, NEXT_TURN, TOGGLE_PIECE} from 'client/actions';
import {AGENT, CEO, SPY} from 'shared/pieceTypes';
import {MOVEMENT, MOVEMENT2, PLACEMENT} from 'client/pieceStates';
import piecesHelper from 'shared/pieces';

function hasPieceEndedTurn (pieces, pieceState) {
    const selectedPiece = piecesHelper.getSelectedPiece(pieces);

    if (selectedPiece) {
        switch (piecesHelper.getType(selectedPiece.id)) {
            case AGENT:
                return pieceState === PLACEMENT || pieceState === MOVEMENT;
            case CEO:
                return pieceState === PLACEMENT || pieceState === MOVEMENT;
            case SPY:
                return pieceState === PLACEMENT || pieceState === MOVEMENT2;
            default:
                return false;
        }
    }
}

function isPieceBeingDropped ({hasTurnEnded, pieces, pieceState}) {
    return hasTurnEnded || hasPieceEndedTurn(pieces, pieceState);
}

export default function hasTurnEndedReducer (state, action) {
    switch (action.type) {
        case NEXT_TURN:
            return false;
        case START_GAME:
            return false;
        case TOGGLE_PIECE:
            return isPieceBeingDropped(state);
        default:
            return state.hasTurnEnded;
    }
}
