import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    exclude: ['overlayscrollbars', 'overlayscrollbars-react'],
  },
  plugins: [react()],
});
