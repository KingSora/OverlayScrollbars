import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-react.ts'),
      name: 'OverlayScrollbarsReact',
      fileName: (format) => `overlayscrollbars-react.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        sourcemap: true,
        dir: 'dist',
        globals: {
          react: 'React',
        },
      },
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react({ jsxRuntime: 'classic' })],
});
