import path from 'node:path';
import buildPlugins from './plugins.js';

const { rollupEsbuildResolve, rollupScss, rollupEsBuild } = buildPlugins;

export default (resolve, options) => {
  const { rollup, paths, banner, extractStyles } = options;
  const { output: rollupOutput, input } = rollup;
  const { file, sourcemap } = rollupOutput;
  const { styles: stylesPath } = paths;
  const ogWrite = process.stdout.write;

  const pipeline = (cssFilename, minified) => ({
    input,
    external: (id, parentId) => {
      if (!parentId) {
        return false;
      }
      return !resolve.styleExtensions.find((ext) => id.endsWith(ext));
    },
    plugins: [
      rollupEsbuildResolve(resolve),
      rollupScss(
        resolve,
        false && sourcemap && !minified,
        extractStyles,
        path.resolve(stylesPath, cssFilename),
        banner,
        minified
      ),
      rollupEsBuild(false),
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
