/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const resolve = require('@~local/config/resolve');
const defaultOptions = require('./defaultOptions');
const pipelineDefault = require('./pipeline.default');

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
    paths: defaultPaths,
    versions: defaultVersions,
    alias: defaultAlias,
    rollup: defaultRollup,
    extractStyles: defaultExtractStyles,
    extractTypes: defaultExtractTypes,
    verbose: defaultVerbose,
    banner: defaultBanner,
    useEsbuild: defaultUseEsbuild,
  } = defaultOptions;
  const {
    project,
    paths: rawPaths = {},
    alias: rawAlias = {},
    rollup: rawRollup = {},
    versions: rawVersions,
    extractStyles: rawExtractStyles,
    extractTypes: rawExtractTypes,
    verbose: rawVerbose,
    banner: rawBanner,
    useEsbuild: rawUseEsbuild,
  } = userOptions;
  const projectPath = process.cwd();
  const workspaces = pkg.workspaces
    .map((pattern) => glob.sync(pattern, { cwd: workspaceRoot }))
    .flat();
  const mergedOptions = {
    project: project || path.basename(projectPath),
    extractStyles: rawExtractStyles ?? defaultExtractStyles,
    extractTypes: rawExtractTypes ?? defaultExtractTypes,
    verbose: rawVerbose ?? defaultVerbose,
    banner: rawBanner ?? defaultBanner,
    versions: rawVersions ?? defaultVersions,
    useEsbuild: rawUseEsbuild ?? defaultUseEsbuild,
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
  const { dist, types, styles } = mergedOptions.paths;

  mergedOptions.paths.dist = resolvePath(projectPath, dist);
  mergedOptions.paths.types = resolvePath(projectPath, types);
  mergedOptions.paths.styles = resolvePath(projectPath, styles);

  mergedOptions.rollup.input = resolvePath(projectPath, mergedOptions.rollup.input, true);
  mergedOptions.rollup.output = {
    ...(mergedOptions.rollup.output || {}),
    name: mergedOptions.rollup.output?.name || mergedOptions.project,
    file: mergedOptions.rollup.output?.file || mergedOptions.project.toLocaleLowerCase(),
  };

  return mergedOptions;
};

const createConfig = (userOptions = {}) => {
  const options = mergeAndResolveOptions(userOptions);
  const { project, useEsbuild, verbose } = options;
  const result = pipelineDefault(resolve, options, useEsbuild);
  const resultArr = Array.isArray(result) ? result : [result];

  if (verbose) {
    resultArr[0].plugins.push({
      name: 'PROJECT',
      buildStart() {
        console.log('');
        console.log('PROJECT : ', project);
        console.log('OPTIONS : ', options);
      },
    });
  }

  return resultArr;
};

module.exports = createConfig;
