import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import rollupTypescript from 'rollup-plugin-typescript2';
import rollupPrettier from 'rollup-plugin-prettier';
import rollupBabelPlugin from '@rollup/plugin-babel';
import { terser as rollupTerser } from 'rollup-plugin-terser';
import del from 'del';
import fs from 'fs';
import path from 'path';
import resolve from './resolve.config.json';

const projectRootPath = './packages';
const buildConfigNames = ['build.config.js', 'build.config.json'];

const legacyBabelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        targets: {
          ie: '11',
        },
      },
    ],
  ],
};

const esmBabelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        bugfixes: true,
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
};

const getBuildConfig = (projectPath) => {
  const buildConfigName = buildConfigNames.find((name) => fs.existsSync(path.resolve(projectPath, name)));
  return buildConfigName ? path.resolve(projectPath, buildConfigName) : '';
};

export default async (config, overwriteBuildConfig) => {
  const { 'config-project': project } = config;

  const defaultInputName = './src/index';
  const projectPath = path.resolve(__dirname, projectRootPath, project);
  const packageJSONPath = path.resolve(projectPath, 'package.json');
  const tsconfigJSONPath = path.resolve(projectPath, 'tsconfig.json');
  const buildConfigPath = getBuildConfig(projectPath);
  const isTypeScriptProject = fs.existsSync(tsconfigJSONPath);
  const buildConfigDefaults = {
    input: defaultInputName + resolve.extensions.find((ext) => fs.existsSync(path.resolve(projectPath, `${defaultInputName}${ext}`))),
    src: './src',
    dist: './dist',
    types: './types',
    tests: './tests',
    cache: [],
    minVersions: true,
    sourcemap: true,
    esmBuild: true,
    name: project,
    exports: 'auto',
  };
  const buildConfig = {
    ...buildConfigDefaults,
    ...(await import(buildConfigPath)),
    ...(overwriteBuildConfig || {}),
  };

  const { input, src, dist, types, tests, cache, minVersions, sourcemap, esmBuild, name, exports, globals } = buildConfig;
  const { devDependencies = {}, peerDependencies = {} } = await import(packageJSONPath);

  const srcPath = src ? path.resolve(projectPath, src) : null;
  const distPath = dist ? path.resolve(projectPath, dist) : null;
  const typesPath = types ? path.resolve(projectPath, types) : null;
  const testsPath = tests ? path.resolve(projectPath, tests) : null;
  const inputPath = input ? path.resolve(projectPath, input) : null;

  const genOutputConfig = (esm) => ({
    format: esm ? 'esm' : 'umd',
    file: path.resolve(distPath, `${project}${esm ? '.esm' : ''}.js`),
    sourcemap,
    ...(esm
      ? {}
      : {
          name,
          globals,
          exports,
        }),
    plugins: [
      rollupPrettier({
        sourcemap: sourcemap && 'silent',
      }),
    ],
  });

  const genConfig = async ({ esm, typeDeclaration }) => {
    const output = genOutputConfig(esm);
    return {
      input: inputPath,
      output: [output].concat(
        minVersions
          ? {
              ...output,
              compact: true,
              file: output.file.replace('.js', '.min.js'),
              sourcemap: false,
              plugins: [
                ...(output.plugins || []),
                rollupTerser({
                  ecma: 8,
                  safari10: true,
                }),
              ],
            }
          : []
      ),
      external: [...Object.keys(devDependencies), ...Object.keys(peerDependencies)],
      plugins: [
        rollupResolve({
          extensions: resolve.extensions,
          rootDir: srcPath,
          customResolveOptions: {
            moduleDirectory: [...resolve.directories.map((dir) => path.resolve(projectPath, dir)), path.resolve(__dirname, 'node_modules')],
          },
        }),
        rollupCommonjs(),
        isTypeScriptProject
          ? rollupTypescript({
              check: true,
              useTsconfigDeclarationDir: true,
              tsconfig: tsconfigJSONPath,
              tsconfigOverride: {
                compilerOptions: {
                  target: 'ESNext',
                  sourceMap: true,
                  declaration: typeDeclaration && types !== null,
                  declarationDir: typesPath,
                },
                exclude: ((await import(tsconfigJSONPath)).exclude || []).concat(testsPath),
              },
            })
          : {},
        rollupBabelPlugin({
          ...(esm ? esmBabelConfig : legacyBabelConfig),
          babelHelpers: 'runtime',
          extensions: resolve.extensions,
        }),
      ],
    };
  };

  console.log('');
  console.log('PROJECT : ', project);
  console.log('ENV     : ', process.env.NODE_ENV);
  console.log('CONFIG  : ', buildConfig);

  const legacy = await genConfig({ esm: false, typeDeclaration: true });
  const esm = esmBuild ? await genConfig({ esm: true, typeDeclaration: false }) : null;

  const builds = [legacy, esm]
    .filter((build) => build !== null)
    .map((build, index, buildsArr) => {
      const isFirst = index === 0;
      const isLast = index === buildsArr.length - 1;

      if (isFirst) {
        build.plugins.unshift({
          name: 'deleteGeneratedDirs',
          options() {
            const deletedDirs = del.sync([distPath, typesPath].filter((curr) => curr !== null));
            if (deletedDirs.length > 0) {
              console.log('Deleted directories:\n', deletedDirs.join('\n'));
            }
          },
        });
      }
      if (isLast) {
        build.plugins.unshift({
          name: 'deleteCacheDirs',
          writeBundle() {
            const cacheDirs = cache.map((dir) => path.resolve(projectPath, dir));
            const deletedDirs = del.sync(cacheDirs);
            if (deletedDirs.length > 0) {
              console.log('Deleted cache:\n', deletedDirs.join('\n'));
            }
          },
        });
      }

      return build;
    });

  return builds;
};
