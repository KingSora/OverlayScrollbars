const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const del = require('del');
const rollup = require('rollup');
const rollupPluginHtml = require('@rollup/plugin-html');
const rollupPluginStyles = require('rollup-plugin-styles');
const rollupConfig = require('./rollup.config.js');
const resolve = require('./resolve.config.json');
const config = require('./jest-puppeteer.rollup.config.js');

const rollupNodeEnv = 'build';
const cacheFilePrefix = 'jest-puppeteer-overlayscrollbars-cache-';
const cacheEncoding = 'utf8';
const cacheHash = 'md5';

const makeHtmlAttributes = (attributes) => {
  if (!attributes) {
    return '';
  }

  const keys = Object.keys(attributes);
  // eslint-disable-next-line no-param-reassign
  // eslint-disable-next-line no-return-assign
  return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '');
};

const genHtmlTemplateFunc = (content) => ({ attributes, files, meta, publicPath, title }) => {
  const scripts = (files.js || [])
    .map(({ fileName }) => `<script src="${publicPath}${fileName}"${makeHtmlAttributes(attributes.script)}></script>`)
    .join('\n');

  const links = (files.css || [])
    .map(({ fileName }) => `<link href="${publicPath}${fileName}" rel="stylesheet"${makeHtmlAttributes(attributes.link)}>`)
    .join('\n');

  const metas = meta.map((input) => `<meta${makeHtmlAttributes(input)}>`).join('\n');

  return `<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
    ${content || ''}
    ${scripts}
  </body>
</html>`;
};

const getAllFilesFrom = (dir, except) => {
  const result = [];
  fs.readdirSync(dir).forEach((dirOrFile) => {
    if (!except.includes(dirOrFile)) {
      const dirOrFileResolved = path.resolve(dir, dirOrFile);
      if (fs.statSync(dirOrFileResolved).isDirectory()) {
        result.push(...getAllFilesFrom(dirOrFileResolved));
      }
      result.push(dirOrFileResolved);
    }
  });
  return result;
};

const createCacheObj = (testPath) => {
  const testFileName = path.basename(testPath);
  const testFiles = getAllFilesFrom(path.dirname(testPath), [config.build, testFileName]);
  const obj = {};

  testFiles.forEach((dir) => {
    obj[dir] = crypto.createHash(cacheHash).update(fs.readFileSync(dir, cacheEncoding), cacheEncoding).digest('hex');
  });

  return obj;
};

const filesChanged = (testPath, cacheDir) => {
  let result = true;
  const cacheObjString = JSON.stringify(createCacheObj(testPath));
  const getCacheFile = path.resolve(cacheDir, cacheFilePrefix + crypto.createHash(cacheHash).update(testPath, cacheEncoding).digest('hex'));
  if (fs.existsSync(getCacheFile)) {
    result = cacheObjString !== fs.readFileSync(getCacheFile, cacheEncoding);
  }

  if (result) {
    fs.writeFileSync(getCacheFile, cacheObjString);
  }

  return result;
};

const getRollupInfos = (testPath) => {
  const projectRootPath = path.resolve(__dirname, resolve.projectRoot);
  const testDir = path.dirname(testPath);
  const input = path.resolve(testDir, config.js.input);
  const dist = path.resolve(testDir, config.build);
  const testName = path.basename(testDir);

  return {
    projectRootPath,
    testDir,
    testName,
    input,
    dist,
  };
};

const setupRollupTest = async (testPath, cache, cacheDir) => {
  const { projectRootPath, input, dist, testName, testDir } = getRollupInfos(testPath);
  const changed = !cache || filesChanged(testPath, cacheDir);

  if (changed || !fs.existsSync(path.resolve(testDir, config.build))) {
    const testPathSplit = path.relative(projectRootPath, testPath).split(path.sep);
    if (testPathSplit.length > 0) {
      const [project] = testPathSplit;
      const env = process.env.NODE_ENV;

      try {
        process.env.NODE_ENV = rollupNodeEnv;
        const htmlFilePath = path.resolve(testDir, config.html.input);
        const htmlFileContent = fs.existsSync(htmlFilePath) ? fs.readFileSync(htmlFilePath, 'utf8') : null;
        let rollupConfigObj = rollupConfig(
          { 'config-project': project },
          {
            overwrite: {
              input,
              dist,
              file: config.js.output,
              types: null,
              minVersions: false,
              esmBuild: false,
              sourcemap: true,
              name: testName,
              pipeline: [
                rollupPluginStyles(),
                ...rollupConfig.defaults.pipeline,
                rollupPluginHtml({
                  title: `Jest-Puppeteer: ${testName}`,
                  fileName: config.html.output,
                  template: genHtmlTemplateFunc(htmlFileContent),
                  meta: [{ charset: 'utf-8' }, { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],
                }),
              ],
            },
            silent: true,
            fast: true,
            check: false,
          }
        );

        if (!Array.isArray(rollupConfigObj)) {
          rollupConfigObj = [rollupConfigObj];
        }

        for (let i = 0; i < rollupConfigObj.length; i++) {
          const inputConfig = rollupConfigObj[i];
          let { output } = inputConfig;
          // eslint-disable-next-line no-await-in-loop
          const bundle = await rollup.rollup(inputConfig);

          if (!Array.isArray(output)) {
            output = [output];
          }

          for (let v = 0; v < output.length; v++) {
            const outputConfig = output[i];
            // eslint-disable-next-line no-await-in-loop
            await bundle.write(outputConfig);
          }
        }
      } catch (e) {
        console.warn(e);
      }
      process.env.NODE_ENV = env;
    }
  }
};

const cleanupRollupTest = (testPath, cache) => {
  if (!cache) {
    const { dist } = getRollupInfos(testPath);
    del(dist);
  }
};

module.exports = { setupRollupTest, cleanupRollupTest };
