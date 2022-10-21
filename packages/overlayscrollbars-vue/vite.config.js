import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/overlayscrollbars-vue.ts'),
      name: 'OverlayScrollbarsVue',
      fileName: (format) => `overlayscrollbars-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
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
