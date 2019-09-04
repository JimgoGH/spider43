// const puppeteer = require('puppeteer');

const Browser = require('./browser.js').Browser;

const Baidu_Com = require("./sites/baidu.com.class");
const Tieba_Baidu = require("./sites/teiba.baidu.com.class");

const siteClass = [Baidu_Com,Tieba_Baidu];

(async () => {

  try {

    const browser = await Browser();

    for (const Cls of siteClass) {
      let page = new Cls(browser);

      try {
        await page.init();
        if(page.landFail) continue;
        
        await page.screenshot();
        // await page.pdf();

        await page.close();
      } catch(error) {
        console.error(error)
        continue;
      }
    }

    await browser.close();

    console.log('browser has been closed');

  } catch (err) {
    console.error(err);
  }

})();