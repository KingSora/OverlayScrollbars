#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const { join } = require('path');
const { coverageDirectory, tmpCoverageDirectory } = require('@local/config/playwright.coverage');

const mergeCoverage = async () => {
  if (fs.existsSync(tmpCoverageDirectory)) {
    const mergeDestination = join(tmpCoverageDirectory, `merged_${Date.now()}.json`);
    execSync(`nyc merge ${tmpCoverageDirectory} ${mergeDestination}`);
    const files = fs.readdirSync(tmpCoverageDirectory);
    files.forEach((file) => {
      const filePath = join(tmpCoverageDirectory, file);
      if (filePath !== mergeDestination) {
        fs.rmSync(filePath);
      }
    });

    execSync(
      `nyc report --reporter=lcov --reporter=text --reporter=clover --reporter=json --report-dir=${coverageDirectory} --temp-dir=${tmpCoverageDirectory}`,
      { stdio: 'inherit' }
    );
    fs.rmSync(tmpCoverageDirectory, { recursive: true });
  }
};

(async () => {
  try {
    await mergeCoverage();
  } catch (e) {
    console.error(`Playwright coverage couldn't be merged.`, e);
  }
})();
