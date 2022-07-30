#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const { join, dirname, basename } = require('path');
const { coverageDirectory, tmpCoverageDirectory } = require('@local/config/full-coverage');
const { coverageDirectory: playwrightCoverage } = require('@local/config/playwright.coverage');
const { coverageDirectory: jestCoverage } = require('@local/config/jest');

const reportFileName = 'coverage-final.json';

const copyReportFile = (path) => {
  if (fs.existsSync(path)) {
    if (!fs.existsSync(tmpCoverageDirectory)) {
      fs.mkdirSync(tmpCoverageDirectory);
    }
    fs.copyFileSync(
      path,
      join(tmpCoverageDirectory, `${basename(dirname(path))}_${Date.now()}.json`)
    );
  }
};

const generateFullCoverage = async () => {
  copyReportFile(join(playwrightCoverage, reportFileName));
  copyReportFile(join(jestCoverage, reportFileName));

  const mergeDestination = join(tmpCoverageDirectory, `full_${Date.now()}.json`);
  execSync(`nyc merge ${tmpCoverageDirectory} ${mergeDestination}`);

  const files = fs.readdirSync(tmpCoverageDirectory);
  files.forEach((file) => {
    const filePath = join(tmpCoverageDirectory, file);
    if (filePath !== mergeDestination) {
      fs.rmSync(filePath);
    }
  });

  execSync(
    `nyc report --reporter=lcov --reporter=clover --reporter=json --report-dir=${coverageDirectory} --temp-dir=${tmpCoverageDirectory}`
    /* { stdio: 'inherit' } */
  );
  fs.rmSync(tmpCoverageDirectory, { recursive: true });
};

(async () => {
  try {
    await generateFullCoverage();
  } catch (e) {
    console.error(`Full coverage couldn't be generated.`, e);
  }
})();
