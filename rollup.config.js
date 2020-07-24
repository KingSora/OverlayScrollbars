import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import rollupTypescript from 'rollup-plugin-typescript2';
import { getBabelOutputPlugin as rollupBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser as rollupTerser } from 'rollup-plugin-terser';
import del from 'del';
import fs from 'fs';
import path from 'path';
import resolve from './resolve.config.json';

const projectRootPath = './packages';

const legacyOutputBabelConfig = {
  allowAllFormats: true,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: '11',
        },
      },
    ],
  ],
};

const esmOutputBabelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
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
    cache = [],
    minVersions = true,
    modules: { sourcemap: modulesSourceMap = true } = {},
    legacy: { sourcemap: legacySourceMap = true, exports = 'auto', name = project, globals } = {},
  } = await import(buildConfigPath);

  const { devDependencies = {}, peerDependencies = {} } = await import(packageJSONPath);

  const srcPath = path.resolve(projectPath, src);
  const distPath = path.resolve(projectPath, dist);
  const typesPath = path.resolve(projectPath, types);
  const inputPath = path.resolve(projectPath, input);

  const mainOutputArray = [
    {
      format: 'iife',
      name,
      globals,
      exports,
      file: path.resolve(distPath, `${project}.js`),
      sourcemap: legacySourceMap,
      plugins: [rollupBabelOutputPlugin(legacyOutputBabelConfig)],
    },
    {
      format: 'esm',
      file: path.resolve(distPath, `${project}.esm.js`),
      sourcemap: modulesSourceMap,
      plugins: [rollupBabelOutputPlugin(esmOutputBabelConfig)],
    },
  ];

  return {
    input: inputPath,
    output: mainOutputArray.concat(
      minVersions
        ? mainOutputArray.map((outputObj) => ({
            ...outputObj,
            compact: true,
            file: outputObj.file.replace('.js', '.min.js'),
            sourcemap: false,
            plugins: [
              ...(outputObj.plugins || []),
              rollupTerser({
                ecma: 8,
                safari10: true,
              }),
            ],
          }))
        : [],
    ),
    external: [...Object.keys(devDependencies), ...Object.keys(peerDependencies)],
    plugins: [
      {
        name: 'del',
        options() {
          const deletedDirs = del.sync([distPath, typesPath]);
          if (deletedDirs.length > 0) {
            console.log('Deleted directories:\n', deletedDirs.join('\n'));
          }
        },
        writeBundle() {
          const cacheDirs = cache.map((dir) => path.resolve(projectPath, dir));
          const deletedDirs = del.sync(cacheDirs);
          if (deletedDirs.length > 0) {
            console.log('Deleted cache:\n', deletedDirs.join('\n'));
          }
        },
      },
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
                declaration: true,
                declarationDir: typesPath,
              },
            },
          })
        : {},
    ],
  };
};
