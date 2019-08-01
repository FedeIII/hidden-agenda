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

import GlobalStyle from './globalStyle';
import StartPhase from 'Phases/startPhase';
import withState from './state/withState';
// import PlayPhaseContainer from 'containers/playPhaseContainer';

export default withState(() => (
  <>
    <GlobalStyle />
    <Router>
      <Route exact path="/" component={StartPhase} />
      <Route exact path="/play" component={() => {}} />
      {/* <Route component={PlayPhaseContainer} path="/play" /> */}
    </Router>
  </>
));
