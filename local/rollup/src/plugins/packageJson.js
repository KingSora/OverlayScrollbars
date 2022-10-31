const path = require('path');

module.exports = ({ input = 'package.json', output = 'package.json', json } = {}) => {
  const resolvedInput = path.resolve(input);
  const inputPackageJson = require(resolvedInput);
  return {
    name: 'packageJson',
    buildStart() {
      this.emitFile({
        type: 'asset',
        source: JSON.stringify(
          typeof json === 'function' ? json(inputPackageJson) : inputPackageJson,
          null,
          2
        ),
        fileName: output,
      });
    },
  };
};
