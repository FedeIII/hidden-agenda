const puppeteer = require('puppeteer');

// defaultViewport MUST be explicit. With `null` the viewport is the OS window minus the
// browser's UI chrome, whose height changes between Chrome releases — and the HQ lays its
// pieces out with percentage offsets, so a shorter viewport makes them overlap and a click
// on one piece lands on another. That silently broke agent.test.js on Chrome 151.
module.exports = async function initBrowser() {
	return puppeteer.launch({
		headless: true,
		defaultViewport: { width: 800, height: 600 },
		args: ['--window-size=800,600'],
		executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	});
};
