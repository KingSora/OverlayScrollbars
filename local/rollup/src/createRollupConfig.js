/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const resolve = require('@~local/config/resolve');
const defaultOptions = require('./defaultOptions');
const pipelineBuild = require('./pipeline.build');
const pipelineDev = require('./pipeline.dev');
const pipelineStyles = require('./pipeline.styles');
const pipelineTypes = require('./pipeline.types');

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
    mode: defaultMode,
    paths: defaultPaths,
    versions: defaultVersions,
    alias: defaultAlias,
    rollup: defaultRollup,
    extractStyles: defaultExtractStyles,
    extractTypes: defaultExtractTypes,
    verbose: defaultVerbose,
    banner: defaultBanner,
  } = defaultOptions;
  const {
    project,
    mode: rawMode,
    paths: rawPaths = {},
    alias: rawAlias = {},
    rollup: rawRollup = {},
    versions: rawVersions,
    extractStyles: rawExtractStyles,
    extractTypes: rawExtractTypes,
    verbose: rawVerbose,
    banner: rawBanner,
  } = userOptions;
  const projectPath = process.cwd();
  const workspaces = pkg.workspaces
    .map((pattern) => glob.sync(pattern, { cwd: workspaceRoot }))
    .flat();
  const mergedOptions = {
    project: project || path.basename(projectPath),
    mode: rawMode || defaultMode,
    extractStyles: rawExtractStyles ?? defaultExtractStyles,
    extractTypes: rawExtractTypes ?? defaultExtractTypes,
    verbose: rawVerbose ?? defaultVerbose,
    banner: rawBanner ?? defaultBanner,
    versions: rawVersions ?? defaultVersions,
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
  const { src, dist, types, styles } = mergedOptions.paths;

  mergedOptions.paths.src = resolvePath(projectPath, src);
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
  const { project, mode, extractTypes, extractStyles, verbose } = options;
  const isBuild = mode === 'build';
  let result;

  if (isBuild) {
    const styles = extractStyles && pipelineStyles(resolve, options);
    const types = extractTypes && pipelineTypes(resolve, options);
    const js = pipelineBuild(resolve, options);

    result = [styles, types, js].flat().filter((build) => !!build);
  } else {
    result = [pipelineDev(resolve, options)];
  }

  if (verbose) {
    result[0].plugins.push({
      name: 'PROJECT',
      buildStart() {
        console.log('');
        console.log('PROJECT : ', project);
        console.log('OPTIONS : ', options);
      },
    });
  }

  return result;
};

module.exports = createConfig;
