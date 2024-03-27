import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';
import vitestConfig from '@~local/config/vitest';
import viteConfig from './vite.config.mjs';

export default mergeConfig(
  {
    ...viteConfig,
    // see https://github.com/testing-library/svelte-testing-library/issues/222
    resolve: {
      conditions: ['browser'],
    },
  },
  {
    test: {
      ...vitestConfig.test,
      coverage: {
        ...vitestConfig.test.coverage,
        exclude: [
          'env.d.ts',
          'svelte.config.js',
          '**/.svelte-kit/**/*',
          '**/Test.svelte',
          '**/OverlayScrollbarsComponent.types.ts',
        ],
      },
      environmentMatchGlobs: [
        ['test/body/*', fileURLToPath(import.meta.resolve('@~local/config/vitest.new-jsdom.env'))],
      ],
    },
  }
);
