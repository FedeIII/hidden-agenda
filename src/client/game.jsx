// import {connect} from 'react-redux';
// import Game from 'components/game';
// import {startGame} from 'client/actions';

// function mapStateToProps ({phase, players}) {
//     return {
//         phase,
//         players
//     };
// }

// function mapDispatchToProps (dispatch) {
//     return {
//         onStart: players => dispatch(startGame(players))
//     };
// }

// const GameContainer = connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Game);

// export default GameContainer;

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import StartPhase from 'components/startPhase';
// import PlayPhaseContainer from 'containers/playPhaseContainer';

export default () => (
  <Router>
    <Route exact path="/" component={StartPhase} />
    {/* <Route component={PlayPhaseContainer} path="/play" /> */}
  </Router>
);
