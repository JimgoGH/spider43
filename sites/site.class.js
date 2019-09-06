const fs = require('fs');
const userAgent = require('../consts.js').CHROME_USER_AGENT;

const DAY_LONG = 24 * 3600 * 1000;

class Site {
  url = '';
  nick = '';
  landFail = false;
  pageIndex = 0;
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
    await this.page.screenshot({ 'path': `${this.pngPath}/${new Date().toLocaleTimeString().replace(/:/g, '_')}.png`, 'fullPage': true });
  }

  async pdf() {
    console.log('Down Pdf', this.url);
    if (!this.pdfPath) {
      this.pdfPath = await this.initPath('pdfs');
    }
    await this.page.pdf({ 'path': `${this.pdfPath}/${new Date().toLocaleTimeString().replace(/:/g, '_')}.pdf`, 'format': 'A4' });
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

  async doSearch() { }
  async timeDesc() { }

  async findNext() {
    // await this.page.waitForNavigation({'waitUntil':'networkidle2'});
    // await this.page.waitForSelector(this.nextSelector,{'waitUntil':'networkidle2'});
    const nextBtn = await this.page.$(this.nextSelector);
    this.hasNext = !!nextBtn;
    if (!this.hasNext) console.log(`${this.nick} Page End`);
  }

  async nextPage() {
    await this.page.click(this.nextSelector);
    this.pageIndex++;
    console.log(`${this.nick} Page : ${this.pageIndex}`);
  }

  async logElements() { }

  async saveHtml() { }
}

module.exports = Site;