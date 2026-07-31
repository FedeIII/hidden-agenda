import { defineConfig } from 'vite';
import { aliases } from './aliases.mjs';

// Bundles the multiplayer server for node. The point is that the server shares src/game and
// src/domain with the browser build, and those modules import each other through aliases — so
// the server has to be resolved by something that knows the alias map. Bundling also means the
// VPS installs only `ws`: no devDependencies, no babel step on two vCPUs.
export default defineConfig({
	resolve: { alias: aliases },

	// Without this the server bundle gets a copy of public/ — the Pages theme and all 116 piece
	// images — which a websocket server has no use for.
	publicDir: false,

	build: {
		ssr: 'server/main.js',
		outDir: 'dist-server',
		emptyOutDir: true,
		// The VPS runs node 18.19, not 22 — it only ever *runs* this bundle, it never builds it,
		// so the toolchain's node 22 requirement (`engines`) does not apply there. Every API the
		// server uses predates 18 (randomUUID is 16.7+), so only the syntax target had to move.
		// Raise this if the box is ever upgraded; do not raise it speculatively.
		target: 'node18',
		// Readable stack traces matter more than bytes for a process nobody downloads.
		minify: false,
		sourcemap: true,
		rollupOptions: {
			// Kept as a real runtime dependency rather than inlined; node builtins are external
			// automatically in an ssr build.
			external: ['ws'],
		},
	},
});
