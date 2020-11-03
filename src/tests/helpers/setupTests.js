const initBrowser = require('./initBrowser.js');

let browser;

global.beforeEach(async () => {
  jest.setTimeout(10000);

  browser = await initBrowser();
  global.page = await browser.newPage();
  await page.goto('http://localhost:8081');
});

global.afterEach(async () => {
  await page.screenshot({ path: 'test.png' });
  await browser.close();
});
