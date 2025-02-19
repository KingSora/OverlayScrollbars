import rollupPluginHtml from '@rollup/plugin-html';

const makeHtmlAttributes = (attributes) => {
  if (!attributes) {
    return '';
  }

  const keys = Object.keys(attributes);
  return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '');
};

const genHtmlTemplateFunc =
  (contentOrContentFn) =>
  ({ attributes, files, meta, publicPath, title }) => {
    const scripts = (files.js || [])
      .map(
        ({ fileName }) =>
          `<script src="${publicPath}${fileName}"${makeHtmlAttributes(attributes.script)}></script>`
      )
      .join('\n');

    const links = (files.css || [])
      .map(
        ({ fileName }) =>
          `<link href="${publicPath}${fileName}" rel="stylesheet"${makeHtmlAttributes(
            attributes.link
          )}>`
      )
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
    ${(typeof contentOrContentFn === 'function' ? contentOrContentFn() : contentOrContentFn) || ''}
    ${scripts}
    <div id="testResult"></div>
  </body>
</html>`;
  };

export const rollupPlaywrightHtmlPlugin = (title, fileName, getHtmlContent) =>
  rollupPluginHtml({
    title,
    fileName,
    template: genHtmlTemplateFunc(getHtmlContent),
    meta: [{ charset: 'utf-8' }, { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],
  });
