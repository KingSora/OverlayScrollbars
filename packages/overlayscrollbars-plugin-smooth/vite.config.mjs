import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import rollupPluginPackageJson from '@~local/rollup/plugin/packageJson';
import rollupPluginCopy from '@~local/rollup/plugin/copy';

const fileName = 'overlayscrollbars-plugin-smooth';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, `src/${fileName}.ts`),
    },
    rollupOptions: {
      external: ['overlayscrollbars'],
      output: [
        {
          format: 'es',
          entryFileNames: `${fileName}.esm.js`,
        },
        {
          format: 'es',
          entryFileNames: `${fileName}.mjs`,
        },
        {
          format: 'cjs',
          entryFileNames: `${fileName}.cjs.js`,
        },
        {
          format: 'cjs',
          entryFileNames: `${fileName}.cjs`,
        },
        {
          format: 'umd',
          name: 'OverlayScrollbarsPluginSmooth',
          globals: {
            overlayscrollbars: 'OverlayScrollbarsGlobal',
          },
        },
      ],
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
              main: `${fileName}.cjs.js`,
              module: `${fileName}.esm.js`,
              types: `types/${fileName}.d.ts`,
              exports: {
                '.': {
                  import: {
                    types: `./types/${fileName}.d.mts`,
                    default: `./${fileName}.mjs`,
                  },
                  require: {
                    types: `./types/${fileName}.d.cts`,
                    default: `./${fileName}.cjs`,
                  },
                  default: {
                    types: `./types/${fileName}.d.ts`,
                    default: `./${fileName}.cjs.js`,
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
  plugins: [esbuildResolve()],
});
