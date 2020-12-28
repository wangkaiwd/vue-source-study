function createFunction () {

}

function createCompileToFunctionFn (compile) {
  return function compileToFunctions () {
    const compiled = compile('template', 'options');
    return {
      render: createFunction(compiled.render),
      staticRenderFns: compiled.staticRenderFns.map((code) => createFunction(code))
    };
  };
}

function createCompilerCreator (baseCompile) {
  return function createCompiler () {
    function compile () {
      const compiled = baseCompile();
      return compiled;
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    };
  };
}

const createCompiler = createCompilerCreator(function baseCompile (template, options) {
  return {
    ast: 'ast',
    render: 'code.render',
    staticRenderFns: 'code.staticRenderFns'
  };
});

const { compileToFunctions } = createCompiler();

// 目标： 通过compileToFunctions 将模板编译为render函数

// {render, staticRenderFns} = compileToFunctions(compile)
// createCompiler 中的compile方法会执行baseCompile,并将改方法传递给 compileToFunctions(compile)
// createCompiler -> createCompilerCreator(baseCompile)
//  compileToFunctions -> createCompiler(template,options)

// 最终的执行逻辑：
// compileToFunctions -> compile -> baseCompile
