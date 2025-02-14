import path from 'path';
import fs from 'node:fs';
import { describe, test, beforeAll, afterAll, expect } from 'vitest';
import { rollup } from 'rollup';
import { webpack } from 'webpack';
import { build } from 'esbuild';
import terser from '@rollup/plugin-terser';

const cleanBundle = true;
const cleanFixture = true;
const expectedBundleDiff = 2000;

const normalizePath = (pathName: string) =>
  pathName ? pathName.split(path.sep).join(path.posix.sep) : pathName;

const fixturesDir = path.join(__dirname, '.fixtures');
const libraryFixturePath = normalizePath(path.join(fixturesDir, 'lib.js'));
const normalFixturePath = normalizePath(path.join(fixturesDir, 'normal.js'));
const treeshakedFixturePath = normalizePath(path.join(fixturesDir, 'treeshaked.js'));

const unshakedFixtureContent = `
  export * as os from '${libraryFixturePath}';
`;

const shakedFixtureContent = `
  export { OverlayScrollbars } from '${libraryFixturePath}';
`;

const bundleFunctions = {
  webpack: async (input: string, output: string) => {
    const outputPath = path.dirname(output);
    const outputfilename = path.basename(output);
    const compiler = webpack({
      mode: 'production',
      entry: input,
      output: {
        path: outputPath,
        filename: outputfilename,
        library: 'treeshaking',
      },
      optimization: {
        minimize: true,
      },
    });

    const result = (await new Promise((resolve, reject) => {
      compiler.run((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    })) as any;

    return result.compilation.assetsInfo.get(outputfilename).size;
  },
  rollup: async (input: string, output: string) => {
    const config: any = {
      input,
      output: {
        format: 'iife',
        name: 'treeshaking',
        file: output,
        plugins: [terser()],
      },
    };
    const bundle = await rollup(config);
    await bundle.write(config.output);

    return fs.statSync(config.output.file).size;
  },
  esbuild: async (input: string, output: string) => {
    await build({
      entryPoints: [input],
      outfile: output,
      format: 'iife',
      globalName: 'treeshaking',
      bundle: true,
      minify: true,
      treeShaking: true,
    });

    return fs.statSync(output).size;
  },
};

const testBundler = (bundlerName: keyof typeof bundleFunctions) => async () => {
  const bundleFunction = bundleFunctions[bundlerName];
  const outputDir = path.join(fixturesDir, `.${bundlerName}`);
  const normal = await bundleFunction(
    normalFixturePath,
    path.join(outputDir, path.basename(normalFixturePath))
  );
  const treeshaked = await bundleFunction(
    treeshakedFixturePath,
    path.join(outputDir, path.basename(treeshakedFixturePath))
  );

  if (cleanBundle) {
    fs.rmSync(outputDir, { recursive: true });
  }

  console.info(`${bundlerName} size`, {
    normal,
    treeshaked,
    diff: normal - treeshaked,
  });

  expect(normal - treeshaked).toBeGreaterThan(expectedBundleDiff);
};

describe('tree shaking', () => {
  // build the fixture
  beforeAll(async () => {
    // @ts-ignore
    const rollupConfig = (await import('../../src/../rollup.config')).default;
    const config = rollupConfig.find((inputConfig: any) => {
      const { output } = inputConfig;
      if (output) {
        const outputArr = Array.isArray(output) ? output : [output];
        const outputConfig = outputArr.find(
          ({ file }) => file && path.basename(file) === 'overlayscrollbars.esm.js'
        );
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

    fs.writeFileSync(normalFixturePath, unshakedFixtureContent);
    fs.writeFileSync(treeshakedFixturePath, shakedFixtureContent);
  }, 60000 * 2);

  // clean the fixture
  afterAll(() => {
    if (cleanFixture) {
      fs.rmSync(fixturesDir, { recursive: true });
    }
  });

  test('webpack', testBundler('webpack'), 60000);

  test('rollup', testBundler('rollup'), 60000);

  test('esbuild', testBundler('esbuild'), 60000);
});
