/* @flow */

import { _Set as Set, isObject } from '../util/index';
import type { SimpleSet } from '../util/index';
import VNode from '../vdom/vnode';

const seenObjects = new Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse (val: any) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys;
  const isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return;
  }
  if (val.__ob__) {
    // 已经遍历过的对象会存放它对应的dep id,不会进行重复遍历
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  // [1,2,3]
  if (isA) {
    i = val.length;
    // 这里遍历数组的每一项，是为了当数组中有对象时，继续为对象的属性收集依赖
    while (i--) _traverse(val[i], seen);
  } else {
    keys = Object.keys(val);
    i = keys.length;
    // val[keys[i]]进行取值
    while (i--) _traverse(val[keys[i]], seen);
  }
}
