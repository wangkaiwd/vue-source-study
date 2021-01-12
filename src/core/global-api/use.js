/* @flow */

import { toArray } from '../util/index';

export function initUse (Vue: GlobalAPI) {
  // Vue.use(fn,options); fn:函数，fn:拥有install方法的对象
  // 这里除了fn,剩余的参数会组成一个数组，...rest，并且会将Vue通过unshift添加到数组的第一项
  Vue.use = function (plugin: Function | Object) {
    // Vue上缓存已经安装过的插件
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    const args = toArray(arguments, 1);

    args.unshift(this);
    // 执行install方法
    if (typeof plugin.install === 'function') { // plugin为拥有install方法的对象
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') { // plugin就是函数
      plugin.apply(null, args);
    }
    // 安装过的插件放入缓存中
    installedPlugins.push(plugin);
    // 返回Vue，方便链式调用
    return this;
  };
}
