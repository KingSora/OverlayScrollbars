const path = require('path');
const jestPuppeteerConfig = require('../jest-puppeteer.config.base');

module.exports = {
  process: (src, filePath, config) => {
    const deploymentPath = path.relative(path.dirname(config.globals.baseConfig), filePath);
    const split = deploymentPath.split(path.sep);
    return `module.exports = ${JSON.stringify(`http://localhost:${jestPuppeteerConfig.server.port}/${path.posix.join(...split)}`)}`;
  },
};
