const PuppeteerEnvironment = require('jest-environment-puppeteer');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const del = require('del');
const rollup = require('rollup');
const rollupPluginHtml = require('@rollup/plugin-html');
const rollupPluginStyles = require('rollup-plugin-styles');
const rollupConfig = require('./rollup.config.js');
const resolve = require('./resolve.config.json');

const rollupInputHtmlFile = 'index.html';
const rollupInputFile = 'index';
const rollupOutputHtmlFile = 'build.html';
const rollupOutputFile = 'build';
const rollupOutputDir = '__build__';
const rollupNodeEnv = 'build';
const cacheFilePrefix = 'jest-puppeteer-overlayscrollbars-cache-';
const encoding = 'utf8';

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
    if (dirOrFile !== except) {
      const dirOrFileResolved = path.resolve(dir, dirOrFile);
      if (fs.statSync(dirOrFileResolved).isDirectory()) {
        result.push(...getAllFilesFrom(dirOrFileResolved));
      }
      result.push(dirOrFileResolved);
    }
  });
  return result;
};

const createCacheObj = (testDir) => {
  const testFiles = getAllFilesFrom(testDir, rollupOutputDir);
  const obj = {};

  testFiles.forEach((dir) => {
    obj[dir] = crypto.createHash('md5').update(fs.readFileSync(dir, encoding), encoding).digest('hex');
  });

  return obj;
};

const filesChanged = (cacheDir, testDir) => {
  let result = true;
  const cacheObjString = JSON.stringify(createCacheObj(testDir));
  const getCacheFile = path.resolve(cacheDir, cacheFilePrefix + crypto.createHash('md5').update(testDir, encoding).digest('hex'));
  if (fs.existsSync(getCacheFile)) {
    result = cacheObjString !== fs.readFileSync(getCacheFile, encoding);
  }

  if (result) {
    fs.writeFileSync(getCacheFile, cacheObjString);
  }

  return result;
};

const getRollupInfos = (testPath) => {
  const projectRootPath = path.resolve(__dirname, resolve.projectRoot);
  const testDir = path.dirname(testPath);
  const input = path.resolve(testDir, rollupInputFile);
  const dist = path.resolve(testDir, rollupOutputDir);
  const file = rollupOutputFile;
  const testName = path.basename(testDir);

  return {
    projectRootPath,
    testDir,
    testName,
    input,
    dist,
    file,
  };
};

const setupRollupTest = async (testPath, cache, cacheDir) => {
  const { projectRootPath, input, dist, file, testName, testDir } = getRollupInfos(testPath);

  if (!cache || filesChanged(cacheDir, testDir)) {
    const testPathSplit = path.relative(projectRootPath, testPath).split(path.sep);
    if (testPathSplit.length > 0) {
      const [project] = testPathSplit;
      const env = process.env.NODE_ENV;

      try {
        process.env.NODE_ENV = rollupNodeEnv;
        const htmlFilePath = path.resolve(testDir, rollupInputHtmlFile);
        const htmlFileContent = fs.existsSync(htmlFilePath) ? fs.readFileSync(htmlFilePath, 'utf8') : null;
        let rollupConfigObj = rollupConfig(
          { 'config-project': project },
          {
            overwrite: {
              input,
              dist,
              file,
              types: null,
              minVersions: false,
              esmBuild: false,
              sourcemap: false,
              name: testName,
              pipeline: [
                rollupPluginStyles(),
                ...rollupConfig.defaults.pipeline,
                rollupPluginHtml({
                  title: `Jest-Puppeteer: ${testName}`,
                  fileName: rollupOutputHtmlFile,
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

class PuppeteerRollupEnvironment extends PuppeteerEnvironment {
  constructor(config, context) {
    super(config, context);

    this.ctx = context;
    this.cfg = config;
  }

  async setup() {
    await setupRollupTest(this.ctx.testPath, this.cfg.cache, this.cfg.cacheDirectory);
    await super.setup();
  }

  async teardown() {
    cleanupRollupTest(this.ctx.testPath, this.cfg.cache);
    await super.teardown();
  }
}

module.exports = PuppeteerRollupEnvironment;
