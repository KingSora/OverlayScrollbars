const { dirname } = require('path');
const { build } = require('esbuild');

module.exports = ({ esbuild: esBuildOptions = {} } = {}) => {
  let resolver;
  let esbuildInstance;

  return {
    name: 'esbuild-resolve',
    async buildStart() {
      if (!esbuildInstance) {
        [esbuildInstance, resolver] = await new Promise((resolve) => {
          let esBuildResolver;
          build({
            ...esBuildOptions,
            watch: true,
            plugins: [
              {
                name: 'resolve-grab',
                setup(esbuild) {
                  esbuild.onStart(() => {
                    esBuildResolver = esbuild;
                  });
                },
              },
              ...(esBuildOptions.plugins || []),
            ],
          }).then((instance) => {
            resolve([instance, esBuildResolver]);
          });
        });
      }
    },
    async buildEnd() {
      if (esbuildInstance) {
        esbuildInstance.stop();
        esbuildInstance = null;
        resolver = null;
      }
    },
    async resolveId(source, importer, options) {
      const { isEntry } = options;
      const resolveDir = isEntry || !importer ? dirname(source) : dirname(importer);
      const {
        path: id,
        sideEffects: moduleSideEffects,
        external,
        errors,
        warnings,
      } = await resolver.resolve(source, { resolveDir, kind: 'entry-point' });

      if (errors && errors.length > 0) {
        errors.forEach(({ text }) => {
          this.error(text);
        });
        return null;
      }

      if (warnings && warnings.length > 0) {
        warnings.forEach(({ text }) => {
          this.warn(text);
        });
      }

      return { id, external, moduleSideEffects };
    },
  };
};
