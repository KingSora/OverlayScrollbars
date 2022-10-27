const bundleScriptDefault = require('./bundle/script.default');
const bundleScriptEsbuild = require('./bundle/script.esbuild');
const bundleStyles = require('./bundle/styles');
const bundleTypes = require('./bundle/types');
const bundlePackageJson = require('./bundle/packageJson');

module.exports = (resolve, options, esbuild) => {
  const { extractTypes, extractStyles, extractPackageJson } = options;
  const bundleScript = esbuild ? bundleScriptEsbuild : bundleScriptDefault;

  const styles = extractStyles && bundleStyles(resolve, options);
  const types = extractTypes && bundleTypes(resolve, options);
  const js = bundleScript(resolve, options);
  const pkgJson = extractPackageJson && bundlePackageJson(resolve, options);

  return [styles, types, js, pkgJson].flat().filter((build) => !!build);
};
