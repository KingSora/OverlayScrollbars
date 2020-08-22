const resolve = require('./resolve.config');

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const base = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleDirectories: resolve.directories,
  moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  verbose: true,
};

module.exports = {
  projects: [
    {
      ...base,
      displayName: 'jsdom',
    },
    // {
    //   ...base,
    //   displayName: 'puppeteer',
    //   globalSetup: './puppeteer.setup.js',
    //   globalTeardown: './puppeteer.teardown.js',
    //   testEnvironment: './puppeteer.env.js',
    //   testMatch: ['**/tests/puppeteer/**/*.[jt]s?(x)'],
    //   transform: {
    //     '^.+\\.[jt]sx?$': 'babel-jest',
    //     '^.+\\.html?$': './jest.html.loader.js',
    //   },
    //   globals: {
    //     async createPage(glob, html, funcs) {
    //       const page = await glob.__BROWSER__.newPage();
    //       await page.exposeFunction('evalVar', funcs);
    //       await page.setContent(fs.readFileSync('./puppeteer.html', 'utf8').replace('{{content}}', html));
    //       return page;
    //     },
    //   },
    // },
  ],
};
