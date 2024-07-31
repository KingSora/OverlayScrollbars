import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as sass from 'sass';
import esbuild from 'esbuild';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

import { normalizePathSlashes } from '../normalizePathSlashes.js';

const getHash = (content) => crypto.createHash('sha1').update(content).digest('hex');

export const esbuildPluginStyles = (options) => {
  const {
    cssBuildOptions = {},
    cssModulesRegex = null,
    sassFilesRegex = /\.s[ac]ss$/,
    include = /\.(css|scss|sass)$/,
  } = options;
  const replaceExtensionRegex = /\.[^.]*$/;
  const sassCache = new Map();
  const postcssCache = new Map();
  const esbuildCache = new Map();

  const replaceExtension = (filePath, replacement = '') =>
    filePath.replace(
      replaceExtensionRegex,
      typeof replacement === 'function'
        ? replacement((filePath.match(replaceExtensionRegex) || [])[0] || '')
        : replacement
    );

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

  const transpilePostCss = async (source, filePath) => {
    const currHash = getHash(source);
    const [cacheHash] = postcssCache.get(filePath) || [];

    if (currHash !== cacheHash) {
      let cssModulesJson;
      const plugins = [autoprefixer()].filter(Boolean);
      try {
        const { css } = await postcss(plugins).process(source, {
          from: filePath,
        });
        const result = [css, cssModulesJson];
        postcssCache.set(filePath, [currHash, result]);
      } catch {}
    }

    return postcssCache.get(filePath)[1] || [source];
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
      const assetOutputFiles = new Set();

      // move newly crete stub modules to 'css-processed' namespace
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.pluginData?.contents) {
          return {
            path: args.path,
            namespace: 'css-processed',
            pluginData: args.pluginData,
          };
        }
      });

      // resolve asset imports for generated css files
      build.onResolve({ filter: /.*/, namespace: 'css-processed' }, async (args) =>
        // since we don't consume them its fine that the imports are wrong
        ({
          path: args.path,
          external: true,
        })
      );

      build.onLoad({ filter: include }, async (args) => {
        const { namespace, pluginData, path: filePath } = args;

        if (namespace === 'css-processed') {
          const { contents } = pluginData;

          return {
            contents,
            loader: 'copy',
            resolveDir: path.dirname(args.path),
          };
        }

        const isSass = sassFilesRegex.test(filePath);

        const isCssMdoule = cssModulesRegex && cssModulesRegex.test(filePath);
        const fileName = path.basename(filePath);
        const resolveDir = path.dirname(filePath);
        const css = await fs.promises.readFile(filePath);
        const [source, cssModulesJson] = await transpilePostCss(
          isSass ? transpileSass(css, filePath) : css,
          filePath,
          isCssMdoule
        );

        const { outputFiles, entryFile, watchFiles, warnings, errors } = await esbuildCss(
          initBuildOptions,
          {
            contents: source,
            sourcefile: fileName,
            resolveDir,
            loader: 'css',
          },
          filePath
        );

        if (errors) {
          return {
            errors,
          };
        }

        const entryFilePath = normalizePathSlashes(
          path.resolve(
            path.dirname(entryFile.path),
            `${path.basename(replaceExtension(args.path, '.css'))}`
          )
        );

        outputFiles.forEach((file) => {
          if (file !== entryFile) {
            assetOutputFiles.add(file);
          }
        });

        if (isCssMdoule) {
          return {
            contents: `
              export { default as file } from ${JSON.stringify(entryFilePath)};
              export default ${JSON.stringify(cssModulesJson)};
            `,
            resolveDir,
            watchFiles,
            warnings,
            pluginData: {
              contents: entryFile.contents,
            },
          };
        }

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

      build.onEnd((result) => {
        const { outputFiles } = result;

        outputFiles.push(...Array.from(assetOutputFiles));
        assetOutputFiles.clear();
      });
    },
  };
};
