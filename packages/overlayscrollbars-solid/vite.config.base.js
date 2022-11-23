import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import rollupPluginPackageJson from '@~local/rollup/plugin/packageJson';
import rollupPluginCopy from '@~local/rollup/plugin/copy';

export const base = defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-solid.ts'),
      name: 'OverlayScrollbarsSolid',
      fileName: (format) => `overlayscrollbars-solid.${format}.js`,
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'solid-js/store', 'overlayscrollbars'],
      output: {
        globals: {
          overlayscrollbars: 'OverlayScrollbarsGlobal',
        },
      },
      plugins: [
        rollupPluginCopy({ paths: ['README.md', 'CHANGELOG.md'] }),
        rollupPluginPackageJson({
          json: ({
            name,
            version,
            description,
            author,
            license,
            homepage,
            bugs,
            repository,
            keywords,
            peerDependencies,
          }) => {
            return {
              name,
              version,
              description,
              author,
              license,
              homepage,
              bugs,
              repository,
              keywords,
              main: 'overlayscrollbars-solid.cjs.js',
              module: 'overlayscrollbars-solid.es.js',
              types: 'types/overlayscrollbars-solid.d.ts',
              peerDependencies,
              sideEffects: false,
            };
          },
        }),
      ],
    },
  },
  plugins: [esbuildResolve()],
});
