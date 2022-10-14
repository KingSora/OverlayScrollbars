import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const getHash = (content) => crypto.createHash('md5').update(content).digest('hex');

export const writeOnlyChanges = async (outputFiles, changesMap) => {
  await Promise.all(
    outputFiles.map(({ path: filepath }) =>
      fs.promises.mkdir(path.dirname(filepath), { recursive: true })
    )
  );
  await Promise.all(
    outputFiles.map(({ path: filepath, contents }) => {
      const currContentsHash = getHash(contents);
      const cacheHash = changesMap.get(filepath);

      if (cacheHash !== currContentsHash) {
        changesMap.set(filepath, currContentsHash);
        return fs.promises.writeFile(filepath, contents);
      }
      return null;
    })
  );
};
