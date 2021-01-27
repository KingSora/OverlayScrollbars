const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const del = require('del');
const { globalTeardown } = require('jest-playwright-preset');

const coverageTempDir = './.nyc_output';
const coverageTempDirFile = 'coverage.json';
const reportDir = './.coverage/browser';

module.exports = async (jestConfig) => {
  await globalTeardown(jestConfig);

  const { rootDir } = jestConfig;
  const coverageTempDirPath = path.resolve(rootDir, coverageTempDir);
  const coverageTempFilePath = path.resolve(coverageTempDirPath, coverageTempDirFile);
  const reportDirPath = path.resolve(rootDir, reportDir);

  if (fs.existsSync(coverageTempFilePath)) {
    const coverageReportText = ' COVERAGE ';

    console.log('');
    console.log(`\x1b[1m\x1b[44m${coverageReportText}\x1b[0m`);
    console.log(`Reporting from: "${path.relative(rootDir, coverageTempFilePath)}" in "${path.relative(rootDir, reportDirPath)}"`);

    del.sync(reportDirPath);
    execSync(`npx nyc report --reporter=lcov --report-dir=${reportDir}`, {
      cwd: rootDir,
    });

    const [deletedTempDir] = del.sync(coverageTempDirPath);
    if (deletedTempDir) {
      console.log('Deleted:', path.relative(rootDir, deletedTempDir));
    }
  }
};
