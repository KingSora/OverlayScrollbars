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
        exclude: ['**/Test.svelte'],
      },
    },
  }
);
