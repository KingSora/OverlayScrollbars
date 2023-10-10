import { isBrowser } from './isBrowser';
import { jsAPI } from './vendors';
import { noop } from '../utils/noop';
import { wnd } from '../utils/alias';

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
export const setT = (isBrowser ? wnd.setTimeout : noop) as (
  handler: TimerHandler,
  timeout?: number
) => number;
export const clearT = (isBrowser ? wnd.clearTimeout : noop) as (id?: number) => void;
