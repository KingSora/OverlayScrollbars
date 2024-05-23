import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    exclude: ['overlayscrollbars', 'overlayscrollbars-svelte'],
  },
  plugins: [svelte()],
});
