const Site = require('./site.class');

class Baidu_Com extends Site {
  url = 'https://www.baidu.com';
  nick = 'baidu.com';
  nextSelector = '#page > a.n';

  async doSearch(keyWord) {
    await this.page.type('#kw', keyWord);
    await this.page.waitFor(10000);
    await this.page.click('#su');
  }

  async logElements() {
    console.log(`Log Elements ${this.nick} Page ${this.pageIndex}`);
    
    const targetList = await this.page.$$eval('.c-container', elms => elms.map(elm => {
      console.log('Log Baidu.com Elements', elm);
      let log = {};
      log.innerText = elm.innerText;
      let link = elm.querySelector('h3.t a');
      log.title = link.textcontent;
      log.href = link.href;
      return log;
    }));

    console.log('Elements has been Logged', targetList);

    this.pageElements[this.pageIndex] = targetList;
  }
}

module.exports = Baidu_Com;