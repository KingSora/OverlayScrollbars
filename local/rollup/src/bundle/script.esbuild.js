const path = require('path');
const {
  rollupEsBuild,
  rollupCommonjs,
  rollupEsbuildResolve,
  rollupAlias,
  rollupScss,
  rollupLicense,
} = require('./plugins');

module.exports = (resolve, options) => {
  const { rollup, paths, alias, extractStyles, banner } = options;
  const { output: rollupOutput, input, plugins = [], ...rollupOptions } = rollup;
  const { file, sourcemap: rawSourcemap, ...outputConfig } = rollupOutput;
  const { dist: distPath } = paths;
  const sourcemap = rawSourcemap;

  const output = {
    ...outputConfig,
    sourcemap,
    format: 'esm',
    generatedCode: 'es2015',
    file: path.resolve(distPath, `${file}.js`),
  };

  return {
    input,
    output,
    ...rollupOptions,
    plugins: [
      rollupEsbuildResolve(resolve),
      rollupAlias(resolve, alias),
      rollupLicense(banner, sourcemap),
      rollupScss(resolve, sourcemap, extractStyles, false),
      rollupEsBuild(sourcemap),
      rollupCommonjs(sourcemap, resolve),
      ...plugins,
    ],
  };
};
