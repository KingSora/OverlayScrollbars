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

export default async (config) => {
  const { 'config-project': project } = config;

  const defaultInputName = './src/index';
  const projectPath = path.resolve(__dirname, projectRootPath, project);
  const packageJSONPath = path.resolve(projectPath, 'package.json');
  const tsconfigJSONPath = path.resolve(projectPath, 'tsconfig.json');
  const buildConfigPath = path.resolve(projectPath, 'build.config.json');
  const isTypeScriptProject = fs.existsSync(tsconfigJSONPath);

  const {
    input = defaultInputName + resolve.extensions.find((ext) => fs.existsSync(path.resolve(projectPath, `${defaultInputName}${ext}`))),
    src = './src',
    dist = './dist',
    types = './types',
    tests = './tests',
    cache = [],
    minVersions = true,
    modules: { sourcemap: modulesSourceMap = true } = {},
    legacy: { sourcemap: legacySourceMap = true, exports = 'auto', name = project, globals } = {},
  } = await import(buildConfigPath);

  const { devDependencies = {}, peerDependencies = {} } = await import(packageJSONPath);

  const srcPath = path.resolve(projectPath, src);
  const distPath = path.resolve(projectPath, dist);
  const typesPath = path.resolve(projectPath, types);
  const testsPath = path.resolve(projectPath, tests);
  const inputPath = path.resolve(projectPath, input);

  const genOutputConfig = (esm) => ({
    format: esm ? 'esm' : 'umd',
    file: path.resolve(distPath, `${project}${esm ? '.esm' : ''}.js`),
    sourcemap: esm ? modulesSourceMap : legacySourceMap,
    ...(esm
      ? {}
      : {
          name,
          globals,
          exports,
        }),
    plugins: [
      rollupPrettier({
        sourcemap: (esm ? modulesSourceMap : legacySourceMap) && 'silent',
      }),
    ],
  });

  const genConfig = async ({ esm, typeDeclaration }, ...plugins) => {
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
        ...plugins,
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
                  declaration: typeDeclaration,
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
  console.log('NODE_ENV: ', process.env.NODE_ENV);

  return [
    await genConfig(
      { esm: false, typeDeclaration: true },
      {
        name: 'deleteGeneratedDirs',
        options() {
          const deletedDirs = del.sync([distPath, typesPath]);
          if (deletedDirs.length > 0) {
            console.log('Deleted directories:\n', deletedDirs.join('\n'));
          }
        },
      }
    ),
    await genConfig(
      { esm: true, typeDeclaration: false },
      {
        name: 'deleteCacheDirs',
        writeBundle() {
          const cacheDirs = cache.map((dir) => path.resolve(projectPath, dir));
          const deletedDirs = del.sync(cacheDirs);
          if (deletedDirs.length > 0) {
            console.log('Deleted cache:\n', deletedDirs.join('\n'));
          }
        },
      }
    ),
  ];
};
