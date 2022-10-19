import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'OverlayScrollbarsVue',
      fileName: (format) => `overlayscrollbars-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        dir: 'dist',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [vue2()],
});
