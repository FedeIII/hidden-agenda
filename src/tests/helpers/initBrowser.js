const puppeteer = require('puppeteer-core');

// puppeteer-core rather than puppeteer: the full package downloads its own Chromium on
// install, which this suite then ignored anyway because it always pointed executablePath at
// the system Chrome. On Apple Silicon that download was not even the right architecture.
//
// defaultViewport MUST be explicit. With `null` the viewport is the OS window minus the
// browser's UI chrome, whose height changes between Chrome releases — and the HQ lays its
// pieces out with percentage offsets, so a shorter viewport makes them overlap and a click
// on one piece lands on another. That silently broke agent.test.js on Chrome 151.
module.exports = async function initBrowser() {
	return puppeteer.launch({
		headless: true,
		defaultViewport: { width: 800, height: 600 },
		args: ['--window-size=800,600'],
		...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }),
	});
};
