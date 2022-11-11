import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import solidPlugin from 'vite-plugin-solid';
import rollupPluginPackageJson from '@~local/rollup/plugin/packageJson';
import rollupPluginCopy from '@~local/rollup/plugin/copy';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      formats: ['es', 'cjs'],
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
              main: 'overlayscrollbars-vue.cjs.js',
              module: 'overlayscrollbars-vue.es.js',
              types: 'types/overlayscrollbars-vue.d.ts',
              peerDependencies,
              sideEffects: false,
            };
          },
        }),
      ],
    },
  },
  plugins: [esbuildResolve(), solidPlugin()],
});
