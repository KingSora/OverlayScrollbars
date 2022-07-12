const path = require('path');
const { default: rollupEsBuild } = require('rollup-plugin-esbuild');
const {
  rollupCommonjs,
  rollupResolve,
  rollupAlias,
  rollupScss,
} = require('./pipeline.common.plugins');

module.exports = (options) => {
  const { rollup, paths, alias, extractStyle } = options;
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
      rollupScss(extractStyle),
      rollupEsBuild({
        include: /\.[jt]sx?$/,
        sourceMap: true,
        target: 'es6',
        tsconfig: './tsconfig.json',
      }),
      rollupResolve(srcPath),
      rollupCommonjs(sourcemap),
      ...plugins,
    ].filter(Boolean),
  };
};
