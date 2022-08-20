const fs = require('fs');
const { basename, dirname, join } = require('path');
const { tmpCoverageDirectory } = require('@~local/config/playwright.coverage');

module.exports = async (coverageOutputDir, coverage, testfile) => {
  if (coverage) {
    // eslint-disable-next-line no-restricted-syntax
    const coveragePath = join(
      coverageOutputDir,
      `${tmpCoverageDirectory}/${basename(dirname(testfile))}_${Date.now()}.json`
    );
    fs.mkdirSync(dirname(coveragePath), { recursive: true });
    fs.writeFileSync(coveragePath, coverage);
  }
};
