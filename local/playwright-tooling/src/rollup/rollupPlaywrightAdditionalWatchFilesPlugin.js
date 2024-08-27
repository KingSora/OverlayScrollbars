import fs from 'node:fs';

export const rollupPlaywrightAdditionalWatchFilesPlugin = (files) => ({
  buildStart() {
    if (files) {
      files.forEach((file) => {
        if (fs.existsSync(file)) {
          this.addWatchFile(file);
        }
      });
    }
  },
});
