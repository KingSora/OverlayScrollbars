import { resolve } from 'node:path';
import ts from 'typescript';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { rollupPackageJsonPlugin } from '@~local/rollup/plugin/rollupPackageJsonPlugin';
import { rollupCopyPlugin } from '@~local/rollup/plugin/rollupCopyPlugin';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-solid.ts'),
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'solid-js/store', 'overlayscrollbars'],
      output: [
        {
          format: 'es',
          entryFileNames: 'overlayscrollbars-solid.esm.js',
        },
        {
          format: 'es',
          entryFileNames: 'overlayscrollbars-solid.mjs',
        },
        {
          format: 'cjs',
          entryFileNames: 'overlayscrollbars-solid.cjs.js',
        },
        {
          format: 'cjs',
          entryFileNames: 'overlayscrollbars-solid.cjs',
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
              main: 'overlayscrollbars-solid.cjs.js',
              module: 'overlayscrollbars-solid.esm.js',
              types: 'types/overlayscrollbars-solid.d.ts',
              exports: {
                '.': {
                  solid: {
                    types: './types/overlayscrollbars-solid.d.ts',
                    default: './source/overlayscrollbars-solid.js',
                  },
                  import: {
                    types: './types/overlayscrollbars-solid.d.mts',
                    default: './overlayscrollbars-solid.mjs',
                  },
                  require: {
                    types: './types/overlayscrollbars-solid.d.cts',
                    default: './overlayscrollbars-solid.cjs',
                  },
                  browser: './overlayscrollbars-solid.esm.js',
                  node: './overlayscrollbars-solid.cjs.js',
                  default: {
                    types: './types/overlayscrollbars-solid.d.ts',
                    default: './overlayscrollbars-solid.cjs.js',
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
    solidPlugin({
      solid: {
        generate: 'dom',
        hydratable: true,
      },
    }),
    {
      name: 'ts',
      closeBundle() {
        if (process.env.VITEST) {
          return;
        }
        const program = ts.createProgram(
          [
            resolve(__dirname, 'src/overlayscrollbars-solid.ts'),
            resolve(__dirname, 'src/overlayscrollbars-solid.mts'),
            resolve(__dirname, 'src/overlayscrollbars-solid.cts'),
          ],
          {
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.Node10,
            jsx: ts.JsxEmit.Preserve,
            jsxImportSource: 'solid-js',
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            outDir: `dist/source`,
            declarationDir: `dist/types`,
            declaration: true,
            allowJs: true,
          }
        );

        program.emit();
      },
    },
  ],
});
