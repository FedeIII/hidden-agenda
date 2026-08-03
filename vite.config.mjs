import { defineConfig } from 'vite';
import { aliases } from './aliases.mjs';
import { CLIENT_PORT, SERVER_PORT } from './ports.mjs';

// Mirrors what nginx does on the VPS: the page and the websocket share an origin, so the client can
// always talk to /ws on its own host. Keeps dev, preview and production the same shape.
const proxy = {
	'/ws': { target: `ws://127.0.0.1:${SERVER_PORT}`, ws: true },
	'/healthz': { target: `http://127.0.0.1:${SERVER_PORT}` },
};

export default defineConfig({
	// Relative asset URLs, so one build works both under the GitHub Pages subpath
	// (fedeiii.github.io/hidden-agenda/) and at the root of hidden-agenda.azyr.io.
	base: './',

	resolve: { alias: aliases },

	server: {
		// The e2e suite drives this port too — playwright.config.mjs reads the same module, so the
		// two cannot drift. Fail loudly rather than pick another one and leave the tests pointing
		// at nothing.
		port: CLIENT_PORT,
		strictPort: true,
		proxy,
	},

	preview: {
		port: CLIENT_PORT,
		strictPort: true,
		proxy,
	},

	build: {
		// docs/ is what GitHub Pages serves and what nginx will serve on the VPS.
		// _config.yml and img/ live in public/ so emptyOutDir cannot eat them.
		outDir: 'docs',
		emptyOutDir: true,
		sourcemap: true,
	},
});
