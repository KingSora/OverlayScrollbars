import { mergeConfig } from 'vite';
import vitestConfig from '@~local/config/vitest';
import viteConfig from './vite.config';

export default mergeConfig(
  {
    ...viteConfig,
    resolve: {
      conditions: ['development', 'browser'],
    },
  },
  {
    test: {
      ...vitestConfig.test,
      server: {
        deps: {
          inline: [/solid-testing-library/],
        },
      },
    },
  }
);
