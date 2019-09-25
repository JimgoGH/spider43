const Site = require('./site.class');

class Tieba_Baidu extends Site {
  url = 'https://tieba.baidu.com/index.html';
  nick = 'tieba.baidu.com';
  nextSelector = 'div.pager-search > a.next';
  searchUrl = 'http://tieba.baidu.com/f/search/res?isnew=1&qw=##KEYWORD##&sm=1'

  async doSearch(keyWord) {
    return await this.directSearch(keyWord);
  }

  async logElements() {
    console.log(`Log Elements ${this.nick} Page ${this.pageIndex}`);

    const items = await this.page.$$eval('.s_post', elms => elms.map(elm => {
      console.log('Log tieba.Baidu.com Elements', elm);
      let log = {};
      let content = elm.querySelector('.p_content');
      log.innerText = content.innerText;
      let link = elm.querySelector('.p_title a');
      log.href = link.href;
      log.title = link.text;
      return log;
    }));

    // log page image
    const img = await this.screenshot();

    this.pageElements[this.pageIndex] = { items, img };
  }

}

module.exports = Tieba_Baidu;