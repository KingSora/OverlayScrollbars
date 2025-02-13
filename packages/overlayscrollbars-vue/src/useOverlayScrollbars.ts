import { onUnmounted, shallowRef, unref, watch } from 'vue';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { Ref, UnwrapRef } from 'vue';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent.types';

type Defer = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestDefer: (callback: () => any, options?: OverlayScrollbarsComponentProps['defer']) => void,
  cancelDefer: () => void,
];

export interface UseOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?:
    | OverlayScrollbarsComponentProps['options']
    | Ref<OverlayScrollbarsComponentProps['options']>;
  /** OverlayScrollbars events. */
  events?:
    | OverlayScrollbarsComponentProps['events']
    | Ref<OverlayScrollbarsComponentProps['events']>;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?: OverlayScrollbarsComponentProps['defer'] | Ref<OverlayScrollbarsComponentProps['defer']>;
}

export type UseOverlayScrollbarsInitialization = (target: InitializationTarget) => void;

export type UseOverlayScrollbarsInstance = () => ReturnType<
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

/**
 * Composable for advanced usage of OverlayScrollbars. (When the OverlayScrollbarsComponent is not enough)
 * @param params Parameters for customization.
 * @returns A tuple with two values:
 * The first value is the initialization function, it takes one argument which is the `InitializationTarget` and returns the OverlayScrollbars instance.
 * The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.
 */
export const useOverlayScrollbars = (
  params?: UseOverlayScrollbarsParams | Ref<UseOverlayScrollbarsParams | undefined>
): [UseOverlayScrollbarsInitialization, UseOverlayScrollbarsInstance] => {
  let instance: ReturnType<UseOverlayScrollbarsInstance> = null;
  let options: UnwrapRef<UseOverlayScrollbarsParams['options']>;
  let events: UnwrapRef<UseOverlayScrollbarsParams['events']>;
  let defer: UnwrapRef<UseOverlayScrollbarsParams['defer']>;
  const paramsRef = shallowRef(params || {});
  const [requestDefer, clearDefer] = createDefer();

  watch(
    () => unref(paramsRef.value?.defer),
    (currDefer) => {
      defer = currDefer;
    },
    { deep: true, immediate: true }
  );

  watch(
    () => unref(paramsRef.value?.options),
    (currOptions) => {
      options = currOptions;

      if (OverlayScrollbars.valid(instance)) {
        instance.options(options || {}, true);
      }
    },
    { deep: true, immediate: true }
  );

  watch(
    () => unref(paramsRef.value?.events),
    (currEvents) => {
      events = currEvents;

      if (OverlayScrollbars.valid(instance)) {
        instance.on(
          /* c8 ignore next */
          events || {},
          true
        );
      }
    },
    { deep: true, immediate: true }
  );

  onUnmounted(() => {
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
