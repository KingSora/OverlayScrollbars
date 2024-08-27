import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { rollupPackageJsonPlugin } from '@~local/rollup/plugin/rollupPackageJsonPlugin';
import { rollupCopyPlugin } from '@~local/rollup/plugin/rollupCopyPlugin';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-vue.ts'),
    },
    rollupOptions: {
      external: ['vue', 'overlayscrollbars'],
      output: [
        {
          format: 'es',
          entryFileNames: 'overlayscrollbars-vue.esm.js',
        },
        {
          format: 'es',
          entryFileNames: 'overlayscrollbars-vue.mjs',
        },
        {
          format: 'cjs',
          entryFileNames: 'overlayscrollbars-vue.cjs.js',
        },
        {
          format: 'cjs',
          entryFileNames: 'overlayscrollbars-vue.cjs',
        },
        {
          format: 'umd',
          name: 'OverlayScrollbarsVue',
          globals: {
            vue: 'Vue',
            overlayscrollbars: 'OverlayScrollbarsGlobal',
          },
          entryFileNames: 'overlayscrollbars-vue.umd.js',
        },
      ],
      plugins: [
        rollupCopyPlugin({ paths: ['README.md', 'CHANGELOG.md'] }),
        rollupPackageJsonPlugin({
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
              module: 'overlayscrollbars-vue.esm.js',
              types: 'types/overlayscrollbars-vue.d.ts',
              exports: {
                '.': {
                  import: {
                    types: './types/overlayscrollbars-vue.d.mts',
                    default: './overlayscrollbars-vue.mjs',
                  },
                  require: {
                    types: './types/overlayscrollbars-vue.d.cts',
                    default: './overlayscrollbars-vue.cjs',
                  },
                  default: {
                    types: './types/overlayscrollbars-vue.d.ts',
                    default: './overlayscrollbars-vue.cjs.js',
                  },
                },
              },
              peerDependencies,
              sideEffects: false,
            };
          },
        }),
      ],
    },
  },
  plugins: [
    vue(),
    vueJsx(), // used for testing
  ],
});
