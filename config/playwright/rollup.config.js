const fs = require('fs');
const path = require('path');
const rollupPluginStyles = require('rollup-plugin-styles');
const rollupPluginServe = require('rollup-plugin-serve');
// const rollupPluginLivereload = require('rollup-plugin-livereload');

const createRollupConfig = require('../rollup/rollup.config');
const rollupPluginHtml = require('./rollup.pluginHtml');
// const rollupAdditionalWatchFiles = require('./rollup.pluginAdditionalWatchFiles');

const portRange = {
  min: 20000,
  max: 60000,
};

const meta = {
  dist: './.build',
  html: './index.html',
  input: './index.browser',
};

module.exports = (testDir, onListening = null) => {
  const name = path.basename(testDir);
  const htmlFilePath = path.resolve(testDir, meta.html);
  const dist = path.resolve(testDir, meta.dist);
  const htmlName = `${name}.html`;
  const { min, max } = portRange;
  const port = Math.floor(Math.random() * (max - min + 1) + min);

  return createRollupConfig({
    project: name,
    mode: 'dev',
    paths: {
      dist,
      src: path.resolve(testDir, './'),
    },
    versions: {
      minified: false,
      module: false,
    },
    extractStyle: false,
    rollup: {
      input: path.resolve(testDir, meta.input),
      context: 'this',
      moduleContext: () => 'this',
      output: {
        sourcemap: true,
      },
      treeshake: true,
      plugins: [
        rollupPluginStyles(),
        rollupPluginHtml(`Playwright: ${name}`, htmlName, () =>
          fs.existsSync(htmlFilePath) ? fs.readFileSync(htmlFilePath, 'utf8') : null
        ),
        ...(onListening
          ? [
              // rollupAdditionalWatchFiles([htmlFilePath]),
              rollupPluginServe({
                contentBase: dist,
                historyApiFallback: `/${htmlName}`,
                host: '127.0.0.1',
                port,
                onListening,
              }),
              /*
              rollupPluginLivereload({
                watch: dist,
                port: port - 1,
                verbose: false,
              }),
              */
            ]
          : []),
      ],
    },
  });
};
