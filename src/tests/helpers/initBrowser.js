const puppeteer = require('puppeteer');

module.exports = async function initBrowser() {
  const browser = await puppeteer.launch({
		executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  
  return browser;
}