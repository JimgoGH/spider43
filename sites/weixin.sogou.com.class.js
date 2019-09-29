const Site = require('./site.class');

class Weixin_Sogou extends Site {
  url = 'https://weixin.sogou.com';
  nick = 'weixin.sogou.com';
  nextSelector = '#pagebar_container > a#sogou_next';
  searchUrl = 'https://weixin.sogou.com/weixin?type=2&query=##KEYWORD##&ie=utf8&s_from=input'

  async doSearch(keyWord) {
    await this.directSearch(keyWord);
    await this.page.click('#tool_show > a:nth-child(1)');
    await this.page.waitFor(1000);
    await this.page.click('a#time');
    await this.page.waitFor(1000);
    await this.page.click('div.time-box.float a.time-range:nth-child(4)');
  }

  async logElements() {
    console.log(`Log Elements ${this.nick} Page ${this.pageIndex}`);

    const items = await this.page.$$eval('ul.news-list > li > div.txt-box', elms => elms.map(elm => {

      console.log('Log weixin.sougo.com Elements', elm);
      let log = {};
      let content = elm.querySelector('p.txt-info');
      log.innerText = content.innerText;
      let link = elm.querySelector('h3 a');
      log.href = link.href;
      log.title = link.text;
      return log;

    }));

    // log page image
    const img = await this.screenshot();

    this.pageElements[this.pageIndex] = { items, img };
  }

}

module.exports = Weixin_Sogou;