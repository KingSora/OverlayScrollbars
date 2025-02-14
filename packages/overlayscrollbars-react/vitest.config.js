import { mergeConfig } from 'vite';
import { vitestConfig } from '@~local/config/vitest';
import viteConfig from './vite.config.js';

export default mergeConfig(viteConfig, vitestConfig);
