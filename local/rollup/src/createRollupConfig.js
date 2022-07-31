/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const { execSync } = require("child_process");
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const resolve = require('@local/config/resolve');
const defaultOptions = require('./defaultOptions');
const pipelineBuild = require('./pipeline.build');
const pipelineDev = require('./pipeline.dev');

const workspaceRoot = path.dirname(execSync('npm root').toString());
const pkg = require(`${workspaceRoot}/package.json`);

const appendExtension = (file) =>
  path.extname(file) === ''
    ? file + resolve.extensions.find((ext) => fs.existsSync(path.resolve(`${file}${ext}`)))
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

const getWorkspaceAliases = () =>
  pkg.workspaces
    .map((pattern) => glob.sync(pattern, { cwd: workspaceRoot }))
    .flat()
    .reduce((obj, resolvedPath) => {
      let projTsConfig;
      const absolutePath = path.resolve(workspaceRoot, resolvedPath);
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        projTsConfig = require(`${path.resolve(workspaceRoot, resolvedPath)}/tsconfig.json`);
      } catch {}

      obj[`@/${path.basename(absolutePath)}`] = `${normalizePath(
        path.resolve(
          absolutePath,
          projTsConfig?.compilerOptions?.baseUrl || defaultOptions.paths.src
        )
      )}`;
      return obj;
    }, {});

const mergeAndResolveOptions = (userOptions) => {
  const {
    mode: defaultMode,
    paths: defaultPaths,
    versions: defaultVersions,
    alias: defaultAlias,
    rollup: defaultRollup,
    extractStyle: defaultExtractStyle,
  } = defaultOptions;
  const {
    project,
    mode: rawMode,
    paths: rawPaths = {},
    versions: rawVersions = {},
    alias: rawAlias = {},
    rollup: rawRollup = {},
    extractStyle: rawExtractStyle,
  } = userOptions;
  const projectPath = process.cwd();
  const mergedOptions = {
    project: project || path.basename(projectPath),
    mode: rawMode || defaultMode,
    repoRoot: workspaceRoot,
    extractStyle: rawExtractStyle ?? defaultExtractStyle,
    paths: {
      ...defaultPaths,
      ...rawPaths,
    },
    versions: {
      ...defaultVersions,
      ...rawVersions,
    },
    alias: {
      ...getWorkspaceAliases(),
      ...defaultAlias,
      ...rawAlias,
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
  const { src, dist, types } = mergedOptions.paths;

  mergedOptions.paths.src = resolvePath(projectPath, src);
  mergedOptions.paths.dist = resolvePath(projectPath, dist);
  mergedOptions.paths.types = resolvePath(projectPath, types);

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
  const { project, mode, versions } = options;
  const { module: buildModuleVersion } = versions;
  const isBuild = mode === 'build';

  if (isBuild) {
    console.log('');
    console.log('PROJECT : ', project);
    console.log('OPTIONS : ', options);

    const umd = pipelineBuild(resolve, false, options, { declarationFiles: true, outputStyle: true });
    const esm = buildModuleVersion ? pipelineBuild(resolve, true, options) : null;

    return [umd, esm].filter((build) => !!build);
  }

  return [pipelineDev(resolve, options)];
};

module.exports = createConfig;