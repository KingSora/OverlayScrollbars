import buildPlugins from './plugins.js';
import { rollupCleanPlugin } from '../plugins/rollupCleanPlugin.js';
import { rollupCopyPlugin } from '../plugins/rollupCopyPlugin.js';
import { rollupPackageJsonPlugin } from '../plugins/rollupPackageJsonPlugin.js';

const { rollupVirtual } = buildPlugins;

export default (_, options) => {
  const { project, verbose, clean, copy, outDir, projectDir, extractPackageJson } = options;

  return {
    input: 'preBuild',
    onwarn: (warning, warn) => {
      if (warning.code !== 'EMPTY_BUNDLE') {
        warn(warning);
      }
    },
    output: {
      dir: outDir,
    },
    plugins: [
      verbose && {
        name: 'PROJECT',
        buildStart() {
          // eslint-disable-next-line no-console
          console.log('');
          // eslint-disable-next-line no-console
          console.log('PROJECT : ', project);
          // eslint-disable-next-line no-console
          console.log('OPTIONS : ', options);
        },
      },
      clean && outDir !== projectDir && rollupCleanPlugin({ paths: [outDir], verbose }),
      extractPackageJson && rollupPackageJsonPlugin(extractPackageJson),
      copy && rollupCopyPlugin({ paths: copy, verbose }),
      rollupVirtual({
        preBuild: '',
      }),
      {
        generateBundle(__, bundle) {
          const virtualEntry = Object.keys(bundle).find((key) => key.includes('virtual'));
          if (virtualEntry) {
            delete bundle[virtualEntry];
          }
        },
      },
    ].filter(Boolean),
  };
};
