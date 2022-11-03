import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import rollupPluginPackageJson from '@~local/rollup/plugin/packageJson';
import rollupPluginCopy from '@~local/rollup/plugin/copy';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-vue.ts'),
      name: 'OverlayScrollbarsVue',
      fileName: (format) => `overlayscrollbars-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'overlayscrollbars'],
      output: {
        globals: {
          vue: 'Vue',
          overlayscrollbars: 'OverlayScrollbarsGlobal',
        },
      },
      plugins: [
        rollupPluginCopy({ paths: ['README.md'] }),
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
              main: 'overlayscrollbars-vue.umd.js',
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
  plugins: [
    esbuildResolve(),
    vue(),
    vueJsx(), // used for testing
  ],
});
