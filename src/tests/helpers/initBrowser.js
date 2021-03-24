const puppeteer = require('puppeteer');

module.exports = async function initBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--window-size=800,600'],
		executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  
  return browser;
}