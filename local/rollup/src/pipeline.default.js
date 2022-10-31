const bundleScriptDefault = require('./bundle/script.default');
const bundleScriptEsbuild = require('./bundle/script.esbuild');
const bundleStyles = require('./bundle/styles');
const bundleTypes = require('./bundle/types');
const preBuild = require('./bundle/pre');

module.exports = (resolve, options, esbuild) => {
  const { extractTypes, extractStyles } = options;
  const bundleScript = esbuild ? bundleScriptEsbuild : bundleScriptDefault;

  const pre = preBuild(resolve, options);
  const styles = extractStyles && bundleStyles(resolve, options);
  const types = extractTypes && bundleTypes(resolve, options);
  const js = bundleScript(resolve, options);

  return [pre, styles, types, js].flat().filter((build) => !!build);
};
