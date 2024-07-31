const fs = require('fs');
const { basename, dirname, join } = require('path');

module.exports = async (coverageOutputDir, coverage, testfile) => {
  const { tmpCoverageDirectory } = (await import('@~local/config/playwright.coverage')).default;
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
