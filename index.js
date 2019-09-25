// const puppeteer = require('puppeteer');

const Browser = require('./browser.js').Browser;
const refreshJsons = require('./directory.js').refreshJsons;

const Baidu_Com = require("./sites/baidu.com.class");
const Tieba_Baidu = require("./sites/teiba.baidu.com.class");
const Sogou_Com = require("./sites/sogou.com.class");
const Weixin_Sogou = require("./sites/weixin.sogou.com.class");
const CONSTS = require('./consts.js');

const siteClass = [Weixin_Sogou];

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
              // waite next button before log
              await page.findNext();
              // log page elements
              await page.logElements();
              if (!page.hasNext) break;
              // goto next page
              await page.nextPage();
              // await page.screenshot();
              // Error: Protocol error (IO.read)
              // await page.pdf();
            } catch (error) {
              console.error('error in Next Page loop', error);
              continue;
            }
          }

          // await page.saveJson();
          await page.savePageJsons();

        }

        await page.close();
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    await browser.close();

    console.log('browser has been closed');

    refreshJsons();

    console.log('Directory has already refreshed.');

  } catch (err) {
    console.error(err);
  }

})();