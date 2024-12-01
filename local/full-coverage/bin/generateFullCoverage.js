#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import fullCoverageConfig from '@~local/config/full-coverage';
import playwrightCoverageConfig from '@~local/config/playwright.coverage';
import jestCoverageConfig from '@~local/config/jest';

const { coverageDirectory, tmpCoverageDirectory } = fullCoverageConfig;
const { coverageDirectory: playwrightCoverage } = playwrightCoverageConfig;
const { coverageDirectory: jestCoverage } = jestCoverageConfig;

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
    return true;
  }
  return false;
};

const generateFullCoverage = async () => {
  const copiedPlaywright = copyReportFile(join(playwrightCoverage, reportFileName));
  const copiedJest = copyReportFile(join(jestCoverage, reportFileName));

  if (copiedPlaywright || copiedJest) {
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
  }
};

(async () => {
  try {
    await generateFullCoverage();
  } catch (e) {
    // console.error(`Full coverage couldn't be generated.`, e);
    if (fs.existsSync(tmpCoverageDirectory)) {
      fs.rmSync(tmpCoverageDirectory, { recursive: true });
    }
  }
})();
