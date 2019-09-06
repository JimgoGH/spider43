const puppeteer = require('puppeteer-core');
const consts = require('./consts.js');

module.exports.Browser = async () => {
  console.log('new Browser');
  return await puppeteer.launch({
    executablePath: consts.CHROME_PATH,
    headless: false,
    // devtools: true,
  });
}

// console.log(this.Browser());
