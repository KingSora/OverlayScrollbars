const path = require('path');
const { terser: rollupTerser } = require('rollup-plugin-terser');
const { rollupJson } = require('./plugins');

module.exports = (resolve, options) => {
  const { extractPackageJson, outDir, rollup } = options;

  const { input = './package.json', output = './package.json' } = extractPackageJson;

  return {
    input,
    output: {
      file: path.resolve(outDir, output),
    },
    plugins: [rollupJson()],
  };
};
