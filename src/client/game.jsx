import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GlobalStyle from './globalStyle';
import { withState } from 'State';
import StartPhase from 'Phases/startPhase';
import AlignmentPhase from 'Phases/alignmentPhase';
import PlayPhase from 'Phases/playPhase';
import EndPhase from 'Phases/endPhase';

export default withState(() => (
  <>
    <GlobalStyle />
    <Router>
      <Route exact path="/" component={StartPhase} />
      <Route exact path="/alignment" component={AlignmentPhase} />
      <Route exact path="/play" component={PlayPhase} />
      <Route exact path="/end" component={EndPhase} />
    </Router>
  </>
));
