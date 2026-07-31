import path from 'node:path';
import { defineConfig } from 'vite';

// Aliases are resolved from the package root, which is where npm scripts always run.
const fromRoot = target => path.resolve(process.cwd(), target);

export default defineConfig({
	// Relative asset URLs, so one build works both under the GitHub Pages subpath
	// (fedeiii.github.io/hidden-agenda/) and at the root of agenda.azyr.io.
	base: './',

	resolve: {
		alias: {
			Src: fromRoot('src'),
			Client: fromRoot('src/client'),
			Components: fromRoot('src/client/components'),
			Phases: fromRoot('src/client/phases'),
			State: fromRoot('src/client/state'),
			Hooks: fromRoot('src/client/hooks'),
			Domain: fromRoot('src/domain'),
			Game: fromRoot('src/game'),
		},
	},

	server: {
		// The e2e suite drives http://localhost:8081; fail loudly rather than drift to
		// another port and leave the tests pointing at nothing.
		port: 8081,
		strictPort: true,
	},

	preview: {
		port: 8081,
		strictPort: true,
	},

	build: {
		// docs/ is what GitHub Pages serves and what nginx will serve on the VPS.
		// _config.yml and img/ live in public/ so emptyOutDir cannot eat them.
		outDir: 'docs',
		emptyOutDir: true,
		sourcemap: true,
	},
});
