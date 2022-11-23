import { mergeConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { base } from './vite.config.base';

export default mergeConfig(base, {
  build: {
    lib: {
      formats: ['es'],
    },
  },
  plugins: [
    solidPlugin({
      solid: {
        generate: 'dom',
        hydratable: true,
      },
    }),
  ],
});
