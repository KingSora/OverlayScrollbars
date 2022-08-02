const path = require('path');
const { terser: rollupTerser } = require('rollup-plugin-terser');
const {
  rollupBabel,
  rollupTs,
  rollupCommonjs,
  rollupResolve,
  rollupAlias,
  rollupScss,
  rollupLicense,
} = require('./pipeline.common.plugins');

const createOutputWithMinifiedVersion = (output, esm, buildMinifiedVersion) =>
  [output].concat(
    buildMinifiedVersion
      ? [
          {
            ...output,
            compact: true,
            file: output.file.replace('.js', '.min.js'),
            sourcemap: false,
            plugins: [
              ...(output.plugins || []),
              rollupTerser({
                ecma: esm ? 2015 : 5,
                safari10: true,
                compress: {
                  evaluate: false,
                  module: !!esm,
                  passes: 3,
                },
              }),
            ],
          },
        ]
      : []
  );

module.exports = (resolve, options, esm) => {
  const { rollup, paths, versions, alias, extractStyles, banner } = options;
  const { output: rollupOutput, input, plugins = [], ...rollupOptions } = rollup;
  const { name, file, globals, exports, sourcemap: rawSourcemap, ...outputConfig } = rollupOutput;
  const { minified: buildMinifiedVersion } = versions;
  const { src: srcPath, dist: distPath } = paths;
  const sourcemap = rawSourcemap;

  const output = createOutputWithMinifiedVersion(
    {
      ...outputConfig,
      ...(!esm && {
        name,
        globals,
        exports,
      }),
      sourcemap,
      format: esm ? 'esm' : 'umd',
      generatedCode: esm ? 'es2015' : 'es5',
      file: path.resolve(distPath, `${file}${esm ? '.esm' : ''}.js`),
    },
    esm,
    buildMinifiedVersion
  );

  return {
    input,
    output,
    treeshake: {
      propertyReadSideEffects: false,
      moduleSideEffects: false,
    },
    ...rollupOptions,
    plugins: [
      rollupLicense(banner, sourcemap),
      rollupAlias(alias),
      rollupScss(banner, sourcemap, extractStyles, false),
      rollupTs(srcPath),
      rollupResolve(srcPath, resolve),
      rollupCommonjs(sourcemap, resolve),
      rollupBabel(resolve, esm),
      ...plugins,
    ].filter(Boolean),
  };
};
