/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import resolve from '@~local/config/resolve' with { type: 'json' };
import defaultOptions from './defaultOptions.js';
import pipelineDefault from './pipeline.default.js';

const workspaceRoot = path.dirname(execSync('npm root').toString());

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
    copy: defaultCopy,
    outDir: defaultOutDir,
    paths: defaultPaths,
    versions: defaultVersions,
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
    copy: rawCopy,
    outDir: rawOutDir,
    paths: rawPaths = {},
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
    copy: rawCopy ?? defaultCopy,
    outDir: rawOutDir ?? defaultOutDir,
    paths: {
      ...defaultPaths,
      ...rawPaths,
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
    typeof plugin === 'function' ? plugin(mergedOptions, workspaceRoot) : plugin;

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
  const { useEsbuild } = options;
  const result = pipelineDefault(resolve, options, useEsbuild);
  const resultArr = Array.isArray(result) ? result : [result];

  return resultArr;
};

export default createConfig;
