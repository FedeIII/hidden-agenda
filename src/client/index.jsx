import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Game from './game';

// StrictMode double-invokes reducers and effects in development. That is deliberate: it is a
// standing check that the piece reducers stay pure, since a reducer that mutates its input
// applies every toggle twice under it. It is inert in the production build the specs run against.
createRoot(document.querySelector('.game')).render(
	<StrictMode>
		<Game />
	</StrictMode>,
);
