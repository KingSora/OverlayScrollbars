/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const rollupPluginStyles = require('rollup-plugin-styles');
const rollupPluginServe = require('rollup-plugin-serve');
// const rollupPluginLivereload = require('rollup-plugin-livereload');

const rollupPluginHtml = require('./rollup.pluginHtml');
const createRollupConfig = require('../createRollupConfig');
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

module.exports = (testDir, mode = 'dev', onListening = null) => {
  const name = path.basename(testDir);
  const htmlFilePath = path.resolve(testDir, meta.html);
  const dist = path.resolve(testDir, meta.dist);
  const htmlName = `${name}.html`;
  const { min, max } = portRange;
  const port = Math.floor(Math.random() * (max - min + 1) + min);

  return createRollupConfig({
    project: name,
    mode,
    banner: `${testDir}`,
    // if the import would be 'overlayscrollbars' and the package name is also 'overlayscrollbars' esbuild needs an alias to resolve it correctly
    alias: (workspaceRoot, workspaces, resolvePath) =>
      workspaces.reduce((obj, resolvedPath) => {
        const absolutePath = path.resolve(workspaceRoot, resolvedPath);
        try {
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const projTsConfig = require(`${path.resolve(
            workspaceRoot,
            resolvedPath
          )}/tsconfig.json`);
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const projPackageJson = require(`${path.resolve(
            workspaceRoot,
            resolvedPath
          )}/package.json`);

          const { name: projectName } = projPackageJson;
          const { compilerOptions } = projTsConfig;
          const { baseUrl } = compilerOptions;

          obj[projectName] = resolvePath(absolutePath, path.join(baseUrl, projectName), true);
        } catch {}
        return obj;
      }, {}),
    paths: {
      dist,
    },
    versions: [
      mode === 'dev'
        ? {
            format: 'esm',
            generatedCode: 'es2015',
            minifiedVersion: false,
          }
        : {
            format: 'iife',
            generatedCode: 'es5',
            minifiedVersion: false,
          },
    ],
    extractStyle: false,
    rollup: {
      input: path.resolve(testDir, meta.input),
      context: 'this',
      moduleContext: () => 'this',
      output: {
        sourcemap: true,
      },
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
