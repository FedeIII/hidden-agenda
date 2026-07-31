import { defineConfig } from '@playwright/test';

const PORT = 8081;

export default defineConfig({
	fullyParallel: true,
	reporter: [['list']],

	// Starts the preview server and waits for it. The suite used to fail wholesale if you
	// forgot to start a server first.
	webServer: {
		command: 'npm run serve',
		url: `http://localhost:${PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},

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
