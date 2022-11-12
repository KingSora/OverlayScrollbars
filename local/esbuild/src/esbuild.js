import esbuildOriginal from 'esbuild';
import { writeOnlyChanges } from './writeOnlyChanges.js';
import { esbuildClearOldBuild } from './plugins/clearOldBuild.js';
import { esbuildPluginStyles } from './plugins/styles.js';
import { esbuildPluginTailwind } from './plugins/tailwind.js';
import { esbuildPluginExternal } from './plugins/external.js';

const changesMap = new Map();
const writeBuild = async (build) => {
  if (build?.outputFiles) {
    await writeOnlyChanges(build.outputFiles, changesMap);
  }
};

export const esbuild = async (options = {}, { tailwindConfig = './tailwind.config.js' } = {}) => {
  const buildOptions = {
    bundle: true,
    splitting: true,
    allowOverwrite: true,
    incremental: options.watch,
    metafile: true,
    write: false,
    format: 'esm',
    platform: 'node',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[dir]/[name]',
    entryNames: '[dir]/[name]',
    jsx: 'automatic',
    ...options,
    external: [...(options.external || [])],
    watch: options.watch && {
      async onRebuild(_, rebuildResult) {
        await writeBuild(rebuildResult);
      },
    },
    plugins: [
      esbuildClearOldBuild(),
      esbuildPluginStyles({
        sassFilesRegex: /\.s[ac]ss$/,
        cssFilesRegex: /\.css$/,
      }),
      esbuildPluginTailwind({
        tailwindConfig,
        tailwindCssFileRegex: /tailwind.*\.css$/,
      }),
      esbuildPluginExternal(),
      ...(options.plugins || []),
    ],
  };
  const build = await esbuildOriginal.build(buildOptions);
  await writeBuild(build);
  return build;
};
