const fs = require('fs')

var args = process.argv;
var name = args[2] // 获取文件名称

function createJs() {
    let content = `import '@scss/${name}.scss';`
    fs.writeFile(`./src/mainfile/${name}.js`,content,(err)=>{
        if (!err){console.log(`${name}.js创建成功！`)}
    })
}
function createScss(){
    let content = "@import './common.scss';"
    fs.writeFile(`./src/scss/${name}.scss`,content,(err)=>{
        if (!err){console.log(`${name}.scss创建成功！`)}
    })
}
function createArt(){
    fs.readFile('./artTemplate.art',(err,data)=>{
        if (!err) {
            fs.writeFile(`./src/pages/${name}.art`,data.toString(),(err)=>{
                if (!err){console.log(`${name}.art创建成功！`)}
            })
        }
    })
}


createJs()
createScss()
createArt()