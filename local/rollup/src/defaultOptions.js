module.exports = {
  project: null,
  mode: 'build',
  verbose: false,
  banner: null,
  paths: {
    src: './src',
    dist: './dist',
    types: './types',
    styles: './styles',
  },
  versions: {
    minified: true,
    module: true,
  },
  extractStyles: false,
  extractTypes: false,
  alias: {},
  rollup: {
    input: './src/index',
    output: {
      sourcemap: false,
      exports: 'auto',
    },
  },
};
