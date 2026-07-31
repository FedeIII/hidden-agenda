import { defineConfig } from 'vite';
import { aliases } from './aliases.mjs';

export default defineConfig({
	// Relative asset URLs, so one build works both under the GitHub Pages subpath
	// (fedeiii.github.io/hidden-agenda/) and at the root of hidden-agenda.azyr.io.
	base: './',

	resolve: { alias: aliases },

	server: {
		// The e2e suite drives http://localhost:8081; fail loudly rather than drift to
		// another port and leave the tests pointing at nothing.
		port: 8081,
		strictPort: true,
		// Mirrors what nginx does on the VPS: the page and the websocket share an origin, so
		// the client can always talk to /ws on its own host. Keeps dev, preview and production
		// the same shape.
		proxy: {
			'/ws': { target: 'ws://127.0.0.1:3007', ws: true },
			'/healthz': { target: 'http://127.0.0.1:3007' },
		},
	},

	preview: {
		port: 8081,
		strictPort: true,
		// Mirrors what nginx does on the VPS: the page and the websocket share an origin, so
		// the client can always talk to /ws on its own host. Keeps dev, preview and production
		// the same shape.
		proxy: {
			'/ws': { target: 'ws://127.0.0.1:3007', ws: true },
			'/healthz': { target: 'http://127.0.0.1:3007' },
		},
	},

	build: {
		// docs/ is what GitHub Pages serves and what nginx will serve on the VPS.
		// _config.yml and img/ live in public/ so emptyOutDir cannot eat them.
		outDir: 'docs',
		emptyOutDir: true,
		sourcemap: true,
	},
});
