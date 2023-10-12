import { jsAPI } from './vendors';

export const MutationObserverConstructor = jsAPI<typeof MutationObserver>('MutationObserver');
export const IntersectionObserverConstructor =
  jsAPI<typeof IntersectionObserver>('IntersectionObserver');
export const ResizeObserverConstructor = jsAPI<typeof ResizeObserver>('ResizeObserver');
export const scrollT = jsAPI<new (constructor: unknown) => AnimationTimeline>(
  // @ts-ignore
  'ScrollTimeline'
);
