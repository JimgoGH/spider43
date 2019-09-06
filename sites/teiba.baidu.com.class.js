const Site = require('./site.class');

class Tieba_Baidu extends Site {
  url = 'https://tieba.baidu.com/index.html';
  nick = 'tieba.baidu.com';
  nextSelector = 'div.pager.pager-search > a.next';

  async doSearch() {
    await this.page.type('#wd1','四航三公司');
    await this.page.click('.search_btn.j_search_post');
  }
  
}

module.exports = Tieba_Baidu;