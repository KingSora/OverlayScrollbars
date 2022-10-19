import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/overlayscrollbars-vue.ts'),
      name: 'OverlayScrollbarsVue',
      fileName: (format) => `overlayscrollbars-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        sourcemap: true,
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
  plugins: [vue()],
});
