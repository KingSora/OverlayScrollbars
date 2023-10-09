import { isBrowser } from '~/support/compatibility/isBrowser';
import { jsAPI } from '~/support/compatibility/vendors';
import { noop } from '../utils/noop';

export const MutationObserverConstructor = jsAPI<typeof MutationObserver>('MutationObserver');
export const IntersectionObserverConstructor =
  jsAPI<typeof IntersectionObserver>('IntersectionObserver');
export const ResizeObserverConstructor = jsAPI<typeof ResizeObserver>('ResizeObserver');
export const cAF = jsAPI<typeof cancelAnimationFrame>('cancelAnimationFrame');
export const rAF = jsAPI<typeof requestAnimationFrame>('requestAnimationFrame');
export const scrollT = jsAPI<new (constructor: unknown) => AnimationTimeline>(
  // @ts-ignore
  'ScrollTimeline'
);
export const setT = (isBrowser ? window.setTimeout : noop) as (
  handler: TimerHandler,
  timeout?: number
) => number;
export const clearT = (isBrowser ? window.clearTimeout : noop) as (id?: number) => void;
