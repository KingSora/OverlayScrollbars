import { mergeConfig } from 'vite';
import { vitestConfig, vitestDomProjectConfig } from '@~local/config/vitest';
import viteConfig from './vite.config.js';

export default mergeConfig(viteConfig, {
  ...vitestConfig,
  test: {
    ...vitestConfig.test,
    ...vitestDomProjectConfig.test,
    // workspaces don't work well with vite-plugin-vue
    workspace: undefined,
  },
});
