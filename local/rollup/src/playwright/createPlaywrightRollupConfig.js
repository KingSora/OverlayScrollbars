/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const rollupPluginStyles = require('rollup-plugin-styles');
const rollupPluginServe = require('rollup-plugin-serve');
const rollupPluginLivereload = require('rollup-plugin-livereload');

const rollupPluginHtml = require('./rollup.pluginHtml');
const createRollupConfig = require('../createRollupConfig');
const rollupAdditionalWatchFiles = require('./rollup.pluginAdditionalWatchFiles');

const portRange = {
  min: 20000,
  max: 60000,
};

const paths = {
  dist: './.build',
  input: './index.browser',
  html: './index.html',
};

module.exports = (testDir, useEsbuild, dev) => {
  const testPaths = Object.keys(paths).reduce((obj, key) => {
    obj[key] = path.resolve(testDir, paths[key]);
    return obj;
  }, {});

  const { min, max } = portRange;
  const { dist, input, html: htmlPath } = testPaths;
  const name = path.basename(testDir);
  const htmlName = `${name}.html`;
  const port = Math.floor(Math.random() * (max - min + 1) + min);
  const isDev = !!dev;
  let server;

  const config = createRollupConfig({
    useEsbuild,
    project: name,
    banner: testDir,
    extractStyle: false,
    extractTypes: false,
    paths: {
      dist,
    },
    versions: [
      {
        format: 'iife',
        generatedCode: 'es5',
        minifiedVersion: false,
      },
    ],
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
    rollup: {
      input,
      context: 'this',
      moduleContext: () => 'this',
      output: {
        sourcemap: isDev,
      },
      plugins: [
        rollupPluginStyles(),
        rollupPluginHtml(`Playwright: ${name}`, htmlName, () =>
          fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : null
        ),
        rollupPluginServe({
          port,
          contentBase: dist,
          historyApiFallback: `/${htmlName}`,
          host: '127.0.0.1',
          verbose: isDev,
          onListening: (srv) => {
            server = srv;
          },
        }),
        isDev && rollupAdditionalWatchFiles([htmlPath]),
        isDev &&
          rollupPluginLivereload({
            watch: dist,
            port: port - 1,
            verbose: false,
          }),
      ],
    },
  });

  return [config, () => server];
};
