import fs from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { playwrightCoverage } from '@~local/config/playwright-coverage';

const { tmpCoverageDirectory } = playwrightCoverage;

export default async (coverageOutputDir, coverage, testfile) => {
  if (coverage) {
    const coveragePath = join(
      coverageOutputDir,
      `${tmpCoverageDirectory}/${basename(dirname(testfile))}_${Date.now()}.json`
    );
    fs.mkdirSync(dirname(coveragePath), { recursive: true });
    fs.writeFileSync(coveragePath, coverage);
  }
};
