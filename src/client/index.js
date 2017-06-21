import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import GameContainer from 'containers/gameContainer';
import gameReducer from 'reducers/gameReducer';

const store = createStore(
    gameReducer, /* preloadedState, */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <GameContainer />
     </Provider>,
    document.querySelector('.app')
);
