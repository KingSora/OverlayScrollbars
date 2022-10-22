import path from 'path';
import fs from 'node:fs';
import { rollup } from 'rollup';

// @ts-ignore
import pkg from '~/../package.json';
// @ts-ignore
import rollupConfig from '~/../rollup.config';

const cleanBundle = true;
const cleanFixture = true;
const expectedBundleDiff = 2300;

const fixturesDir = path.join(__dirname, '.moduleTypeFixtures');
const libraryFixturePath = path.join(fixturesDir, 'lib.js');
const modulePkgJson = {
  version: '0.0.0',
  type: 'module',
};
const commonPkgJson = {
  version: '0.0.0',
  type: 'commonjs',
};

describe('module type', () => {
  // build the fixture
  beforeAll(async () => {
    const { module } = pkg;
    const esmEntryFilename = path.basename(module);
    const config = rollupConfig.find((inputConfig: any) => {
      const { output } = inputConfig;
      if (output) {
        const outputArr = Array.isArray(output) ? output : [output];
        const outputConfig = outputArr.find(({ file }) => path.basename(file) === esmEntryFilename);
        if (outputConfig) {
          inputConfig.output = outputConfig;
          inputConfig.output.sourcemap = false;
          inputConfig.output.file = libraryFixturePath;
          inputConfig.plugins = inputConfig.plugins.filter(
            (plugin: any) => plugin.name !== 'PROJECT'
          );
          return true;
        }
      }
      return false;
    });

    const bundle = await rollup(config);
    await bundle.write(config.output);

    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir);
    }

    // fs.writeFileSync(normalFixturePath, unshakedFixtureContent);
    // fs.writeFileSync(treeshakedFixturePath, shakedFixtureContent);
  }, 60000 * 2);

  // clean the fixture
  afterAll(() => {
    // cleanFixture && fs.rmSync(fixturesDir, { recursive: true });
  });

  test('esbuild', () => {
    console.log('hi');
  }, 60000);
});
