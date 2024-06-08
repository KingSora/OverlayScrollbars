import { OverlayScrollbars } from 'overlayscrollbars';
import { isSignal, noSerialize, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import type { Signal, NoSerialize } from '@builder.io/qwik';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent';

type Defer = [
  requestDefer: (callback: () => any, options?: OverlayScrollbarsComponentProps['defer']) => void,
  cancelDefer: () => void
];

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

const createDefer = (): Defer => {
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

const unwrapSignal = <T>(obj: Signal<T> | T): T => (isSignal(obj) ? obj.value : obj);

export const useOverlayScrollbars = (
  params?: UseOverlayScrollbarsParams | Signal<UseOverlayScrollbarsParams | undefined>
): [
  Signal<NoSerialize<UseOverlayScrollbarsInitialization>>,
  Signal<NoSerialize<UseOverlayScrollbarsInstance>>
] => {
  const instance = useSignal<NoSerialize<OverlayScrollbars> | null>(null);
  const deferInstance = useSignal<NoSerialize<Defer>>();
  const osInitialize = useSignal<NoSerialize<UseOverlayScrollbarsInitialization>>();
  const getInstance = useSignal<NoSerialize<UseOverlayScrollbarsInstance>>();

  useTask$(({ track }) => {
    const options = track(() => unwrapSignal(params))?.options;

    if (OverlayScrollbars.valid(instance)) {
      instance.options(options || {}, true);
    }
  });

  useTask$(({ track }) => {
    const events = track(() => unwrapSignal(params))?.events;

    if (OverlayScrollbars.valid(instance)) {
      instance.on(events || {}, true);
    }
  });

  useVisibleTask$(({ cleanup }) => {
    deferInstance.value = noSerialize(createDefer());
    osInitialize.value = noSerialize((target: InitializationTarget) => {
      // if already initialized do nothing
      if (OverlayScrollbars.valid(instance)) {
        return;
      }
      const { options: currOptions, events: currEvents, defer } = unwrapSignal(params) || {};
      const [requestDefer] = deferInstance.value || [];

      const init = () =>
        (instance.value = noSerialize(
          OverlayScrollbars(target, currOptions || {}, currEvents || {})
        ));

      if (defer && requestDefer) {
        requestDefer(init, defer);
      } else {
        init();
      }
    });
    getInstance.value = noSerialize(() => instance.value || null);

    cleanup(() => {
      const [, clearDefer] = deferInstance.value || [];
      clearDefer?.();
      instance.value?.destroy();
    });
  });

  return [osInitialize, getInstance];
};
