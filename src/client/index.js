import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import Game from './game';
import gameReducer from 'client/reducers';
import {togglePiece, movePiece} from 'client/actions';

const store = createStore(gameReducer);

ReactDOM.render(
    <Provider store={store}>
        <Game />
     </Provider>,
    document.querySelector('.app')
);

console.log('TESTS');
let state = store.getState();
console.assert(state.team0.agent1.position === null);
console.assert(!state.team0.agent1.selected);
console.assert(state.team1.agent1.position === null);
console.assert(!state.team1.agent1.selected);

store.dispatch(movePiece('0-A1', [3, 3]));
state = store.getState();
console.assert(state.team0.agent1.position[0] === 3);
console.assert(state.team0.agent1.position[1] === 3);

store.dispatch(movePiece('1-A1', [0, 0]));
state = store.getState();
console.assert(state.team1.agent1.position[0] === 0);
console.assert(state.team1.agent1.position[1] === 0);

store.dispatch(togglePiece('0-A1'));
state = store.getState();
console.assert(state.team0.agent1.selected);

store.dispatch(togglePiece('0-A1'));
state = store.getState();
console.assert(!state.team0.agent1.selected);
