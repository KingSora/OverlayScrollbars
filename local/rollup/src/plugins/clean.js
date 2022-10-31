const path = require('path');
const fs = require('fs');

module.exports = ({ paths = [], verbose = false } = {}) => {
  let cleaned = false;
  return {
    name: 'clean',
    buildStart() {
      if (!cleaned) {
        paths.forEach((currPath) => {
          const resolvedPath = path.resolve(currPath);
          if (fs.existsSync(resolvedPath)) {
            if (verbose) {
              // eslint-disable-next-line no-console
              console.log(`Clean: ${resolvedPath}`);
            }
            fs.rmSync(resolvedPath, { recursive: true });
          }
        });
        cleaned = true;
      }
    },
  };
};
