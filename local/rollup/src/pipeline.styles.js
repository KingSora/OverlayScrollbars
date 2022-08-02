const path = require('path');
const { rollupResolve, rollupScss, rollupEsBuild } = require('./pipeline.common.plugins');

module.exports = (resolve, options) => {
  const { rollup, paths } = options;
  const { output: rollupOutput, input } = rollup;
  const { file, sourcemap } = rollupOutput;
  const { src: srcPath, styles: stylesPath } = paths;
  const ogWrite = process.stdout.write;

  return {
    input,
    plugins: [
      rollupResolve(srcPath, resolve),
      rollupScss(true, path.resolve(stylesPath, `${file}.css`), sourcemap),
      rollupEsBuild(),
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
