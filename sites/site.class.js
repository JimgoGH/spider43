const fs = require('fs');
const userAgent = require('../consts.js').CHROME_USER_AGENT;

const DAY_LONG = 24 * 3600 * 1000;

class Site {
  url = '';
  nick = '';
  landFail = true;

  constructor(browser) {
    this.browser = browser;
    // For Date Log and Set Path;
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
  }

  async init() {
    console.log('new Page');
    this.page = await this.browser.newPage();
    await this.page.setViewport({width: 1024, height: 880});
    await this.page.setUserAgent(userAgent);

    this.page.on('requestfailed', request => {
      console.log('requesing ' + this.url, request.headers());
    })

    try {
      console.log('goto ' + this.url);
      await this.page.goto(this.url, { waitUntil: "networkidle2" });
    } catch (err) {
      console.error(err);
      this.landFail = true;
    }
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
      console.log('mkdir' + path);
      fs.mkdirSync(path, { recursive: true });
    }
    return path;
  }

  async screenshot() {
    console.log('Screen Shot', this.url);
    if (!this.pngPath) {
      this.pngPath = await this.initPath('pngs');
    }
    await this.page.screenshot({ 'path': `${this.pngPath}/${new Date().toLocaleTimeString().replace(/:/g, '_')}.png` });
  }

  async pdf() {
    console.log('Down Pdf', this.url);
    if (!this.pdfPath) {
      this.pdfPath = await this.initPath('pdfs');
    }
    await this.page.pdf({ 'path': `${this.pdfPath}/${new Date().toLocaleTimeString().replace(/:/g, '_')}.pdf` });
  }

  async close() {
    return await this.page.close();
  }
}

module.exports = Site;