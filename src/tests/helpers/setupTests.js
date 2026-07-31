const initBrowser = require('./initBrowser.js');

const BASE_URL = process.env.HA_TEST_URL || 'http://localhost:8081';

let browser;

jest.setTimeout(30000);

// One browser per test file, a fresh page per test. Launching a browser per test cost ~1s
// each across 81 tests; the page is still new every time, so isolation is unchanged.
global.beforeAll(async () => {
	browser = await initBrowser();
});

global.beforeEach(async () => {
	global.page = await browser.newPage();
	global.pageErrors = [];
	page.on('pageerror', error => global.pageErrors.push(error));
	await page.goto(BASE_URL);
	await page.addStyleTag({ content: '.piece-styled {transition: none !important;}' });
});

// Any uncaught exception in the app fails the test that provoked it. The suite was fully green
// while clicking an empty cell threw a TypeError, because nothing was watching for this.
global.afterEach(async () => {
	await page.screenshot({ path: 'test.png' });
	const errors = global.pageErrors;
	await page.close();

	if (errors.length) {
		throw new Error(`uncaught page error(s):\n  ${errors.map(error => error.message).join('\n  ')}`);
	}
});

global.afterAll(async () => {
	if (browser) {
		await browser.close();
	}
});
