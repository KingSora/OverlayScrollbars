const path = require('path');
const {
  rollupAlias,
  rollupResolve,
  rollupCommonjs,
  rollupScss,
  rollupTs,
} = require('./pipeline.common.plugins');

module.exports = (resolve, options) => {
  const { rollup, alias, paths, banner } = options;
  const { output: rollupOutput, input } = rollup;
  const { file, sourcemap } = rollupOutput;
  const { styles: stylesPath } = paths;
  const ogWrite = process.stdout.write;

  return {
    input,
    plugins: [
      rollupAlias(alias),
      rollupScss(banner, sourcemap, true, path.resolve(stylesPath, `${file}.css`)),
      rollupTs(input),
      rollupResolve(resolve),
      rollupCommonjs(sourcemap, resolve),
      {
        generateBundle() {
          process.stdout.write = () => {
            process.stdout.write = ogWrite;
          };
        },
        writeBundle() {
          process.stdout.write = ogWrite;
        },
      },
    ],
  };
};
