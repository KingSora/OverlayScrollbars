import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    exclude: ['overlayscrollbars', 'overlayscrollbars-solid'],
  },
  plugins: [solidPlugin()],
});
