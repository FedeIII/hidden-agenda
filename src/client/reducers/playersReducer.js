import {START_GAME} from 'client/actions';

export default function playersReducer (state, action) {
    switch (action.type) {
        case START_GAME:
            return Object.assign({}, action.payload);
        default:
            return Object.assign({}, state.players);
    }
}
