import {START_GAME} from 'client/actions';

export default function phaseReducer (state, action) {
    switch (action.type) {
        case START_GAME:
            return 'play';
        default:
            return state.phase;
    }
}
