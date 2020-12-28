/* @flow */

import { parse } from './parser/index';
import { optimize } from './optimizer';
import { generate } from './codegen/index';
import { createCompilerCreator } from './create-compiler';

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.

export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 生成ast语法树
  const ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    // 静态节点优化
    optimize(ast, options);
  }
  // 代码生成
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});
