import { mergeConfig } from 'vite';
import vitestConfig from '@~local/config/vitest';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, {
  test: {
    ...vitestConfig.test,
    coverage: {
      ...vitestConfig.test.coverage,
      exclude: [...vitestConfig.test.coverage.exclude, '**/Test.svelte'],
    },
  },
});
