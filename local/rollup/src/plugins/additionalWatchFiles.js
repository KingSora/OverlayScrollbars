const fs = require('fs');

module.exports = (files) => ({
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
