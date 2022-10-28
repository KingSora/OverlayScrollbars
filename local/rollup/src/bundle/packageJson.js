const path = require('path');
const { rollupVirtual } = require('./plugins');

module.exports = (_, options) => {
  const { extractPackageJson, outDir } = options;

  const {
    input = './package.json',
    output = './package.json',
    json,
  } = typeof extractPackageJson === 'object' ? extractPackageJson : {};
  const resolvedInput = path.resolve(input);
  const inputPackageJson = require(resolvedInput);

  return {
    input: resolvedInput,
    onwarn: (warning, warn) => {
      if (warning.code !== 'EMPTY_BUNDLE') {
        warn(warning);
      }
    },
    output: {
      file: path.resolve(outDir, output),
    },
    plugins: [
      rollupVirtual({
        [resolvedInput]: '',
      }),
      {
        generateBundle(__, bundle) {
          const bundleKeys = Object.keys(bundle);
          if (bundleKeys.length > 1) {
            throw new Error('Unexpected entries length.');
          }
          bundle[bundleKeys[0]].code = JSON.stringify(
            typeof json === 'function' ? json(inputPackageJson) : inputPackageJson,
            null,
            2
          );
        },
      },
    ],
  };
};
