const path = require('path');
const { babel: rollupBabelInputPlugin } = require('@rollup/plugin-babel');
const { terser: rollupTerser } = require('rollup-plugin-terser');
const { summary } = require('rollup-plugin-summary');
const rollupTs = require('rollup-plugin-ts');

const babelConfigUmd = require('./babel.config.umd');
const babelConfigEsm = require('./babel.config.esm');
const {
  rollupCommonjs,
  rollupResolve,
  rollupAlias,
  rollupScss,
} = require('./pipeline.common.plugins');
const { extensions } = require('../../resolve.config.json');

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

module.exports = (esm, options, { declarationFiles = false, outputStyle = false } = {}) => {
  const { rollup, paths, versions, alias, extractStyle } = options;
  const { output: rollupOutput, input, plugins = [], ...rollupOptions } = rollup;
  const { name, file, globals, exports, sourcemap: rawSourcemap, ...outputConfig } = rollupOutput;
  const { minified: buildMinifiedVersion } = versions;
  const { src: srcPath, dist: distPath, types: typesPath } = paths;
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
      summary({
        showGzippedSize: true,
        showBrotliSize: true,
        showMinifiedSize: false,
        warnLow: 33000,
        totalLow: 33000,
        warnHigh: 36000,
        totalHigh: 36000,
      }),
      rollupAlias(alias),
      rollupScss(extractStyle, outputStyle),
      rollupTs({
        tsconfig: (resolvedConfig) => ({
          ...resolvedConfig,
          declaration: declarationFiles,
          declarationDir: typesPath,
        }),
        include: ['*.ts+(|x)', '**/*.ts+(|x)'],
        exclude: ['node_modules', '**/node_modules/*'],
      }),
      rollupResolve(srcPath),
      rollupCommonjs(sourcemap),
      rollupBabelInputPlugin({
        ...(esm ? babelConfigEsm : babelConfigUmd),
        assumptions: {
          enumerableModuleMeta: false,
          constantReexports: true,
          iterableIsArray: true,
          objectRestNoSymbols: true,
          noNewArrows: true,
          noClassCalls: true,
          ignoreToPrimitiveHint: true,
          ignoreFunctionLength: true,
          // privateFieldsAsProperties: true,
          // setPublicClassFields: true,
          setSpreadProperties: true,
          pureGetters: true,
        },
        plugins: [
          '@babel/plugin-transform-runtime',
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-proposal-private-methods', { loose: true }],
        ],
        babelHelpers: 'runtime',
        shouldPrintComment: () => false,
        caller: {
          name: 'babel-rollup-build',
        },
        extensions,
      }),
      ...plugins,
    ].filter(Boolean),
  };
};
