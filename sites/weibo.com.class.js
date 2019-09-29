const Site = require('./site.class');

class Weibo_com extends Site {
  url = 'https://www.weibo.com';
  nick = 'weibo.com';
  nextSelector = '#none_next_page'; // no next page selector
  searchUrl = 'https://s.weibo.com/weibo/##KEYWORD##'

  async doSearch(keyWord) {
    return await this.directSearch(keyWord);
  }

  async logElements() {
    console.log(`Log Elements ${this.nick} Page ${this.pageIndex}`);

    const items = await this.page.$$eval('div.m-con-l div.content', elms => elms.map(elm => ({
      'innerText': elm.innerText
    })));

    // log page image
    const img = await this.screenshot();

    this.pageElements[this.pageIndex] = { items, img };
  }

}

module.exports = Weibo_com;