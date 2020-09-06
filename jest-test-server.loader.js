const path = require('path');

module.exports = {
  process: (src, filePath) => {
    const deploymentPath = path.relative(__dirname, filePath);
    const split = deploymentPath.split(path.sep);
    const { TEST_SERVER_PORT } = process.env;

    return `module.exports = ${JSON.stringify(`http://localhost:${TEST_SERVER_PORT}/${path.posix.join(...split)}`)}`;
  },
};
