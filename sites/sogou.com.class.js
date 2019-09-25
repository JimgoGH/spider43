const Site = require('./site.class');

class Sogou_com extends Site {
  url = 'https://www.sogou.com';
  nick = 'sogou.com';
  nextSelector = '#pagebar_container > a#sogou_next';
  searchUrl = 'https://www.sogou.com/web?query=##KEYWORD##&sourceid=inttime_week&tsn=2'

  async doSearch(keyWord) {
    return await this.directSearch(keyWord);
  }

  async logElements() {
    console.log(`Log Elements ${this.nick} Page ${this.pageIndex}`);

    const items = await this.page.$$eval('div.results > div.rb', elms => elms.map(elm => {

      console.log('Log www.sougo.com Elements', elm);
      let log = {};
      let content = elm.querySelector('div.ft');
      log.innerText = content.innerText;
      let link = elm.querySelector('h3.pt a');
      log.href = link.href;
      log.title = link.text;
      return log;

    }));

    // log page image
    const img = await this.screenshot();

    this.pageElements[this.pageIndex] = { items, img };
  }

}

module.exports = Sogou_com;