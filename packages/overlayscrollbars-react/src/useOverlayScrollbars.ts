import { useEffect, useMemo, useRef } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent';

export interface UseOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?: OverlayScrollbarsComponentProps['options'];
  /** OverlayScrollbars events. */
  events?: OverlayScrollbarsComponentProps['events'];
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?: OverlayScrollbarsComponentProps['defer'];
}

export type UseOverlayScrollbarsInitialization = (target: InitializationTarget) => void;

export type UseOverlayScrollbarsInstance = () => ReturnType<
  OverlayScrollbarsComponentRef['osInstance']
>;

type Defer = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestDefer: (callback: () => any, options?: OverlayScrollbarsComponentProps['defer']) => void,
  cancelDefer: () => void,
];

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

/**
 * Hook for advanced usage of OverlayScrollbars. (When the OverlayScrollbarsComponent is not enough)
 * @param params Parameters for customization.
 * @returns A tuple with two values:
 * The first value is the initialization function, it takes one argument which is the `InitializationTarget`.
 * The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.
 */
export const useOverlayScrollbars = (
  params?: UseOverlayScrollbarsParams
): [UseOverlayScrollbarsInitialization, UseOverlayScrollbarsInstance] => {
  const { options, events, defer } = params || {};
  const [requestDefer, cancelDefer] = useMemo<Defer>(createDefer, []);
  const instanceRef = useRef<ReturnType<UseOverlayScrollbarsInstance>>(null);
  const deferRef = useRef(defer);
  const optionsRef = useRef(options);
  const eventsRef = useRef(events);

  useEffect(() => {
    deferRef.current = defer;
  }, [defer]);

  useEffect(() => {
    const { current: instance } = instanceRef;

    optionsRef.current = options;

    if (OverlayScrollbars.valid(instance)) {
      instance.options(options || {}, true);
    }
  }, [options]);

  useEffect(() => {
    const { current: instance } = instanceRef;

    eventsRef.current = events;

    if (OverlayScrollbars.valid(instance)) {
      instance.on(events || {}, true);
    }
  }, [events]);

  useEffect(
    () => () => {
      cancelDefer();
      instanceRef.current?.destroy();
    },
    []
  );

  return useMemo<[UseOverlayScrollbarsInitialization, UseOverlayScrollbarsInstance]>(
    () => [
      (target) => {
        // if already initialized do nothing
        const presentInstance = instanceRef.current;
        if (OverlayScrollbars.valid(presentInstance)) {
          return;
        }

        const currOptions = optionsRef.current;
        const currEvents = eventsRef.current;
        const currDefer = deferRef.current;
        const init = () =>
          (instanceRef.current = OverlayScrollbars(target, currOptions || {}, currEvents || {}));

        if (currDefer) {
          requestDefer(init, currDefer);
        } else {
          init();
        }
      },
      () => instanceRef.current,
    ],
    []
  );
};
