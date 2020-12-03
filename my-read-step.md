## `Vue`源码阅读

* 阅读官方`contrubuting guide`
* [project structure](https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md#project-structure)

### 查找入口位置

* entry
* debug
  * enable rollup sourcemap
  * create html file then import vue by script

问题(并不一定要掌握，但是要明白查找内容的技巧)：

* `TARGET`是如何获取到的
  * [rollup environment variable](https://rollupjs.org/guide/en/#--environment-values)
  * `--environment TARGET:web-full-dev`
* 如何快速找到`rollup`源码映射配置项
  * 找到官方提供的配置`example`
  * 在[`rollup-starter-app`](https://github.com/rollup/rollup-starter-app) 中搜索`sourcemap`

### `rollup`打包配置

### 问题记录

* [npm 运行`script`时传入额外参数](https://docs.npmjs.com/cli/v6/commands/npm-run-script)
  * "build": "node scripts/build.js",
  * "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
  * 通过`process.argv[2]`就可以拿到`--`后面的参数
  * 自己在项目开发过程中也可以利用这个特性
