const initBrowser = require('./initBrowser.js');

let browser;

global.beforeEach(async () => {
  browser = await initBrowser();
  global.page = await browser.newPage();
  await global.page.goto('http://localhost:8081');
});

global.afterEach(async () => {
  await browser.close();
});
