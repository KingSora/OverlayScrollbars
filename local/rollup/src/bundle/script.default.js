const path = require('path');
const { terser: rollupTerser } = require('rollup-plugin-terser');
const {
  rollupBabel,
  rollupTs,
  rollupCommonjs,
  rollupEsbuildResolve,
  rollupAlias,
  rollupScss,
  rollupLicense,
} = require('./plugins');

const moduleFormats = ['es', 'esm', 'module'];
const createMinifiedOutput = (baseOutput) => {
  const extname = path.extname(baseOutput.file);
  return {
    ...baseOutput,
    compact: true,
    file: baseOutput.file.replace(extname, `.min${extname}`),
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
  };
};

module.exports = (resolve, options) => {
  const { rollup, paths, versions, alias, extractStyles, banner } = options;
  const { output: rollupOutput, input, plugins = [], ...rollupOptions } = rollup;
  const { name, file, globals, exports, sourcemap: rawSourcemap, ...outputConfig } = rollupOutput;
  const { js: jsPath } = paths;
  const sourcemap = rawSourcemap;

  return versions
    .map(({ format, generatedCode, file: filePathOverride, extension, minifiedVersion }) => {
      const needsGlobals = format === 'umd' || format === 'iife';
      const filePath = path.resolve(jsPath, `${file}${extension || '.js'}`);

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
          rollupEsbuildResolve(resolve),
          rollupAlias(resolve, alias),
          rollupScss(resolve, sourcemap, extractStyles, false),
          rollupTs(input),
          rollupBabel(resolve, generatedCode === 'es2015'),
          rollupCommonjs(sourcemap, resolve),
          ...plugins,
        ],
      };
    })
    .flat();
};
