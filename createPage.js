/**
 * @desc node createPage.js 文件夹路径（a 或者 a/b） 文件名
 * @examples node createPage.js hello 在src创建hello.ts hello.scss
 * @examples node createPage.js hello world 在src创建hello文件夹，world.ts hello.scss文件
 * @examples node createPage.js hello/world 在src创建hello文件夹，world子文件夹
 * @examples node createPage.js hello/world a 在src创建hello文件夹，world子文件夹 a.ts a.scss文件
*/
const fs = require('fs')

const args = process.argv;
const folder = args[2]; // 获取文件夹名
const name = args[3]; // 获取文件名称

let folderStr = './src/pages/';

function createJs() {
  // name存在
  if (name) {
    if (folder.includes('/')) {
      // 创建多级文件夹
      const folderArr = folder.split('/');
      folderArr.forEach(i => {
        fs.mkdirSync(`${folderStr}${i + '/'}`);
        folderStr += `${i + '/'}`;
      })
    } else {
      // 创建单个文件夹
      fs.mkdirSync(`${folderStr}${folder}`);
      folderStr += `${folder + '/'}`;
    }

    // 创建文件
    // 文件内容(`import '@scss/${name}.scss';`)
    const content = '';
    fs.writeFile(`${folderStr}${name}.ts`, content, err => {
      if (!err) { console.log(`${name}.ts创建成功！`); }
    })
  } else {
    if (folder.includes('/')) {
      // 创建多级文件夹
      const folderArr = folder.split('/');
      folderArr.forEach(i => {
        fs.mkdirSync(`${folderStr}${i + '/'}`);
        folderStr += `${i + '/'}`;
      })
    } else {
      // 创建单个文件
      // 文件内容(`import '@scss/${name}.scss';`)
      const content = '';
      fs.writeFile(`${folderStr}${folder}.ts`, content, err => {
        if (!err) { console.log(`${folder}.ts创建成功！`); }
      })
    }
  }
}

function createScss() {
  // name不存在，folder包含 / 不创建scss
  if (!name && folder.includes('/')) {
    return false;
  }
  const content = '';
  fs.writeFile(`${folderStr}${name}.scss`, content, err => {
    if (!err) { console.log(`${name ? name : folder }.scss创建成功！`); }
  })
}

createJs();
createScss();
