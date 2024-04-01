export const isBrowser =
  typeof window !== 'undefined' &&
  // deno has the global `window` defined, so additionally check for document
  typeof document !== 'undefined';
