import { defineConfig } from 'vitest/config';
import { vitestConfig } from '@~local/config/vitest';

export default defineConfig({
  test: {
    ...vitestConfig.test,
  },
});
