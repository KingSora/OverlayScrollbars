import fs from 'node:fs';

export default (files) => ({
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
