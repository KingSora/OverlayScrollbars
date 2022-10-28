import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import react from '@vitejs/plugin-react';

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
    },
  },
  plugins: [esbuildResolve(), react({ jsxRuntime: 'classic' })],
});
