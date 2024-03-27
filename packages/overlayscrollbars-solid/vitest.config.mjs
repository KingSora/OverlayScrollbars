import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';
import vitestConfig from '@~local/config/vitest';
import viteConfig from './vite.config.mjs';

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
      environmentMatchGlobs: [
        ['test/body/*', fileURLToPath(import.meta.resolve('@~local/config/vitest.new-jsdom.env'))],
      ],
    },
  }
);
