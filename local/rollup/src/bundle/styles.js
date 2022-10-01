const path = require('path');
const { rollupAlias, rollupResolve, rollupScss, rollupEsBuild } = require('./plugins');

module.exports = (resolve, options) => {
  const { rollup, alias, paths, banner, extractStyles } = options;
  const { output: rollupOutput, input } = rollup;
  const { file, sourcemap } = rollupOutput;
  const { styles: stylesPath } = paths;
  const ogWrite = process.stdout.write;

  const pipeline = (cssFilename, minified) => ({
    input,
    plugins: [
      rollupAlias(resolve, alias),
      rollupScss(
        resolve,
        sourcemap && !minified,
        extractStyles,
        path.resolve(stylesPath, cssFilename),
        banner,
        minified
      ),
      rollupEsBuild(false),
      rollupResolve(resolve, (module) =>
        resolve.styleExtensions.some((ext) => module.endsWith(ext))
      ),
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
  });

  return [pipeline(`${file}.css`), pipeline(`${file}.min.css`, true)];
};
