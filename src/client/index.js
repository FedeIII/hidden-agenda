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
