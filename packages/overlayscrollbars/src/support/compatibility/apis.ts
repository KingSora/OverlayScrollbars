import { wnd } from '../utils/alias';

const getApi = <T>(name: string) =>
  (typeof wnd[name as keyof typeof wnd] !== 'undefined'
    ? wnd[name as keyof typeof wnd]
    : undefined) as T;

export const MutationObserverConstructor = getApi<typeof MutationObserver>('MutationObserver');
export const IntersectionObserverConstructor =
  getApi<typeof IntersectionObserver>('IntersectionObserver');
export const ResizeObserverConstructor = getApi<typeof ResizeObserver>('ResizeObserver');
export const scrollT = getApi<new (constructor: unknown) => AnimationTimeline>('ScrollTimeline');
