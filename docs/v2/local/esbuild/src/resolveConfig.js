import url from 'node:url';
import path from 'node:path';

export const resolveConfig = async (configPath) => {
  if (configPath) {
    const loadedConfig = (
      await import(url.pathToFileURL(path.resolve(configPath))).catch(() => ({}))
    ).default;
    if (loadedConfig) {
      return loadedConfig;
    }
  }
};
