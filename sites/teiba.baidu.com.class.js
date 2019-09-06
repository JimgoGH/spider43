const Site = require('./site.class');

class Tieba_Baidu extends Site {
  url = 'https://tieba.baidu.com/index.html';
  nick = 'tieba.baidu.com';

  async doSearch() {
    await this.page.type('#wd1','四航三公司');
    await this.page.click('.search_btn.j_search_post');
  }

  async hasNext() {
    const nextBtn = this.page.$('div.pager.pager-search > a.next');
    return !!nextBtn;
  }

  async nextPage() {
    await this.page.click('div.pager.pager-search > a.next');
    await this.page.waitForNavigation({'waitUntil':'networkidle2'})
    
    this.pageIndex++;
  }

  
}

module.exports = Tieba_Baidu;