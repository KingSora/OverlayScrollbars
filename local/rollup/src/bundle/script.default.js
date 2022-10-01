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
} = require('./plugins');

const moduleFormats = ['es', 'esm', 'module'];
const createMinifiedOutput = (baseOutput) => ({
  ...baseOutput,
  compact: true,
  file: baseOutput.file.replace('.js', '.min.js'),
  sourcemap: false,
  plugins: [
    ...(baseOutput.plugins || []),
    rollupTerser({
      ecma: baseOutput.generatedCode === 'es2015' ? 2015 : 5,
      safari10: true,
      compress: {
        evaluate: false,
        module: moduleFormats.includes(baseOutput.format),
        passes: 3,
      },
    }),
  ],
});

module.exports = (resolve, options) => {
  const { rollup, paths, versions, alias, extractStyles, banner } = options;
  const { output: rollupOutput, input, plugins = [], ...rollupOptions } = rollup;
  const { name, file, globals, exports, sourcemap: rawSourcemap, ...outputConfig } = rollupOutput;
  const { dist: distPath } = paths;
  const sourcemap = rawSourcemap;

  return versions
    .map(({ format, generatedCode, file: filePathOverride, outputSuffix, minifiedVersion }) => {
      const needsGlobals = format === 'umd' || format === 'iife';
      const filePath = path.resolve(distPath, `${file}${outputSuffix || ''}.js`);

      const baseOutput = {
        ...outputConfig,
        ...(needsGlobals && {
          name,
          globals,
          exports,
        }),
        sourcemap,
        format,
        generatedCode,
        file: typeof filePathOverride === 'function' ? filePathOverride(filePath) : filePath,
      };
      const output = [baseOutput, minifiedVersion && createMinifiedOutput(baseOutput)].filter(
        Boolean
      );

      return {
        input,
        output,
        ...rollupOptions,
        plugins: [
          rollupLicense(banner, sourcemap),
          rollupAlias(resolve, alias),
          rollupScss(resolve, sourcemap, extractStyles, false),
          rollupTs(input),
          rollupResolve(resolve),
          rollupCommonjs(sourcemap, resolve),
          rollupBabel(resolve, generatedCode === 'es2015'),
          ...plugins,
        ],
      };
    })
    .flat();
};
