import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { rollupPackageJsonPlugin } from '@~local/rollup/plugin/rollupPackageJsonPlugin';
import { rollupCopyPlugin } from '@~local/rollup/plugin/rollupCopyPlugin';

// only used for tests
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, './src/overlayscrollbars-svelte'),
    },
    rollupOptions: {
      external: ['overlayscrollbars'],
      output: [
        {
          format: 'es',
          entryFileNames: 'overlayscrollbars-svelte.esm.js',
        },
        {
          format: 'es',
          entryFileNames: 'overlayscrollbars-svelte.mjs',
        },
        {
          format: 'cjs',
          entryFileNames: 'overlayscrollbars-svelte.cjs.js',
        },
        {
          format: 'cjs',
          entryFileNames: 'overlayscrollbars-svelte.cjs',
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
            type,
          }) => {
            return {
              name,
              version,
              type,
              description,
              author,
              license,
              homepage,
              bugs,
              repository,
              keywords,
              main: 'overlayscrollbars-svelte.esm.js',
              module: 'overlayscrollbars-svelte.esm.js',
              types: 'overlayscrollbars-svelte.d.ts',
              svelte: './overlayscrollbars-svelte.js',
              exports: {
                '.': {
                  svelte: {
                    types: './overlayscrollbars-svelte.d.ts',
                    default: './overlayscrollbars-svelte.js',
                  },
                  import: {
                    types: './overlayscrollbars-svelte.d.mts',
                    default: './overlayscrollbars-svelte.mjs',
                  },
                  require: {
                    types: './overlayscrollbars-svelte.d.cts',
                    default: './overlayscrollbars-svelte.cjs',
                  },
                  default: {
                    types: './overlayscrollbars-svelte.d.ts',
                    default: './overlayscrollbars-svelte.js',
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
  plugins: [svelte(process.env.VITEST ? { hot: false } : {}), svelteTesting()],
});
