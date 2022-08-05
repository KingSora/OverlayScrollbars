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

// if the import would be 'overlayscrollbars' and the package name is also 'overlayscrollbars' esbuild needs an alias to resolve it correctly
// only needed for playwright with esbuild
const getOverlappingPackageNameAliases = () =>
  pkg.workspaces
    .map((pattern) => glob.sync(pattern, { cwd: workspaceRoot }))
    .flat()
    .reduce((obj, resolvedPath) => {
      const absolutePath = path.resolve(workspaceRoot, resolvedPath);
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const projTsConfig = require(`${path.resolve(workspaceRoot, resolvedPath)}/tsconfig.json`);
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const projPackageJson = require(`${path.resolve(
          workspaceRoot,
          resolvedPath
        )}/package.json`);

        const { name } = projPackageJson;
        const { compilerOptions } = projTsConfig;
        const { baseUrl } = compilerOptions;

        obj[name] = resolvePath(absolutePath, path.join(baseUrl, name), true);
      } catch {}
      return obj;
    }, {});

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
  const mergedOptions = {
    project: project || path.basename(projectPath),
    mode: rawMode || defaultMode,
    repoRoot: workspaceRoot,
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

  if (verbose) {
    console.log('');
    console.log('PROJECT : ', project);
    console.log('OPTIONS : ', options);
  }

  if (isBuild) {
    const styles = extractStyles && pipelineStyles(resolve, options);
    const types = extractTypes && pipelineTypes(resolve, options);
    const js = pipelineBuild(resolve, options);

    return [styles, types, js].flat().filter((build) => !!build);
  }

  // only needed for playwright!
  options.alias = {
    ...getOverlappingPackageNameAliases(),
    ...options.alias,
  };

  return [pipelineDev(resolve, options)];
};

module.exports = createConfig;
