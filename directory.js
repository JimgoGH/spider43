const fs = require('fs');
const fsP = fs.promises;

const refreshJsons = async () => {
  try {
    const dates = await fsP.readdir('./jsons');
    const dir = dates.map(dt => {

      const obj = {
        date: dt
      };

      (async () => {

        const sites = await fsP.readdir(`./jsons/${dt}`);

        obj.sites = sites.map(st => {
          const obj2 = {
            name: st
          };

          (async () => {
            const pages = await fsP.readdir(`./jsons/${dt}/${st}`);
            obj2.pages = pages.map(elm => elm.replace(/\.json/,''));
          })();

          return obj2
        })

      })();

      return obj;

    });

    setTimeout(() => {
      const ws = fs.createWriteStream('./directory.json', { flags: 'w', encoding: 'utf8' });

      ws.on('ERROR IN ReWrite Directory.json', err => console.error(err.stack));

      // 使用 utf8 编码写入数据
      ws.write(JSON.stringify(dir));

      // 标记文件末尾
      ws.end();
    }, 100);

  } catch (error) {
    console.error('ERROR IN Refresh Directory.json', error);
  }

}

module.exports = {
  refreshJsons: refreshJsons
}