import { createRenderEffect, onCleanup } from 'solid-js';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { Accessor } from 'solid-js';
import type { Store } from 'solid-js/store';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent';

type Defer = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestDefer: (callback: () => any, options?: OverlayScrollbarsComponentProps['defer']) => void,
  cancelDefer: () => void,
];

export interface CreateOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?:
    | OverlayScrollbarsComponentProps['options']
    | Accessor<OverlayScrollbarsComponentProps['options']>;
  /** OverlayScrollbars events. */
  events?:
    | OverlayScrollbarsComponentProps['events']
    | Accessor<OverlayScrollbarsComponentProps['events']>;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?:
    | OverlayScrollbarsComponentProps['defer']
    | Accessor<OverlayScrollbarsComponentProps['defer']>;
}

export type CreateOverlayScrollbarsInitialization = (target: InitializationTarget) => void;

export type CreateOverlayScrollbarsInstance = () => ReturnType<
  OverlayScrollbarsComponentRef['osInstance']
>;

const createDefer = (): Defer => {
  /* c8 ignore start */
  if (typeof window === 'undefined') {
    // mock ssr calls with "noop"

    const noop = () => {};
    return [noop, noop];
  }
  /* c8 ignore end */

  let idleId: number;
  let rafId: number;
  const wnd = window;
  const idleSupported = typeof wnd.requestIdleCallback === 'function';
  const rAF = wnd.requestAnimationFrame;
  const cAF = wnd.cancelAnimationFrame;
  const rIdle = idleSupported ? wnd.requestIdleCallback : rAF;
  const cIdle = idleSupported ? wnd.cancelIdleCallback : cAF;
  const clear = () => {
    cIdle(idleId);
    cAF(rafId);
  };

  return [
    (callback, options) => {
      clear();
      idleId = rIdle(
        idleSupported
          ? () => {
              clear();
              // inside idle its best practice to use rAF to change DOM for best performance
              rafId = rAF(callback);
            }
          : callback,
        typeof options === 'object' ? options : { timeout: 2233 }
      );
    },
    clear,
  ];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAccessor = (obj: any): obj is Accessor<any> => typeof obj === 'function';
const unwrapAccessor = <T>(obj: Accessor<T> | T): T => (isAccessor(obj) ? obj() : obj);

export const createOverlayScrollbars = (
  params?:
    | CreateOverlayScrollbarsParams
    | Accessor<CreateOverlayScrollbarsParams | undefined>
    | Store<CreateOverlayScrollbarsParams | undefined>
): [CreateOverlayScrollbarsInitialization, CreateOverlayScrollbarsInstance] => {
  let instance: OverlayScrollbars | null = null;
  let options: OverlayScrollbarsComponentProps['options'];
  let events: OverlayScrollbarsComponentProps['events'];
  let defer: OverlayScrollbarsComponentProps['defer'];
  const [requestDefer, clearDefer] = createDefer();

  createRenderEffect(() => {
    defer = unwrapAccessor(unwrapAccessor(params)?.defer);
  });

  createRenderEffect(() => {
    options = unwrapAccessor(unwrapAccessor(params)?.options);

    if (OverlayScrollbars.valid(instance)) {
      instance.options(options || {}, true);
    }
  });

  createRenderEffect(() => {
    events = unwrapAccessor(unwrapAccessor(params)?.events);

    if (OverlayScrollbars.valid(instance)) {
      instance.on(events || {}, true);
    }
  });

  onCleanup(() => {
    clearDefer();
    instance?.destroy();
  });

  return [
    (target) => {
      // if already initialized do nothing
      if (OverlayScrollbars.valid(instance)) {
        return instance;
      }

      const init = () => (instance = OverlayScrollbars(target, options || {}, events || {}));

      if (defer) {
        requestDefer(init, defer);
      } else {
        init();
      }
    },
    () => instance,
  ];
};
