const path = require('path');
const {
  rollupEsBuild,
  rollupCommonjs,
  rollupResolve,
  rollupAlias,
  rollupScss,
} = require('./pipeline.common.plugins');

module.exports = (resolve, options) => {
  const { rollup, paths, alias, extractStyles } = options;
  const { output: rollupOutput, input, plugins = [], ...rollupOptions } = rollup;
  const { file, sourcemap: rawSourcemap, ...outputConfig } = rollupOutput;
  const { src: srcPath, dist: distPath } = paths;
  const sourcemap = rawSourcemap;

  const output = {
    ...outputConfig,
    sourcemap: true,
    format: 'esm',
    generatedCode: 'es2015',
    file: path.resolve(distPath, `${file}.js`),
  };

  return {
    input,
    output,
    ...rollupOptions,
    plugins: [
      rollupAlias(alias),
      rollupScss(extractStyles, false),
      rollupEsBuild(),
      rollupResolve(srcPath, resolve),
      rollupCommonjs(sourcemap, resolve),
      ...plugins,
    ].filter(Boolean),
  };
};
