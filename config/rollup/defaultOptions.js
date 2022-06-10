module.exports = {
  project: null,
  mode: 'build',
  paths: {
    src: './src',
    dist: './dist',
    types: './types',
  },
  versions: {
    minified: true,
    module: true,
  },
  alias: {},
  rollup: {
    input: './src/index',
    output: {
      sourcemap: true,
      exports: 'auto',
    },
  },
};
