const Site = require('./site.class');

class Baidu_Com extends Site {
  url = 'https://www.baidu.com';
  nick = 'baidu.com';
  nextSelector = '#page > a.n:last-child';
  searchUrl = 'https://www.baidu.com/s?ie=utf-8&wd=##KEYWORD##&gpc=stf%3D1568690738%2C1569295538|stftype%3D1'

  async doSearch(keyWord) {
    // await this.page.type('#kw', keyWord);
    // await this.page.waitFor(3000);
    // await this.page.click('#su');
    return await this.directSearch(keyWord);
  }

  async logElements() {
    console.log(`Log Elements ${this.nick} Page ${this.pageIndex}`);

    const items = await this.page.$$eval('.c-container', elms => elms.map(elm => {
      console.log('Log Baidu.com Elements', elm);
      let log = {};
      log.innerText = elm.innerText;
      let link = elm.querySelector('h3.t a');
      log.href = link.href;
      log.title = link.text;
      return log;
    }));

    // console.log('Elements has been Logged', items);

    // log page image
    const img = await this.screenshot();

    this.pageElements[this.pageIndex] = { items, img };
  }
}

module.exports = Baidu_Com;