import {SNIPE, NEXT_TURN} from 'client/actions';

export default function isSnipingReducer (state, action) {
    switch (action.type) {
        case SNIPE:
            return true;
        case NEXT_TURN:
            return false;
        default:
            return state.isSniping;
    }
}
