import { resolve } from 'node:path';
import ts from 'typescript';
import { defineConfig } from 'vite';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import solidPlugin from 'vite-plugin-solid';
import rollupPluginPackageJson from '@~local/rollup/plugin/packageJson';
import rollupPluginCopy from '@~local/rollup/plugin/copy';

const entry = resolve(__dirname, 'src/overlayscrollbars-solid.ts');

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry,
      formats: ['es', 'cjs'],
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
              exports: {
                '.': {
                  types: './types/overlayscrollbars-solid.d.ts',
                  solid: './source/overlayscrollbars-solid.js',
                  import: './overlayscrollbars-solid.es.js',
                  browser: './overlayscrollbars-solid.es.js',
                  require: './overlayscrollbars-solid.cjs.js',
                  node: './overlayscrollbars-solid.cjs.js',
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
    esbuildResolve(),
    solidPlugin({
      solid: {
        generate: 'dom',
        hydratable: true,
      },
    }),
    {
      name: 'ts',
      closeBundle() {
        const program = ts.createProgram([entry], {
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          jsx: ts.JsxEmit.Preserve,
          jsxImportSource: 'solid-js',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          outDir: `dist/source`,
          declarationDir: `dist/types`,
          declaration: true,
          allowJs: true,
        });

        program.emit();
      },
    },
  ],
});
