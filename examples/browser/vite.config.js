import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    exclude: ['overlayscrollbars'],
  },
});
