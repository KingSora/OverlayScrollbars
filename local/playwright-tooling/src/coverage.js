const fs = require('fs');
const { execSync } = require("child_process");
const { basename, dirname, join } = require('path');
const v8toIstanbul = require('v8-to-istanbul');

const tmpCoveragePath = './.coverage/.nycPlaywright';
const reportDir = './.coverage/playwright';

module.exports = {
  collectCoverage: async (coverageOutputDir, sourceDir, coverage, testfile) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const entry of coverage) {
      process.chdir(sourceDir);
      const converter = v8toIstanbul('', 0, { source: entry.source });
      // eslint-disable-next-line no-await-in-loop
      await converter.load();
      converter.applyCoverage(entry.functions);

      const coveragePath = join(
        coverageOutputDir,
        `${tmpCoveragePath}/${basename(dirname(testfile))}_${Date.now()}.json`
      );
      fs.mkdirSync(dirname(coveragePath), { recursive: true });
      fs.writeFileSync(coveragePath, JSON.stringify(converter.toIstanbul()));
    }
  },
  mergeCoverage: async () => {
    if(fs.existsSync(tmpCoveragePath)) {
      const mergeDestination = join(tmpCoveragePath, `merged_${Date.now()}.json`)
      execSync(`nyc merge ${tmpCoveragePath} ${mergeDestination}`);
      const files = fs.readdirSync(tmpCoveragePath);
      files.forEach((file) => {
        const filePath = join(tmpCoveragePath, file);
        if (filePath !== mergeDestination) {
          fs.rmSync(filePath);
        }
      });
  
      execSync(`nyc report --reporter=lcov --reporter=text --reporter=clover --reporter=json --report-dir=${reportDir} --temp-dir=${tmpCoveragePath}`, {stdio:'inherit' });
      fs.rmSync(tmpCoveragePath, { recursive: true });
    }
  }
}