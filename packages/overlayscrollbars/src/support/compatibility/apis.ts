import { jsAPI } from 'support/compatibility/vendors';

export const MutationObserverConstructor = jsAPI<typeof MutationObserver>('MutationObserver');
export const IntersectionObserverConstructor =
  jsAPI<typeof IntersectionObserver>('IntersectionObserver');
export const ResizeObserverConstructor = jsAPI<typeof ResizeObserver>('ResizeObserver');
export const cAF = jsAPI<typeof cancelAnimationFrame>('cancelAnimationFrame');
export const rAF = jsAPI<typeof requestAnimationFrame>('requestAnimationFrame');
export const setT = window.setTimeout as (handler: TimerHandler, timeout?: number) => number;
export const clearT = window.clearTimeout as (id?: number) => void;
