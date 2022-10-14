import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sass from 'sass';
import esbuild from 'esbuild';
import { writeOnlyChanges } from '../writeOnlyChanges.js';

const externalRegex = /node_modules/;
const isExtendedLengthPath = /^\\\\\?\\/;

const normalizePathSlashes = (pathToNormalize) =>
  isExtendedLengthPath.test(pathToNormalize)
    ? pathToNormalize
    : pathToNormalize.replace(/\\/g, '/');

const getHash = (content) => crypto.createHash('sha1').update(content).digest('hex');

export const esbuildPluginStyles = (options) => {
  const changesMap = new Map();
  const {
    cssBuildOptions = {},
    cssModulesRegex = /\.module\.\S+$/,
    sassFilesRegex = /\.s[ac]ss$/,
    cssFilesRegex = /\.css$/,
  } = options;
  const sassCache = new Map();
  const esbuildCache = new Map();

  const replaceExtension = (filePath, replacement = '') => {
    const replacementRegex = /\.[^.]*$/;
    return filePath.replace(
      replacementRegex,
      typeof replacement === 'function'
        ? replacement((filePath.match(replacementRegex) || [])[0] || '')
        : replacement
    );
  };

  const resolveFile = async (build, onResolveArgs) => {
    const { resolveDir, importer } = onResolveArgs;
    const { path: resolvedPath } = await build.resolve(onResolveArgs.path, {
      resolveDir,
      importer,
      kind: 'entry-point',
      namespace: 'resolve-pls',
    });
    const external = externalRegex.test(resolvedPath);

    return [resolvedPath, external];
  };

  const resolveProcessedCss = (args) => ({
    path: args.path,
    namespace: 'css-processed',
    pluginData: args.pluginData,
  });

  const setupSassResolve = (build) => {
    build.onResolve({ filter: sassFilesRegex, namespace: 'file' }, async (args) => {
      const [resolvedPath, external] = await resolveFile(build, args);

      return external
        ? {
            path: args.path,
            external: true,
          }
        : {
            path: cssModulesRegex.test(resolvedPath)
              ? `${resolvedPath}.module.css`
              : `${resolvedPath}.css`,
            namespace: 'sass',
            pluginData: {
              resolvedPath,
            },
          };
    });
  };

  const setupCssResolve = (build) => {
    build.onResolve({ filter: cssFilesRegex, namespace: 'file' }, async (args) => {
      const [resolvedPath, external] = await resolveFile(build, args);

      return external
        ? {
            path: args.path,
            external: true,
          }
        : {
            path: resolvedPath,
            namespace: 'css',
            pluginData: {
              resolvedPath,
            },
          };
    });
  };

  const transpileSass = (css, filePath) => {
    const currHash = getHash(css);
    const [cacheHash] = sassCache.get(filePath) || [];

    if (currHash !== cacheHash) {
      try {
        const result = sass.compile(filePath);
        sassCache.set(filePath, [currHash, result.css]);
      } catch {}
    }

    return sassCache.get(filePath)[1] || css;
  };

  const esbuildCss = async (initialBuildOptions, stdin, filePath) => {
    const source = stdin.contents;
    const currHash = getHash(source);
    const [cacheHash] = esbuildCache.get(filePath) || [];

    if (currHash !== cacheHash) {
      const finalCssBuildOptions =
        typeof cssBuildOptions === 'function'
          ? cssBuildOptions(initialBuildOptions)
          : cssBuildOptions;
      const { assetNames } = initialBuildOptions;
      const { outputFiles, metafile, errors, warnings } = await esbuild.build({
        ...initialBuildOptions,
        stdin,
        write: false,
        bundle: true,
        metafile: true,
        entryNames: assetNames,
        entryPoints: [],
        plugins: [],
        ...finalCssBuildOptions,
      });

      if (errors?.length) {
        return {
          errors,
        };
      }

      const { outputs } = metafile;
      const watchFiles = Object.values(outputs).reduce((arr, { inputs }) => {
        arr.push(...Object.keys(inputs).map((input) => path.resolve(input)));
        return arr;
      }, []);
      const entry = Object.keys(outputs).find((out) => outputs[out].entryPoint);
      const entryFile = outputFiles.find((file) =>
        normalizePathSlashes(file.path).endsWith(normalizePathSlashes(entry))
      );

      const result = {
        outputFiles,
        entryFile,
        watchFiles,
        warnings,
      };

      esbuildCache.set(filePath, [currHash, result]);
    }

    return esbuildCache.get(filePath)[1];
  };

  return {
    name: 'esbuild-plugin-styles',

    async setup(build) {
      const initBuildOptions = build.initialOptions;

      setupSassResolve(build);
      setupCssResolve(build);

      // move newly crete stub modules to 'css-processed' namespace
      build.onResolve({ filter: cssFilesRegex, namespace: 'sass' }, resolveProcessedCss);
      build.onResolve({ filter: cssFilesRegex, namespace: 'css' }, resolveProcessedCss);

      // resolve asset imports for generated css files
      build.onResolve({ filter: /.*/, namespace: 'css-processed' }, async (args) =>
        // since we don't consume them its fine that the imports are wrong
        ({
          path: args.path,
          external: true,
        })
      );

      build.onLoad({ filter: cssFilesRegex }, async (args) => {
        const { namespace, pluginData } = args;

        if (namespace === 'css-processed') {
          const { contents } = pluginData;
          return {
            contents,
            loader: 'copy',
            resolveDir: path.dirname(args.path),
          };
        }

        const { resolvedPath } = pluginData;
        const fileName = path.basename(resolvedPath);
        const resolveDir = path.dirname(resolvedPath);
        const css = await fs.promises.readFile(resolvedPath);
        const source = namespace === 'sass' ? transpileSass(css, resolvedPath) : css;

        const { outputFiles, entryFile, watchFiles, warnings, errors } = await esbuildCss(
          initBuildOptions,
          {
            contents: source,
            sourcefile: fileName,
            resolveDir,
            loader: 'css',
          },
          resolvedPath
        );

        if (errors) {
          return {
            errors,
          };
        }

        const entryFilePath = path.resolve(
          path.dirname(entryFile.path),
          `${path.basename(replaceExtension(args.path))}${path
            .basename(entryFile.path)
            .replace('stdin', '')}`
        );
        const adaptedOutputFiles = outputFiles.filter((file) => file !== entryFile);

        await writeOnlyChanges(adaptedOutputFiles, changesMap);

        return {
          contents: `export { default } from ${JSON.stringify(entryFilePath)};`,
          resolveDir,
          watchFiles,
          warnings,
          pluginData: {
            contents: entryFile.contents,
          },
        };
      });
    },
  };
};
