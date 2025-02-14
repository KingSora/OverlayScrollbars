#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import { fullCoverage } from '@~local/config/full-coverage';
import { playwrightCoverage } from '@~local/config/playwright-coverage';
import { vitestCoverage } from '@~local/config/vitest-coverage';

const { coverageDirectory, tmpCoverageDirectory } = fullCoverage;
const { coverageDirectory: playwrightCoverageDirectory } = playwrightCoverage;
const { coverageDirectory: vitestCoverageDirectory } = vitestCoverage;

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
  const copiedPlaywright = copyReportFile(join(playwrightCoverageDirectory, reportFileName));
  const copiedUnit = copyReportFile(join(vitestCoverageDirectory, reportFileName));

  if (copiedPlaywright || copiedUnit) {
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
    console.error(`Full coverage couldn't be generated.`, e);

    if (fs.existsSync(tmpCoverageDirectory)) {
      fs.rmSync(tmpCoverageDirectory, { recursive: true });
    }
  }
})();
