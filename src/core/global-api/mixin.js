/* @flow */

import { mergeOptions } from '../util/index';

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 只是进行了选项的合并
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
