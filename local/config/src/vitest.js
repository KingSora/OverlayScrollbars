import { resolve } from 'node:path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const setupFileName = 'vitest.setup.js';
const include = ['test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'];
const dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  test: {
    setupFiles: resolve(dirname, setupFileName),
    environment: 'jsdom',
    include,
    coverage: {
      reportsDirectory: './.coverage/unit',
    },
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
