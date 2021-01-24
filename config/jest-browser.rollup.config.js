const path = require('path');

module.exports = {
  port: 8080,
  root: path.join(__dirname, '../'),
  build: '.build',
  html: {
    input: 'index.html',
    output: 'build.html',
  },
  js: {
    input: 'index.browser',
    output: 'build',
  },
  dev: {
    servePort: 18080,
    livereloadPort: 28080,
  },
};
