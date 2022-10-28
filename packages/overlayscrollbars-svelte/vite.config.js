import { defineConfig } from 'vitest/config';
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// only used for tests
export default defineConfig({
  plugins: [esbuildResolve(), svelte()],
});
