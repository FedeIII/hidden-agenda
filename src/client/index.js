import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import GameContainer from 'containers/gameContainer';
import gameReducer from 'reducers/gameReducer';

const store = createStore(gameReducer);

ReactDOM.render(
    <Provider store={store}>
        <GameContainer />
     </Provider>,
    document.querySelector('.app')
);
