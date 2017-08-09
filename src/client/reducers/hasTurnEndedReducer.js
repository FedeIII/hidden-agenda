import {START_GAME, NEXT_TURN, TOGGLE_PIECE, MOVE_PIECE} from 'client/actions';
import {AGENT, CEO, SPY, SNIPER} from 'shared/pieceTypes';
import {MOVEMENT, MOVEMENT2, PLACEMENT, SELECTION} from 'client/pieceStates';
import pz from 'shared/pz';
import cells from 'shared/cells';
import {areCoordsInList} from 'shared/utils';

function hasPieceEndedTurn (pieces, pieceState) {
    const selectedPiece = pz.getSelectedPiece(pieces);

    if (selectedPiece) {
        switch (pz.getType(selectedPiece.id)) {
            case AGENT:
                return pieceState === PLACEMENT || pieceState === MOVEMENT;
            case CEO:
                return pieceState === PLACEMENT || pieceState === MOVEMENT;
            case SPY:
                return pieceState === PLACEMENT || pieceState === MOVEMENT2;
            case SNIPER:
                return pieceState === PLACEMENT || pieceState === SELECTION;
            default:
                return false;
        }
    }
}

function isPieceBeingDropped ({hasTurnEnded, pieces, pieceState}) {
    return hasTurnEnded || hasPieceEndedTurn(pieces, pieceState);
}

function isPieceSniped ({pieces}, {pieceId, coords}) {
    return pz.isPieceThroughSniperLine(
        pz.getPieceById(pieceId, pieces),
        coords,
        pieces
    );
}

export default function hasTurnEndedReducer (state, action) {
    switch (action.type) {
        case NEXT_TURN:
            return false;
        case START_GAME:
            return false;
        case TOGGLE_PIECE:
            return isPieceBeingDropped(state);
        case MOVE_PIECE:
            return isPieceSniped(state, action.payload);
        default:
            return state.hasTurnEnded;
    }
}
