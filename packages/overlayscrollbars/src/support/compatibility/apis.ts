import { jsAPI } from 'support/compatibility/vendors';

export const MutationObserverConstructor = jsAPI<typeof MutationObserver>('MutationObserver');
export const IntersectionObserverConstructor = jsAPI<typeof IntersectionObserver>('IntersectionObserver');
export const ResizeObserverConstructor: any | undefined = jsAPI('ResizeObserver');
export const cAF = jsAPI<typeof cancelAnimationFrame>('cancelAnimationFrame');
export const rAF = jsAPI<typeof requestAnimationFrame>('requestAnimationFrame');
