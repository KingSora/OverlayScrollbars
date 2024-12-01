import bundleScriptDefault from './bundle/script.default.js';
import bundleScriptEsbuild from './bundle/script.esbuild.js';
import bundleStyles from './bundle/styles.js';
import bundleTypes from './bundle/types.js';
import preBuild from './bundle/pre.js';

export default (resolve, options, esbuild) => {
  const { extractTypes, extractStyles } = options;
  const bundleScript = esbuild ? bundleScriptEsbuild : bundleScriptDefault;

  const pre = preBuild(resolve, options);
  const styles = extractStyles && bundleStyles(resolve, options);
  const types = extractTypes && bundleTypes(resolve, options);
  const js = bundleScript(resolve, options);

  return [pre, styles, types, js].flat().filter((build) => !!build);
};
