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
}

module.exports = Site;