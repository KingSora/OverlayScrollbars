import { mergeConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { base } from './vite.config.base';

export default mergeConfig(base, {
  build: {
    emptyOutDir: false,
    lib: {
      formats: ['cjs'],
    },
  },
  plugins: [
    solidPlugin({
      solid: {
        generate: 'ssr',
        hydratable: true,
      },
    }),
  ],
});
