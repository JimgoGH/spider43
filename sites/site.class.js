const fs = require('fs');
const userAgent = require('../consts.js').CHROME_USER_AGENT;

const DAY_LONG = 24 * 3600 * 1000;
const KEYWORD_REGEXP = /##KEYWORD##/;
const NEXT_GAP = 1000;

class Site {
  url = '';
  searchUrl = '';
  nick = '';
  landFail = false;
  pageIndex = 1;
  pageElements = [];
  hasNext = false;

  constructor(browser) {
    this.browser = browser;
    // For Date Log and Set Path;
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
  }

  async init() {
    console.log('new Page');
    this.page = await this.browser.newPage();
    await this.page.emulateMedia('screen');
    await this.page.setViewport({ width: 1024, height: 880 });
    await this.page.setUserAgent(userAgent);

    this.page.on('requestfailed', request => {
      console.log('requesing ' + request.url().substr(0, 50) + ' failed');
      // console.dir(request.headers());
    })
  }

  async initPath(root) {
    if (Date.now() - this.today.getTime() >= DAY_LONG) {
      this.today = new Date();
      this.today.setHours(0, 0, 0, 0);
    }
    let path = `${root}/${this.today.toLocaleDateString()}/${this.nick}`;
    try {
      fs.accessSync(path, fs.constants.W_OK);
    } catch (error) {
      console.log('mkdir: ' + path);
      fs.mkdirSync(path, { recursive: true });
    }
    return path;
  }

  async screenshot() {
    console.log('Screen Shot', this.url);
    if (!this.pngPath) {
      this.pngPath = await this.initPath('pngs');
    }

    const p0 = `${this.pngPath}/${new Date().toLocaleTimeString().replace(/:/g, '_')}.png`;
    await this.page.screenshot({ 'path': p0, 'fullPage': true });
    return p0;
  }

  async pdf() {
    console.log('Down Pdf', this.url);
    if (!this.pdfPath) {
      this.pdfPath = await this.initPath('pdfs');
    }

    const p0 = `${this.pdfPath}/${new Date().toLocaleTimeString().replace(/:/g, '_')}.pdf`;
    await this.page.pdf({ 'path': p0, 'format': 'A4' });
    return p0;
  }

  async close() {
    return await this.page.close();
  }

  async gotoIndex() {
    try {
      console.log('goto ' + this.url);
      await this.page.goto(this.url, { waitUntil: "networkidle2" });
    } catch (err) {
      console.error(err);
      this.landFail = true;
    }
  }

  async directSearch(keyWord) {
    try {
      console.log('search By goto ' + this.searchUrl + '; ##KEYWORD## :' + keyWord);
      await this.page.goto(this.searchUrl.replace(KEYWORD_REGEXP, keyWord), { waitUntil: "networkidle2" });
    } catch (err) {
      console.error(err);
    }
  }

  async doSearch() { }
  async timeDesc() { }

  async findNext() {
    // await this.page.waitForNavigation({'waitUntil':'networkidle2'});
    // const nextBtn = await this.page.$(this.nextSelector);
    try {
      const nextBtn = await this.page.waitForSelector(this.nextSelector, { 'timeout': NEXT_GAP });
      this.hasNext = !!nextBtn;
    } catch (error) {
      this.hasNext = false;
    }

    if (!this.hasNext) console.log(`${this.nick} Page End`);
  }

  async nextPage() {
    await this.page.click(this.nextSelector);
    this.pageIndex++;
    console.log(`${this.nick} Page : ${this.pageIndex}`);
  }

  // log page imformations
  async logElements() { }

  async saveHtml() {
    console.log('Save htmls', this.url);
    if (!this.htmlPath) {
      this.htmlPath = await this.initPath('htmls');
    }

    const p0 = `${this.htmlPath}/${new Date().toLocaleTimeString().replace(/:/g, '_')}.html`;

    const ws = fs.createWriteStream(p0, { encoding: 'utf8' });

    ws.on('error', err => console.error(err.stack));

    // 使用 utf8 编码写入数据
    ws.write('data');

    // 标记文件末尾
    ws.end();

    return p0;
  }

  // @Deprecated
  async saveJson() {
    console.log('Save Jsons', this.url);
    if (!this.jsonPath) {
      this.jsonPath = await this.initPath('jsons');
    }

    const p0 = `${this.jsonPath}/${new Date().toLocaleTimeString().replace(/:/g, '_')}.json`;

    const ws = fs.createWriteStream(p0, { encoding: 'utf8' });

    ws.on('error', err => console.error(err.stack));

    // 使用 utf8 编码写入数据
    ws.write(JSON.stringify(this.pageElements));

    // 标记文件末尾
    ws.end();

    return p0;
  }

  /**
   * NOTICE: It will ReWrite All jsons, not Append
   */
  async savePageJsons() {
    console.log('Save Jsons', this.url);
    if (!this.jsonPath) {
      this.jsonPath = await this.initPath('jsons');
    }

    let ws;

    this.pageElements.forEach((elm, idx) => {

      if (!elm) return null;

      ws = fs.createWriteStream(`${this.jsonPath}/${idx}.json`, { flags: 'w', encoding: 'utf8' });

      ws.on('error', err => console.error(err.stack));

      // 使用 utf8 编码写入数据
      ws.write(JSON.stringify(elm));

      // 标记文件末尾
      ws.end();
    });

  }
}

module.exports = Site;