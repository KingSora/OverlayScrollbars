import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import rollupPluginPackageJson from '@~local/rollup/plugin/packageJson';
import rollupPluginCopy from '@~local/rollup/plugin/copy';

const makeRegex = (dep) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj) => Object.keys(obj).map(makeRegex);

export default defineConfig({
  mode: 'lib',
  build: {
    sourcemap: true,
    outDir: 'dist',
    target: 'es2020',
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-qwik.ts'),
    },
    rollupOptions: {
      external: ['overlayscrollbars', /^node:.*/, ...excludeAll(['@builder.io/qwik'])],
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
              main: 'overlayscrollbars-qwik.qwik.cjs.js',
              module: 'overlayscrollbars-qwik.qwik.esm.js',
              types: 'types/overlayscrollbars-qwik.qwik.d.ts',
              qwik: './overlayscrollbars-qwik.qwik.mjs',
              exports: {
                '.': {
                  import: {
                    types: './types/overlayscrollbars-qwik.qwik.d.mts',
                    default: './overlayscrollbars-qwik.qwik.mjs',
                  },
                  require: {
                    types: './types/overlayscrollbars-qwik.qwik.d.cts',
                    default: './overlayscrollbars-qwik.qwik.cjs',
                  },
                  default: {
                    types: './types/overlayscrollbars-qwik.qwik.d.ts',
                    default: './overlayscrollbars-qwik.qwik.cjs.js',
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
    // workaround for: https://github.com/QwikDev/qwik/pull/6452
    (async () => {
      const qwikVitePlugin = await qwikVite();

      return {
        ...qwikVitePlugin,
        async config(config, env) {
          const result = await qwikVitePlugin.config(config, env);
          const originalOutput = result.build?.rollupOptions?.output;
          return {
            ...result,
            build: {
              ...result.build,
              rollupOptions: {
                ...result.build?.rollupOptions,
                output: [
                  {
                    format: 'es',
                    entryFileNames: 'overlayscrollbars-qwik.qwik.esm.js',
                  },
                  {
                    format: 'es',
                    entryFileNames: 'overlayscrollbars-qwik.qwik.mjs',
                  },
                  {
                    format: 'cjs',
                    entryFileNames: 'overlayscrollbars-qwik.qwik.cjs.js',
                  },
                  {
                    format: 'cjs',
                    entryFileNames: 'overlayscrollbars-qwik.qwik.cjs',
                  },
                ].map((output) => ({ ...originalOutput, ...output })),
              },
            },
          };
        },
      };
    })(),
  ],
});
