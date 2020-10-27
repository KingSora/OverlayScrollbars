const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const del = require('del');
const rollup = require('rollup');
const rollupPluginHtml = require('@rollup/plugin-html');
const rollupPluginStyles = require('rollup-plugin-styles');
const deploymentConfig = require('./jest-puppeteer.rollup.config.js');

const rollupConfigName = 'rollup.config.js';
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
    <style>
      html,
      body {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      body {
        padding: 10px;
      }
      *::before,
      *::after {
        box-sizing: border-box;
      }
      * {
        box-sizing: inherit;
      }
      #testResult {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        padding: 5px;
        background: white;
      }
      #testResult.passed {
        display: block;
        background: lime;
      }
      #testResult.passed::before {
        content: 'passed';
      }
      #testResult.failed {
        display: block;
        background: red;
      }
      #testResult.failed::before {
        content: 'failed';
      }
    </style>
    ${links}
  </head>
  <body>
    ${content || ''}
    ${scripts}
    <div id="testResult"></div>
    <script>
      var testResultElm = document.getElementById('testResult');
      window.setTestResult = function(result) {
        if (typeof result === 'boolean') {
          testResultElm.setAttribute('class', result ? 'passed' : 'failed');
        }
        else {
          testResultElm.removeAttribute('class');
        }
      };
      window.testPassed = function() {
        return testResultElm.getAttribute('class') === 'passed';
      }
    </script>
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
  const testFiles = getAllFilesFrom(path.dirname(testPath), [deploymentConfig.build, testFileName]);
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

const setupRollupTest = async (rootDir, testPath, cacheDir) => {
  const testDir = path.dirname(testPath);
  const testName = path.basename(testDir);
  const changed = cacheDir ? filesChanged(testPath, cacheDir) : true;
  const buildFolderExists = fs.existsSync(path.resolve(testDir, deploymentConfig.build));

  if (changed || !buildFolderExists) {
    const rollupConfigPath = path.resolve(rootDir, rollupConfigName);

    if (fs.existsSync(rollupConfigPath)) {
      const rollupConfig = require(rollupConfigPath); // eslint-disable-line

      if (typeof rollupConfig === 'function') {
        try {
          const htmlFilePath = path.resolve(testDir, deploymentConfig.html.input);
          const htmlFileContent = fs.existsSync(htmlFilePath) ? fs.readFileSync(htmlFilePath, 'utf8') : null;

          let rollupConfigObj = rollupConfig(undefined, {
            project: rootDir,
            overwrite: ({ defaultConfig }) => {
              return {
                input: path.resolve(testDir, deploymentConfig.js.input),
                dist: path.resolve(testDir, deploymentConfig.build),
                file: deploymentConfig.js.output,
                types: null,
                minVersions: false,
                esmBuild: false,
                sourcemap: true,
                name: testName,
                pipeline: [
                  rollupPluginStyles(),
                  ...defaultConfig.pipeline,
                  rollupPluginHtml({
                    title: `Jest-Puppeteer: ${testName}`,
                    fileName: deploymentConfig.html.output,
                    template: genHtmlTemplateFunc(htmlFileContent),
                    meta: [{ charset: 'utf-8' }, { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],
                  }),
                ],
              };
            },
            silent: true,
            fast: true,
          });

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
      }
    }
  }
};

const cleanupRollupTest = (testPath, cache) => {
  if (!cache) {
    del(path.resolve(path.dirname(testPath), deploymentConfig.build));
  }
};

module.exports = { setupRollupTest, cleanupRollupTest };
