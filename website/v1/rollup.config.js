module.exports = {
  context: 'this',
  input: 'index.js',
  output: {
    file: 'index.bundle.js',
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
    strict : false
  }
};