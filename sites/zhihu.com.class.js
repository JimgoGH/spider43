const Site = require('./site.class');

class Zhihu_com extends Site {
  url = 'https://www.zhihu.com';
  nick = 'zhihu.com';
  nextSelector = '#none_next_page'; // no next page selector
  searchUrl = 'https://www.zhihu.com/search?q=##KEYWORD##&type=content&range=1w'

  async doSearch(keyWord) {
    return await this.directSearch(keyWord);
  }

  async logElements() {
    console.log(`Log Elements ${this.nick} Page ${this.pageIndex}`);

    const items = await this.page.$$eval('div.List  div.SearchResult-Card', elms => elms.map(elm => {

      console.log('Log www.zhihu.com Elements', elm);
      let log = {};
      let content = elm.querySelector('div.RichContent-inner');
      log.innerText = content.innerText;
      let link = elm.querySelector('.ContentItem-title a');
      log.href = link.href;
      log.title = link.text;
      return log;

    }));

    // log page image
    const img = await this.screenshot();

    this.pageElements[this.pageIndex] = { items, img };
  }

}

module.exports = Zhihu_com;