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

export interface CreateOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?:
    | OverlayScrollbarsComponentProps['options']
    | Signal<OverlayScrollbarsComponentProps['options']>;
  /** OverlayScrollbars events. */
  events?:
    | OverlayScrollbarsComponentProps['events']
    | Signal<OverlayScrollbarsComponentProps['events']>;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?:
    | OverlayScrollbarsComponentProps['defer']
    | Signal<OverlayScrollbarsComponentProps['defer']>;
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
  params?: CreateOverlayScrollbarsParams | Signal<CreateOverlayScrollbarsParams | undefined>
): [
  Signal<NoSerialize<UseOverlayScrollbarsInitialization>>,
  Signal<NoSerialize<UseOverlayScrollbarsInstance>>
] => {
  const instance = useSignal<NoSerialize<OverlayScrollbars> | null>(null);
  const options = useSignal<OverlayScrollbarsComponentProps['options']>();
  const events = useSignal<OverlayScrollbarsComponentProps['events']>();
  const defer = useSignal<OverlayScrollbarsComponentProps['defer']>();
  const deferInstance = useSignal<NoSerialize<Defer>>();
  const osInitialize = useSignal<NoSerialize<UseOverlayScrollbarsInitialization>>();
  const getInstance = useSignal<NoSerialize<UseOverlayScrollbarsInstance>>();

  useTask$(({ track }) => {
    defer.value = track(() => unwrapSignal(unwrapSignal(params)?.defer));
  });

  useTask$(({ track }) => {
    options.value = track(() => unwrapSignal(unwrapSignal(params)?.options));

    if (OverlayScrollbars.valid(instance)) {
      instance.options(options.value || {}, true);
    }
  });

  useTask$(({ track }) => {
    events.value = track(() => unwrapSignal(unwrapSignal(params)?.events));

    if (OverlayScrollbars.valid(instance)) {
      instance.on(events.value || {}, true);
    }
  });

  useVisibleTask$(({ cleanup }) => {
    deferInstance.value = noSerialize(createDefer());
    osInitialize.value = noSerialize((target: InitializationTarget) => {
      // if already initialized do nothing
      if (OverlayScrollbars.valid(instance)) {
        return;
      }
      const currDefer = defer.value;
      const currOptions = options.value || {};
      const currEvents = events.value || {};
      const [requestDefer] = deferInstance.value || [];
      const init = () =>
        (instance.value = noSerialize(OverlayScrollbars(target, currOptions, currEvents)));

      if (defer && requestDefer) {
        requestDefer(init, currDefer);
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
