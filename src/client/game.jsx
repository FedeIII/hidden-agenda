import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import GlobalStyle from './globalStyle';
import { withState } from 'State';
import StartPhase from 'Phases/startPhase';
import AlignmentPhase from 'Phases/alignmentPhase';
import PlayPhase from 'Phases/playPhase';
import EndPhase from 'Phases/endPhase';

export default withState(() => (
  <DndProvider backend={HTML5Backend}>
    <GlobalStyle />
    <Router>
      <Route exact path="/" component={StartPhase} />
      <Route exact path="/alignment" component={AlignmentPhase} />
      <Route exact path="/play" component={PlayPhase} />
      <Route exact path="/end" component={EndPhase} />
    </Router>
  </DndProvider>
));
