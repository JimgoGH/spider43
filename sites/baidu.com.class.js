const Site = require('./site.class');

class Baidu_Com extends Site {
  url = 'https://www.baidu.com';
  nick = 'baidu.com';

  async doSearch() {
    await this.page.type('#kw','四航三公司');
    await this.page.click('#su');
  }

  async hasNext() {
    // await this.page.waitForNavigation({'waitUntil':'networkidle2'});
    // await this.page.waitForSelector({'waitUntil':'networkidle2'});
    const nextBtn = this.page.$('#page > a.n');
    return !!nextBtn;
    
  }

  async nextPage() {
    await this.page.click('#page > a.n');
    this.pageIndex++;
  }

  async logElements() {
    this.pageElements[this.pageIndex] = [];
    const targetList =  await this.page.$$('.c-container');
    for (let i = 0; i < targetList.length; i++) {
      let elm = targetList[i], log = {};
      log.innerText = await elm.getProperty('innerText');
      await elm.$eval('h3.t > a', link => {
        log.title = link.textcontent;
        log.href = link.href;
      });
      this.pageElements[this.pageIndex].push(log);
    }

    console.log('Elements has been Logged', this.pageElements[this.pageIndex]);
  }
}

module.exports = Baidu_Com;