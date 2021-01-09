const path = require('path');
const deploymentConfig = require('./jest-puppeteer.rollup.config.js');

module.exports = {
  process: (src, filePath) => {
    const deploymentPath = path.relative(deploymentConfig.root, filePath);
    const split = deploymentPath.split(path.sep);
    return `module.exports = ${JSON.stringify(`http://localhost:${deploymentConfig.port}/${path.posix.join(...split)}`)}`;
  },
};
