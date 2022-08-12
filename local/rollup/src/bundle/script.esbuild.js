const path = require('path');
const {
  rollupEsBuild,
  rollupCommonjs,
  rollupResolve,
  rollupAlias,
  rollupScss,
} = require('./plugins');

module.exports = (resolve, options) => {
  const { rollup, paths, alias, extractStyles } = options;
  const { output: rollupOutput, input, plugins = [], ...rollupOptions } = rollup;
  const { file, sourcemap: rawSourcemap, ...outputConfig } = rollupOutput;
  const { dist: distPath } = paths;
  const sourcemap = rawSourcemap;

  const output = {
    ...outputConfig,
    sourcemap: true,
    format: 'esm',
    generatedCode: 'es2015',
    file: path.resolve(distPath, `${file}.js`),
    plugins: (outputConfig.plugins || []).filter(Boolean),
  };

  return {
    input,
    output,
    ...rollupOptions,
    plugins: [
      rollupAlias(alias),
      rollupScss(resolve, sourcemap, extractStyles, false),
      rollupEsBuild(),
      rollupCommonjs(sourcemap, resolve),
      rollupResolve(resolve),
      ...plugins,
    ].filter(Boolean),
  };
};
