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

const buildConfigNames = ['build.config.js', 'build.config.json'];
const buildConfigDefaults = {
  input: './src/index',
  src: './src',
  dist: './dist',
  types: './types',
  tests: './__tests__',
  cache: [],
  minVersions: true,
  sourcemap: true,
  esmBuild: true,
  exports: 'auto',
};

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

const appendExtension = (file) => {
  if (path.extname(file) === '') {
    return file + resolve.extensions.find((ext) => fs.existsSync(path.resolve(`${file}${ext}`)));
  }
  return file;
};

const getBuildConfig = (projectPath) => {
  const buildConfigName = buildConfigNames.find((name) => fs.existsSync(path.resolve(projectPath, name)));
  return buildConfigName ? path.resolve(projectPath, buildConfigName) : '';
};

const resolvePath = (projectPath, rPath, appendExt) => {
  const result = rPath ? (path.isAbsolute(rPath) ? rPath : path.resolve(projectPath, rPath)) : null;
  return result && appendExt ? appendExtension(result) : result;
};

export default async (config, overwriteBuildConfig, silent) => {
  const { 'config-project': project } = config;

  const projectPath = path.resolve(__dirname, resolve.projectRoot, project);
  const packageJSONPath = path.resolve(projectPath, 'package.json');
  const tsconfigJSONPath = path.resolve(projectPath, 'tsconfig.json');
  const buildConfigPath = getBuildConfig(projectPath);
  const isTypeScriptProject = fs.existsSync(tsconfigJSONPath);
  const buildConfig = {
    ...buildConfigDefaults,
    ...{ name: project, file: project },
    ...(await import(buildConfigPath)),
    ...(overwriteBuildConfig || {}),
  };

  const { input, src, dist, types, tests, file, cache, minVersions, sourcemap, esmBuild, name, exports, globals } = buildConfig;
  const { devDependencies = {}, peerDependencies = {} } = await import(packageJSONPath);

  const srcPath = resolvePath(projectPath, src);
  const distPath = resolvePath(projectPath, dist);
  const typesPath = resolvePath(projectPath, types);
  const testsPath = resolvePath(projectPath, tests);
  const inputPath = resolvePath(projectPath, input, true);

  const genOutputConfig = (esm) => ({
    format: esm ? 'esm' : 'umd',
    file: path.resolve(distPath, `${file}${esm ? '.esm' : ''}.js`),
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

  if (!silent) {
    console.log('');
    console.log('PROJECT : ', project);
    console.log('ENV     : ', process.env.NODE_ENV);
    console.log('CONFIG  : ', buildConfig);
  }

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
            if (deletedDirs.length > 0 && !silent) {
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
            if (deletedDirs.length > 0 && !silent) {
              console.log('Deleted cache:\n', deletedDirs.join('\n'));
            }
          },
        });
      }

      return build;
    });

  return builds;
};
