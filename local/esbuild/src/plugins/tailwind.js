import path from 'node:path';
import minimatch from 'minimatch';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

import { resolveConfig } from '../resolveConfig.js';

export const esbuildPluginTailwind = ({
  tailwindCssFileRegex = /tailwind.*\.css$/,
  tailwindConfig = './tailwind.config.js',
} = {}) => ({
  name: 'tailwind',
  async setup(build) {
    const resolvedTailwindConfig = await resolveConfig(tailwindConfig);

    build.onEnd(async (result) => {
      if (result) {
        const { metafile, outputFiles } = result;
        if (metafile && outputFiles) {
          const { inputs } = metafile;
          const tailwindFile = outputFiles.find(({ path: outputFilePath }) =>
            tailwindCssFileRegex.test(outputFilePath)
          );

          if (tailwindFile) {
            const { path: tailwindFilePath, text: tailwindFileCss } = tailwindFile;
            const tailwindContentGlobs = (resolvedTailwindConfig?.content || []).filter(
              (entry) => typeof entry === 'string'
            );
            const inputFilePaths = Object.keys(inputs).map((input) => path.resolve(input));
            const includedFiles = Array.from(
              new Set(
                tailwindContentGlobs
                  .map((glob) => minimatch.match(inputFilePaths, glob, { dot: true }))
                  .flat()
              )
            );

            const postcssResult = await postcss([
              tailwindcss({ ...(resolvedTailwindConfig || {}), content: includedFiles }),
            ]).process(tailwindFileCss, {
              from: tailwindFilePath,
            });

            tailwindFile.contents = Buffer.from(postcssResult.css);
          }
        }
      }
    });
  },
});
