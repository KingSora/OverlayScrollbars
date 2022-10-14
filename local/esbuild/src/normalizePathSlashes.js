const isExtendedLengthPath = /^\\\\\?\\/;

export const normalizePathSlashes = (path) =>
  isExtendedLengthPath.test(path) ? path : path.replace(/\\/g, '/');
