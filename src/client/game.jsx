import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GlobalStyle from './globalStyle';
import { withState } from 'State';
import StartPhase from 'Phases/startPhase';
import PlayPhase from 'Phases/playPhase';
import EndPhase from 'Phases/endPhase';

export default withState(() => (
  <>
    <GlobalStyle />
    <Router>
      <Route exact path="/" component={StartPhase} />
      <Route exact path="/play" component={PlayPhase} />
      <Route exact path="/end" component={EndPhase} />
    </Router>
  </>
));
