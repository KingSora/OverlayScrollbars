import { mergeConfig } from 'vite';
import { vitestConfig, vitestDomProjectConfig } from '@~local/config/vitest';
import viteConfig from './vite.config.js';

export default mergeConfig(
  {
    ...viteConfig,
    // see https://github.com/testing-library/svelte-testing-library/issues/222
    resolve: {
      conditions: ['browser'],
    },
  },
  {
    ...vitestConfig,
    test: {
      ...vitestConfig.test,
      ...vitestDomProjectConfig.test,
      // workspaces don't work well with vite-plugin-svelte
      workspace: undefined,
    },
  }
);
