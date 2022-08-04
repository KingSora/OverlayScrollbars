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
  versions: [
    {
      format: 'cjs',
      generatedCode: 'es2015',
      outputSuffix: '.cjs',
      minifiedVersion: true,
    },
    {
      format: 'esm',
      generatedCode: 'es2015',
      outputSuffix: '.esm',
      minifiedVersion: true,
    },
  ],
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
