const path = require('path');
const fs = require('fs');

module.exports = ({ paths = [], verbose = false } = {}) => {
  return {
    name: 'copy',
    buildStart() {
      paths.forEach((currPath) => {
        const resolvedPath = path.resolve(currPath);

        if (fs.existsSync(resolvedPath)) {
          if (verbose) {
            // eslint-disable-next-line no-console
            console.log(`Copy: ${resolvedPath}`);
          }
          this.emitFile({
            type: 'asset',
            source: fs.readFileSync(resolvedPath),
            fileName: path.basename(resolvedPath),
          });
        }
      });
    },
  };
};
