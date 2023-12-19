import { mergeConfig } from 'vite';
import vitestConfig from '@~local/config/vitest';
import viteConfig from './vite.config.mjs';

export default mergeConfig(viteConfig, vitestConfig);
