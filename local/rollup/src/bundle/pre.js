import buildPlugins from './plugins.js';
import rollupPluginClean from '../plugins/clean.js';
import rollupPluginCopy from '../plugins/copy.js';
import rollupPluginPackageJson from '../plugins/packageJson.js';

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
      clean && outDir !== projectDir && rollupPluginClean({ paths: [outDir], verbose }),
      extractPackageJson && rollupPluginPackageJson(extractPackageJson),
      copy && rollupPluginCopy({ paths: copy, verbose }),
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
