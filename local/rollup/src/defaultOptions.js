module.exports = {
  project: null,
  verbose: false,
  banner: null,
  useEsbuild: false,
  paths: {
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
