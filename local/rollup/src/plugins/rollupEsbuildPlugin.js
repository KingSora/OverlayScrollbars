import { extname } from 'node:path';
import { transform } from 'esbuild';
import { createFilter } from '@rollup/pluginutils';

const defaultLoader = {
  '.js': 'js',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
};

export const rollupEsbuildPlugin = ({ include, exclude, ...esbuildOptions } = {}) => {
  const extensions = Object.keys(defaultLoader);
  const INCLUDE_REGEXP = new RegExp(`\\.(${extensions.map((ext) => ext.slice(1)).join('|')})$`);
  const EXCLUDE_REGEXP = /node_modules/;
  const filter = createFilter(include || INCLUDE_REGEXP, exclude || EXCLUDE_REGEXP);

  return {
    name: 'esbuild',
    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const ext = extname(id);
      const loader = defaultLoader[ext];

      if (!loader) {
        return null;
      }

      const result = await transform(code, {
        sourcefile: id,
        loader,
        ...esbuildOptions,
      });

      return (
        result.code && {
          code: result.code,
          map: result.map || null,
        }
      );
    },
  };
};
