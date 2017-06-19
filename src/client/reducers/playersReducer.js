import {START_GAME} from 'client/actions';

export default function playersReducer (state, action) {
    switch (action.type) {
        case START_GAME:
            return [].concat(action.payload);
        default:
            return [].concat(state.players);
    }
}
