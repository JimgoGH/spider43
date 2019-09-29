const Site = require('./site.class');

class Toutiao_com extends Site {
  url = 'https://www.toutiao.com';
  nick = 'toutiao.com';
  nextSelector = '#none_next_page'; // no next page selector
  searchUrl = 'https://www.toutiao.com/search/?keyword=##KEYWORD##'

  async doSearch(keyWord) {
    // It'll block if goto search url directly
    await this.gotoIndex();

    await this.directSearch(keyWord);

    // scroll page for more info
    await this.page.evaluate(async () => {
      const waiteFor = time => new Promise(rsl => setTimeout(() => rsl(), time));

      let curH = 0;

      while (curH < document.body.offsetHeight) {
        curH = document.body.offsetHeight;
        window.scrollTo(0,curH);
        await waiteFor(3000);
      }

      console.log('End Scrolling');
    });
  }

  async logElements() {
    console.log(`Log Elements ${this.nick} Page ${this.pageIndex}`);

    const items = await this.page.$$eval('div.sections  div.articleCard', elms => elms.map(elm => {

      console.log('Log www.zhihu.com Elements', elm);
      let log = {};
      // let content = elm.querySelector('div.RichContent-inner');
      // log.innerText = content.innerText;
      let link = elm.querySelector('div.title-box a.link.title');
      log.href = link.href;
      log.title = link.text;
      return log;
    }));

    // log page image
    const img = await this.screenshot();

    this.pageElements[this.pageIndex] = { items, img };
  }

}

module.exports = Toutiao_com;