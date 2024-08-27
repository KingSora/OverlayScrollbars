import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { rollupPackageJsonPlugin } from '@~local/rollup/plugin/rollupPackageJsonPlugin';
import { rollupCopyPlugin } from '@~local/rollup/plugin/rollupCopyPlugin';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-react.ts'),
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'overlayscrollbars'],
      output: [
        {
          format: 'es',
          entryFileNames: 'overlayscrollbars-react.esm.js',
        },
        {
          format: 'es',
          entryFileNames: 'overlayscrollbars-react.mjs',
        },
        {
          format: 'cjs',
          entryFileNames: 'overlayscrollbars-react.cjs.js',
        },
        {
          format: 'cjs',
          entryFileNames: 'overlayscrollbars-react.cjs',
        },
        {
          format: 'umd',
          name: 'OverlayScrollbarsReact',
          globals: {
            react: 'React',
            overlayscrollbars: 'OverlayScrollbarsGlobal',
          },
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
              main: 'overlayscrollbars-react.cjs.js',
              module: 'overlayscrollbars-react.esm.js',
              types: 'types/overlayscrollbars-react.d.ts',
              exports: {
                '.': {
                  import: {
                    types: './types/overlayscrollbars-react.d.mts',
                    default: './overlayscrollbars-react.mjs',
                  },
                  require: {
                    types: './types/overlayscrollbars-react.d.cts',
                    default: './overlayscrollbars-react.cjs',
                  },
                  default: {
                    types: './types/overlayscrollbars-react.d.ts',
                    default: './overlayscrollbars-react.cjs.js',
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
  plugins: [react(process.env.VITEST ? { jsxRuntime: 'automatic' } : { jsxRuntime: 'classic' })],
});
