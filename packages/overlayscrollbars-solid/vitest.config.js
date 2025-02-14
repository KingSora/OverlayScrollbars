import { mergeConfig } from 'vite';
import { vitestDomProjectConfig, vitestConfig } from '@~local/config/vitest';
import viteConfig from './vite.config.js';

export default mergeConfig(
  {
    ...viteConfig,
    resolve: {
      conditions: ['development', 'browser'],
    },
  },
  {
    ...vitestConfig,
    test: {
      ...vitestConfig.test,
      ...vitestDomProjectConfig.test,
      // workspaces don't work well with vite-plugin-solid
      workspace: undefined,
    },
  }
);
