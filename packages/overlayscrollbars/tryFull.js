const fs = require('fs-extra');
const glob = require('glob');
const { createContext } = require('istanbul-lib-report');
const istanbulCoverage = require('istanbul-lib-coverage');
const reports = require('istanbul-reports');

/* [ Configuration ] */
const rootDir = './.coverage/';
const reportOut = './.coverage/report';

const normalizeJestCoverage = (obj) => {
  const result = { ...obj };

  Object.entries(result)
    .filter(([k, v]) => v.data)
    .forEach(([k, v]) => {
      result[k] = v.data;
    });

  return result;
};

const mergeAllReports = (coverageMap, reports) => {
  if (Array.isArray(reports) === false) {
    return;
  }

  reports.forEach((reportFile) => {
    const coverageReport = fs.readJSONSync(reportFile);
    coverageMap.merge(coverageReport);
  });
};

const findAllCoverageReports = (path, callback) => {
  glob(path, {}, (err, reports) => {
    callback(reports, err);
  });
};

const generateReport = (coverageMap, types) => {
  const reporter = createContext({
    dir: reportOut,
    coverageMap,
  });
  const report = reports.create('text');
  report.execute(reporter);
};

async function main() {
  const coverageMap = istanbulCoverage.createCoverageMap({});

  findAllCoverageReports(`${rootDir}/**/coverage-final.json`, (reports, err) => {
    if (Array.isArray(reports)) {
      mergeAllReports(coverageMap, reports);
      generateReport(coverageMap, ['text']);
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
