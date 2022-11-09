import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import react from '@vitejs/plugin-react';
import rollupPluginPackageJson from '@~local/rollup/plugin/packageJson';
import rollupPluginCopy from '@~local/rollup/plugin/copy';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-react.ts'),
      name: 'OverlayScrollbarsReact',
      fileName: (format) => `overlayscrollbars-react.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'overlayscrollbars'],
      output: {
        globals: {
          react: 'React',
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
              main: 'overlayscrollbars-react.umd.js',
              module: 'overlayscrollbars-react.es.js',
              types: 'types/overlayscrollbars-react.d.ts',
              peerDependencies,
              sideEffects: false,
            };
          },
        }),
      ],
    },
  },
  plugins: [esbuildResolve(), react({ jsxRuntime: 'classic' })],
});
