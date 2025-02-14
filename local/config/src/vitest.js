import { resolve } from 'node:path';
import { fileURLToPath } from 'url';
import { defineProject, defineConfig } from 'vitest/config';
import { vitestCoverage } from './vitest-coverage.js';

const testDirName = 'test';
const testFileSuffix = 'test';
const dirname = fileURLToPath(new URL('.', import.meta.url));
const getInclude = (environment) => [
  `${testDirName}/${environment}/**/*.${testFileSuffix}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`,
];
const shared = {
  poolOptions: {
    forks: {
      singleFork: true,
    },
  },
};

export const vitestNodeProjectConfig = defineProject({
  test: {
    name: 'node',
    setupFiles: resolve(dirname, 'vitest-setup.node.js'),
    include: getInclude('node'),
    environment: 'node',
    ...shared,
  },
});

export const vitestDomProjectConfig = defineProject({
  test: {
    name: 'dom',
    setupFiles: resolve(dirname, 'vitest-setup.dom.js'),
    include: getInclude('dom'),
    environment: 'jsdom',
    ...shared,
  },
});

export const vitestConfig = defineConfig({
  test: {
    coverage: {
      reportsDirectory: vitestCoverage.coverageDirectory,
    },
    workspace: [vitestNodeProjectConfig, vitestDomProjectConfig],
  },
});
