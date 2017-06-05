import {SET_MOUSE} from 'client/actions';

export default function mousePositionReducer ({followMouse}, action) {
    switch (action.type) {
        case SET_MOUSE:
            return action.payload.position;
        default:
            return null;
    }
}
