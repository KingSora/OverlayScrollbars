const fs = require('fs');
const { basename, dirname, join } = require('path');
const v8toIstanbul = require('v8-to-istanbul');
const { tmpCoverageDirectory } = require('@local/config/playwright.coverage');

module.exports = async (coverageOutputDir, sourceDir, coverage, testfile) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const entry of coverage) {
    process.chdir(sourceDir);
    const converter = v8toIstanbul('', 0, { source: entry.source });
    // eslint-disable-next-line no-await-in-loop
    await converter.load();
    converter.applyCoverage(entry.functions);

    const coveragePath = join(
      coverageOutputDir,
      `${tmpCoverageDirectory}/${basename(dirname(testfile))}_${Date.now()}.json`
    );
    fs.mkdirSync(dirname(coveragePath), { recursive: true });
    fs.writeFileSync(coveragePath, JSON.stringify(converter.toIstanbul()));
  }
};
