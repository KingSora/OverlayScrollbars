import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import rollupPluginPackageJson from '@~local/rollup/plugin/packageJson';
import rollupPluginCopy from '@~local/rollup/plugin/copy';

// only used for tests
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, './src/overlayscrollbars-svelte'),
      formats: ['es', 'cjs'],
      fileName: (format) => `overlayscrollbars-svelte.${format}.js`,
    },
    rollupOptions: {
      external: ['overlayscrollbars'],
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
              main: 'overlayscrollbars-svelte.cjs.js',
              module: 'overlayscrollbars-svelte.es.js',
              types: 'overlayscrollbars-svelte.d.ts',
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
              svelte: './overlayscrollbars-svelte.js',
              peerDependencies,
              sideEffects: false,
            };
          },
        }),
      ],
    },
  },
  plugins: [esbuildResolve(), svelte(process.env.VITEST ? { hot: false } : {})],
});
