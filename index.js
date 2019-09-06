// const puppeteer = require('puppeteer');

const Browser = require('./browser.js').Browser;

const Baidu_Com = require("./sites/baidu.com.class");
const Tieba_Baidu = require("./sites/teiba.baidu.com.class");
const CONSTS = require('./consts.js');

const siteClass = [Baidu_Com, Tieba_Baidu];

(async () => {

  try {

    const browser = await Browser();

    for (const Cls of siteClass) {
      let page = new Cls(browser);

      try {
        await page.init();

        for (const kw of CONSTS.KEY_WORDS) {
          await page.gotoIndex();
          if (page.landFail) continue;

          await page.doSearch(kw);

          for (let i = 0; i < CONSTS.MAX_PAGES; i++) {
            try {
              await page.findNext();
              if (!page.hasNext) break;
              await page.nextPage();
              await page.logElements();
              // await page.screenshot();
              // Error: Protocol error (IO.read)
              // await page.pdf();
            } catch (error) {
              console.error('error in Next Page loop', error);
              continue;
            }
          }

        }

        await page.close();
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    await browser.close();

    console.log('browser has been closed');

  } catch (err) {
    console.error(err);
  }

})();