const externalRegex = /node_modules/;

export const esbuildPluginExternal = () => ({
  name: 'external',
  setup(build) {
    build.onResolve({ filter: /.*/, namespace: 'file' }, async (args) => {
      const { resolveDir, kind } = args;

      if (kind !== 'entry-point') {
        const { path: resolvedPath } = await build.resolve(args.path, {
          resolveDir,
          kind,
          namespace: 'resolve-pls',
        });

        if (externalRegex.test(resolvedPath)) {
          return {
            path: args.path,
            external: true,
          };
        }
      }
    });
  },
});
