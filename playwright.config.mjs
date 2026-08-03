import { defineConfig } from '@playwright/test';
import { CLIENT_PORT, SERVER_PORT } from './ports.mjs';

// Both ports come from ports.mjs, the same module vite reads — the suite drives vite's preview
// server through its /ws proxy, so a number that differs anywhere is a suite that tests a client
// wired to nothing.
const PORT = CLIENT_PORT;

export default defineConfig({
	fullyParallel: true,
	reporter: [['list']],

	// Starts both servers and waits for them. The suite used to fail wholesale if you forgot to
	// start one by hand. The game server comes first because preview proxies /ws to it.
	webServer: [
		{
			// Built here rather than assumed: the suite runs the bundle, not the source, so testing
			// against a stale dist-server is silently possible otherwise — and it cost real time.
			command: 'npm run build:server && node dist-server/main.mjs',
			// The join limit is per address and every online spec joins from this one, so it caps
			// how many of them there can be. Raised here rather than lowered in the server.
			//
			// HA_SKIN pins the look of every room the server makes. Without it a room would draw one
			// of three at random and the online specs would be asserting against a different skin on
			// every run — the same reason the fixtures pin `?skin=` for the local ones.
			env: {
				PORT: String(SERVER_PORT),
				HA_STATE_DIR: '.playwright-rooms',
				HA_JOINS_PER_MINUTE: '60',
				HA_SKIN: 'dossier',
			},
			url: `http://127.0.0.1:${SERVER_PORT}/healthz`,
			reuseExistingServer: !process.env.CI,
			timeout: 30_000,
		},
		{
			command: 'npm run serve',
			url: `http://localhost:${PORT}`,
			reuseExistingServer: !process.env.CI,
			timeout: 60_000,
		},
	],

	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
		video: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},

	projects: [
		{
			// Pure domain specs. They never request a page fixture, so no browser is launched
			// and they finish in a couple of seconds.
			name: 'domain',
			testDir: 'src/tests/unit',
		},
		{
			name: 'e2e',
			testDir: 'src/tests',
			testIgnore: '**/unit/**',
			use: {
				// The HQ positions its pieces with percentage offsets, so viewport size decides
				// whether they overlap and which one a click lands on. It must be pinned.
				viewport: { width: 800, height: 600 },
			},
		},
	],
});
