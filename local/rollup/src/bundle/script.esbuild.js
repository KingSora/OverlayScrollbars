import path from 'node:path';
import buildPlugins from './plugins.js';

const { rollupEsBuild, rollupCommonjs, rollupEsbuildResolve, rollupScss, rollupLicense } =
  buildPlugins;

export default (resolve, options) => {
  const { rollup, paths, extractStyles, banner } = options;
  const { output: rollupOutput, input, plugins = [], ...rollupOptions } = rollup;
  const { file, sourcemap: rawSourcemap, ...outputConfig } = rollupOutput;
  const { js: jsPath } = paths;
  const sourcemap = rawSourcemap;

  const output = {
    ...outputConfig,
    sourcemap,
    format: 'esm',
    generatedCode: 'es2015',
    file: path.resolve(jsPath, `${file}.js`),
  };

  return {
    input,
    output,
    ...rollupOptions,
    plugins: [
      rollupEsbuildResolve(resolve),
      rollupLicense(banner, sourcemap),
      rollupScss(resolve, sourcemap, extractStyles, false),
      rollupEsBuild(sourcemap),
      rollupCommonjs(sourcemap, resolve),
      ...plugins,
    ],
  };
};
