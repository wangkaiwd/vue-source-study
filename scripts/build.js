const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const rollup = require('rollup');
const terser = require('terser');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// 所有的rollup打包配置项
let builds = require('./config').getAllBuilds();

// filter builds via command line arg
// 对打包配置项进行过滤
// 当Node.js进行被执行的时候，process.argv属性返回一个包含传入的命令行参数的数组
// 第一个参数: process.execPath，被启动的可执行的Node.js 进程的绝对路径
// 第二个参数：被执行的JavaScript文件路径
// 剩余参数： 额外的命令行参数
// 所以一般额外的命令行参数要从process.argv[2]中来进行获取
// Vue的打包命令：
// "build": "node scripts/build.js"
// "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer"
// 注意：这里的 -- 是npm用来分隔命令行参数的特定符号
if (process.argv[2]) {
  // 过滤出命令行中传入参数的对应rollup配置,用于之后打包
  const filters = process.argv[2].split(',');
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1);
  });
} else {
  // filter out weex builds by default
  // 配置项中没有weex的打包配置
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1;
  });
}
build(builds);

// 异步将打包结果打包到dist下对应的文件中
function build (builds) {
  let built = 0;
  const total = builds.length;
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++;
      if (built < total) {
        next();
      }
    }).catch(logError);
  };

  next();
}

function buildEntry (config) {
  const output = config.output;
  const { file, banner } = output;
  const isProd = /(min|prod)\.js$/.test(file);
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ output: [{ code }] }) => {
      if (isProd) {
        const minified = (banner ? banner + '\n' : '') + terser.minify(code, {
          toplevel: true,
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code;
        return write(file, minified, true);
      } else {
        return write(file, code);
      }
    });
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''));
      resolve();
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err);
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err);
          report(' (gzipped: ' + getSize(zipped) + ')');
        });
      } else {
        report();
      }
    });
  });
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError (e) {
  console.log(e);
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
