import fs from 'node:fs';
import path from 'node:path';

export const esbuildClearOldBuild = () => {
  let cleared = false;
  return {
    name: 'clearOldBuild',
    setup(build) {
      const initBuildOptions = build.initialOptions;

      build.onStart(() => {
        if (!cleared && initBuildOptions.outdir) {
          fs.rmSync(path.resolve(initBuildOptions.outdir), { recursive: true, force: true });
          cleared = true;
        }
      });
    },
  };
};
