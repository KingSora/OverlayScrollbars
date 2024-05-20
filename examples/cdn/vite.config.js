import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    noDiscovery: true,
  },
});
