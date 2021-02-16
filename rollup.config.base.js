const { nodeResolve: rollupResolve } = require('@rollup/plugin-node-resolve');
const { babel: rollupBabelInputPlugin, createBabelInputPluginFactory } = require('@rollup/plugin-babel');
const { terser: rollupTerser } = require('rollup-plugin-terser');
const rollupInject = require('@rollup/plugin-inject');
const rollupCommonjs = require('@rollup/plugin-commonjs');
const rollupTypescript = require('rollup-plugin-typescript2');
const rollupPrettier = require('rollup-plugin-prettier');
const del = require('del');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const resolve = require('./resolve.config.json');

const isTestEnv = process.env.NODE_ENV === 'test';
const sizeSnapshotFilename = 'rollup.sizeSnapshot.json';

const rollupConfigDefaults = {
  input: './src/index',
  src: './src',
  dist: './dist',
  types: './types',
  tests: './tests',
  cache: [],
  minVersions: true,
  sourcemap: true,
  esmBuild: true,
  exports: 'auto',
  pipeline: ['typescript', 'resolve', 'inject', 'commonjs', 'babel'],
};
const legacyBabelConfig = {
  exclude: isTestEnv ? [/\/core-js\//] : [], // /\/@testing-library\//
  presets: [
    [
      '@babel/preset-env',
      {
        ...(isTestEnv ? { useBuiltIns: 'usage', corejs: { version: 3, proposals: true } } : {}),
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

// workaround for https://github.com/rollup/plugins/issues/774
const rollupBabelIstanbulSourceMaps = {};
const rollupBabelIstanbulGenerateKey = (filename) => (filename ? filename.replace(/[\\/]+/g, '') : '');
const rollupBabelPlugin = isTestEnv
  ? createBabelInputPluginFactory(() => {
      return {
        config(cfg) {
          const { options } = cfg;
          const { filename, plugins } = options;
          const istanbulSourceMap = rollupBabelIstanbulSourceMaps[rollupBabelIstanbulGenerateKey(filename)];

          if (istanbulSourceMap) {
            return {
              ...options,
              plugins: [
                ...(plugins || []),
                [
                  'babel-plugin-istanbul',
                  {
                    useInlineSourceMaps: false,
                    inputSourceMap: istanbulSourceMap,
                  },
                ],
              ],
            };
          } else {
            return options;
          }
        },
      };
    })
  : rollupBabelInputPlugin;

const readFilesStats = (dir, extensions = ['.js', '.css']) => {
  const result = {};
  if (fs.existsSync(dir)) {
    const distFiles = fs.readdirSync(dir);
    distFiles.forEach((file) => {
      if (extensions.includes(path.extname(file))) {
        const stats = fs.lstatSync(path.resolve(dir, file));
        if (stats.isFile()) {
          result[path.basename(file)] = stats.size;
        }
      }
    });
  }
  return result;
};

const normalizePath = (pathName) => (pathName ? pathName.split(path.sep).join(path.posix.sep) : pathName);

const appendExtension = (file) =>
  path.extname(file) === '' ? file + resolve.extensions.find((ext) => fs.existsSync(path.resolve(`${file}${ext}`))) : file;

const resolvePath = (basePath, pathToResolve, appendExt) => {
  const result = pathToResolve ? (path.isAbsolute(pathToResolve) ? pathToResolve : path.resolve(basePath, pathToResolve)) : null;
  return result && appendExt ? appendExtension(result) : result;
};

const resolveConfig = (config, userConfig) => {
  if (typeof config === 'function') {
    return (
      config({
        defaultConfig: rollupConfigDefaults,
        legacyBabelConfig,
        esmBabelConfig,
        userConfig,
      }) || {}
    );
  }
  return config;
};

const rollupConfig = (config = {}, { project = process.cwd(), overwrite = {}, silent, fast } = {}) => {
  const projectPath = resolvePath(__dirname, project);
  const relativeBackPath = path.relative(projectPath, __dirname);
  const projectName = path.basename(project);

  const packageJSONPath = resolvePath(projectPath, 'package.json');
  const tsconfigJSONPath = resolvePath(projectPath, 'tsconfig.json');

  const isTypeScriptProject = fs.existsSync(tsconfigJSONPath);
  const userConfig = resolveConfig(config);
  const overwriteConfig = resolveConfig(overwrite, userConfig);
  const buildConfig = {
    ...rollupConfigDefaults,
    ...{ name: projectName, file: projectName },
    ...userConfig,
    ...overwriteConfig,
  };

  const {
    input,
    src,
    dist,
    types,
    tests,
    file,
    cache,
    minVersions,
    sourcemap,
    esmBuild,
    name,
    exports,
    globals,
    external,
    pipeline,
    inject,
  } = buildConfig;
  const { devDependencies = {}, peerDependencies = {} } = require(packageJSONPath);

  const srcPath = resolvePath(projectPath, src);
  const distPath = resolvePath(projectPath, dist);
  const typesPath = resolvePath(projectPath, types);
  const testsPath = resolvePath(projectPath, tests);
  const inputPath = resolvePath(projectPath, input, true);

  const prependBackPath = (value) => normalizePath(`${relativeBackPath}${path.sep}`) + value;
  const genOutputConfig = (esm) => ({
    format: esm ? 'esm' : 'umd',
    file: path.resolve(distPath, `${file}${esm ? '.esm' : ''}.js`),
    sourcemap,
    ...(!esm && {
      name,
      globals,
      exports,
    }),
    plugins: [
      ...(fast
        ? []
        : [
            rollupPrettier({
              sourcemap: sourcemap && 'silent',
            }),
          ]),
    ],
  });

  const genConfig = ({ esm, typeDeclaration }) => {
    const pipelineMap = {
      typescript: isTypeScriptProject
        ? rollupTypescript({
            check: !fast,
            clean: true,
            useTsconfigDeclarationDir: true,
            tsconfig: tsconfigJSONPath,
            tsconfigOverride: {
              compilerOptions: {
                target: 'ESNext',
                sourceMap: sourcemap,
                declaration: typeDeclaration && types !== null,
                declarationDir: typesPath,
              },
              exclude: (require(tsconfigJSONPath).exclude || []).concat(testsPath),
            },
            include: ['*.ts+(|x)', '**/*.ts+(|x)'].map(prependBackPath),
            exclude: ['*.d.ts', '**/*.d.ts'].map(prependBackPath),
          })
        : {},
      resolve: rollupResolve({
        mainFields: ['browser', 'umd:main', 'module', 'main'],
        extensions: resolve.extensions,
        rootDir: srcPath,
        moduleDirectories: resolve.directories,
      }),
      inject: rollupInject({
        ...(typeof inject === 'object' ? inject : {}),
      }),
      commonjs: rollupCommonjs({
        sourceMap: sourcemap,
        extensions: resolve.extensions,
      }),
      babel: [
        isTestEnv
          ? {
              name: 'collect-bable-plugin-istanbul-input-source-maps',
              transform(code, filename) {
                rollupBabelIstanbulSourceMaps[rollupBabelIstanbulGenerateKey(filename)] = { ...this.getCombinedSourcemap() };
                return {
                  code,
                  map: null,
                };
              },
            }
          : {},
        rollupBabelPlugin({
          ...(esm ? esmBabelConfig : legacyBabelConfig),
          babelHelpers: 'runtime',
          extensions: resolve.extensions,
          shouldPrintComment: () => false,
          caller: {
            name: 'babel-rollup-build',
          },
        }),
      ],
    };

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
                  mangle: {
                    safari10: true,
                    properties: {
                      regex: /^_/,
                    },
                  },
                }),
              ],
            }
          : {}
      ),
      external: [...Object.keys(devDependencies), ...Object.keys(peerDependencies), ...((Array.isArray(external) && external) || [])],
      plugins: pipeline.reduce((arr, item) => {
        const plugin = typeof item === 'string' ? pipelineMap[item] : item;
        arr.push(...(Array.isArray(plugin) ? plugin : [plugin]));
        return arr;
      }, []),
    };
  };

  if (!silent) {
    console.log('');
    console.log('PROJECT : ', project);
    console.log('CONFIG  : ', buildConfig);
  }

  const legacy = genConfig({ esm: false, typeDeclaration: true });
  const esm = esmBuild ? genConfig({ esm: true, typeDeclaration: false }) : null;

  let outputs = 0;
  let existingDistFilesStats;
  const builds = [legacy, esm]
    .filter((build) => build !== null)
    .map((build, index, buildsArr) => {
      if (index === 0) {
        existingDistFilesStats = { ...readFilesStats(distPath) };
        buildsArr.forEach((build) => {
          const { output } = build;
          outputs += Array.isArray(output) ? output.length : 1;
        });
      }
      return build;
    })
    .map((build, index, buildsArr) => {
      const isFirst = index === 0;
      const isLast = index === buildsArr.length - 1;
      const isLastFile = () => outputs === 0;

      if (isFirst) {
        const deleteGeneratedDirs = () => {
          const deletedDirs = del.sync([distPath, typesPath].filter((curr) => curr !== null));
          if (deletedDirs.length > 0 && !silent) {
            console.log('Deleted directories:\n', deletedDirs.join('\n'));
          }
        };
        build.plugins.unshift({
          name: 'deleteGeneratedDirs',
          options() {
            if (!this.meta.watchMode) {
              deleteGeneratedDirs();
            }
          },
        });
      }

      if (isLast) {
        const deleteCacheDirs = () => {
          const cacheDirs = cache.map((dir) => path.resolve(projectPath, dir));
          const deletedDirs = del.sync(cacheDirs);
          if (deletedDirs.length > 0 && !silent) {
            console.log('Deleted cache:\n', deletedDirs.join('\n'));
          }
        };
        build.plugins.push({
          name: 'deleteCacheDirs',
          writeBundle() {
            if (!this.meta.watchMode && isLastFile()) {
              deleteCacheDirs();
            }
          },
          closeWatcher: deleteCacheDirs,
        });

        if (!isTestEnv && !silent) {
          if (existingDistFilesStats) {
            build.plugins.push({
              name: 'compareDistSizes',
              writeBundle() {
                if (isLastFile()) {
                  const newDistFilesStats = readFilesStats(distPath);
                  const { yellow, white, green, red, blackBright } = chalk;
                  const printColoredPercent = (value) => {
                    const fixed = `${value.toFixed(2)}%`;
                    if (value === 0) {
                      return white(fixed);
                    }
                    if (value > 0) {
                      return red(`+${fixed}`);
                    }
                    if (value < 0) {
                      return green(fixed);
                    }
                  };

                  Object.keys(existingDistFilesStats).forEach((key) => {
                    const newSize = newDistFilesStats[key];
                    const oldSize = existingDistFilesStats[key] || 0;
                    const percent = printColoredPercent(oldSize === 0 ? 100 : ((newSize - oldSize) / oldSize) * 100);

                    setTimeout(() => {
                      console.log('');
                      console.log(yellow(key));
                      console.log(`size change: ${percent}`, blackBright(`(previous: ${oldSize} | new: ${newSize})`));
                    }, 1);
                  });
                }
              },
            });
          }
        }
      }

      build.plugins.unshift({
        name: 'decreaseOutputs',
        writeBundle() {
          outputs -= 1;
        },
      });

      return build;
    });

  return builds;
};

module.exports = rollupConfig;
