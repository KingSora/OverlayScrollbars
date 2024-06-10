export const isBrowser =
  // deno has the global `window` defined
  typeof window !== 'undefined' &&
  // make sure HTML element is available
  typeof HTMLElement !== 'undefined' &&
  // make sure document is defined
  !!window.document;
