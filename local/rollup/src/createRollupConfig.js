/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const resolve = require('@~local/config/resolve');
const defaultOptions = require('./defaultOptions');
const pipelineDefault = require('./pipeline.default');
const rollupPluginClean = require('./plugins/clean');

const workspaceRoot = path.dirname(execSync('npm root').toString());
const pkg = require(`${workspaceRoot}/package.json`);

const appendExtension = (file) =>
  path.extname(file) === ''
    ? file + (resolve.extensions.find((ext) => fs.existsSync(path.resolve(`${file}${ext}`))) || '')
    : file;

const normalizePath = (pathName) =>
  pathName ? pathName.split(path.sep).join(path.posix.sep) : pathName;

const resolvePath = (basePath, pathToResolve, appendExt) => {
  const result = pathToResolve
    ? path.isAbsolute(pathToResolve)
      ? pathToResolve
      : path.resolve(basePath, pathToResolve)
    : null;
  return normalizePath(result && appendExt ? appendExtension(result) : result);
};

const mergeAndResolveOptions = (userOptions) => {
  const {
    clean: defaultClean,
    outDir: defaultOutDir,
    paths: defaultPaths,
    versions: defaultVersions,
    alias: defaultAlias,
    rollup: defaultRollup,
    extractStyles: defaultExtractStyles,
    extractTypes: defaultExtractTypes,
    extractPackageJson: defaultExtractPackageJson,
    verbose: defaultVerbose,
    banner: defaultBanner,
    useEsbuild: defaultUseEsbuild,
  } = defaultOptions;
  const {
    project,
    clean: rawClean,
    outDir: rawOutDir,
    paths: rawPaths = {},
    alias: rawAlias = {},
    rollup: rawRollup = {},
    versions: rawVersions,
    extractStyles: rawExtractStyles,
    extractTypes: rawExtractTypes,
    extractPackageJson: rawExtractPackageJson,
    verbose: rawVerbose,
    banner: rawBanner,
    useEsbuild: rawUseEsbuild,
  } = userOptions;
  const projectDir = process.cwd();
  const workspaces = pkg.workspaces
    .map((pattern) => glob.sync(pattern, { cwd: workspaceRoot }))
    .flat();
  const mergedOptions = {
    project: project || path.basename(projectDir),
    projectDir,
    extractStyles: rawExtractStyles ?? defaultExtractStyles,
    extractTypes: rawExtractTypes ?? defaultExtractTypes,
    extractPackageJson: rawExtractPackageJson ?? defaultExtractPackageJson,
    verbose: rawVerbose ?? defaultVerbose,
    banner: rawBanner ?? defaultBanner,
    versions: rawVersions ?? defaultVersions,
    useEsbuild: rawUseEsbuild ?? defaultUseEsbuild,
    clean: rawClean ?? defaultClean,
    outDir: rawOutDir ?? defaultOutDir,
    paths: {
      ...defaultPaths,
      ...rawPaths,
    },
    alias: {
      ...defaultAlias,
      ...(typeof rawAlias === 'function'
        ? rawAlias(workspaceRoot, workspaces, resolvePath)
        : rawAlias),
    },
    rollup: {
      ...defaultRollup,
      ...rawRollup,
      output: {
        ...defaultRollup.output,
        ...(rawRollup.output || {}),
      },
    },
  };
  const { outDir, paths } = mergedOptions;
  const { js, types, styles } = paths;
  const pluginFromFn = (plugin) =>
    typeof plugin === 'function' ? plugin(mergedOptions, workspaceRoot, workspaces) : plugin;

  paths.js = resolvePath(projectDir, path.join(outDir, js));
  paths.types = resolvePath(projectDir, path.join(outDir, types));
  paths.styles = resolvePath(projectDir, path.join(outDir, styles));

  mergedOptions.outDir = resolvePath(projectDir, outDir);
  mergedOptions.rollup.input = resolvePath(projectDir, mergedOptions.rollup.input, true);
  mergedOptions.rollup.output = {
    ...(mergedOptions.rollup.output || {}),
    name: mergedOptions.rollup.output?.name || mergedOptions.project,
    file: mergedOptions.rollup.output?.file || mergedOptions.project.toLocaleLowerCase(),
  };
  mergedOptions.rollup.plugins =
    mergedOptions.rollup.plugins?.map(pluginFromFn).filter(Boolean) || [];
  mergedOptions.rollup.output.plugins =
    mergedOptions.rollup.output?.plugins?.map(pluginFromFn).filter(Boolean) || [];

  return mergedOptions;
};

const createConfig = (userOptions = {}) => {
  const options = mergeAndResolveOptions(userOptions);
  const { project, useEsbuild, verbose, clean, outDir, projectDir } = options;
  const result = pipelineDefault(resolve, options, useEsbuild);
  const resultArr = Array.isArray(result) ? result : [result];
  const prePlugins = !Array.isArray(resultArr[0].plugins) ? [] : resultArr[0].plugins;

  resultArr[0].plugins = prePlugins;

  if (verbose) {
    prePlugins.push({
      name: 'PROJECT',
      buildStart() {
        console.log('');
        console.log('PROJECT : ', project);
        console.log('OPTIONS : ', options);
      },
    });
  }
  if (clean && outDir !== projectDir) {
    prePlugins.push(rollupPluginClean({ paths: [outDir], verbose }));
  }

  return resultArr;
};

module.exports = createConfig;
