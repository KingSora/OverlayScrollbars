import { OverlayScrollbars } from 'overlayscrollbars';
import {
  isSignal,
  noSerialize,
  useSignal,
  useTask$,
  useVisibleTask$,
  useComputed$,
} from '@qwik.dev/core';
import type { Signal, NoSerialize, QRL, ReadonlySignal } from '@qwik.dev/core';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent';
import type { PossibleQRL, PossibleSignal } from './types';

export interface UseOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?: PossibleSignal<OverlayScrollbarsComponentProps['options']>;
  /** OverlayScrollbars events. */
  events?: PossibleSignal<OverlayScrollbarsComponentProps['events']>;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?: PossibleSignal<OverlayScrollbarsComponentProps['defer']>;
}

export type UseOverlayScrollbarsInitialization = (target: InitializationTarget) => void;

export type UseOverlayScrollbarsInstance = () => ReturnType<
  OverlayScrollbarsComponentRef['osInstance']
>;

type Defer = [
  requestDefer: (callback: () => any, options?: boolean | IdleRequestOptions) => void,
  cancelDefer: () => void,
];

const createDefer = (): Defer => {
  /* c8 ignore start */
  if (typeof window === 'undefined') {
    // mock ssr calls with "noop"
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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

const unwrapSignal = <T>(obj: Signal<T> | T): T => (isSignal(obj) ? obj.value : obj);

const unwrapQRL = async <T>(obj: QRL<() => T> | T): Promise<T> =>
  typeof obj === 'function' ? await (obj as QRL<() => T>)() : obj;

const unwrapPossibleSignalPossibleQrl = async <T>(
  possibleSignalPossibleQrl: PossibleSignal<PossibleQRL<T>>
): Promise<T> => unwrapQRL(unwrapSignal(possibleSignalPossibleQrl));

const unwrapParams = async (
  params?: PossibleSignal<PossibleQRL<UseOverlayScrollbarsParams | undefined>>
): Promise<UseOverlayScrollbarsParams> => (await unwrapPossibleSignalPossibleQrl(params)) || {};

export const useOverlayScrollbars = (
  params?: PossibleSignal<PossibleQRL<UseOverlayScrollbarsParams | undefined>>
): [
  ReadonlySignal<NoSerialize<UseOverlayScrollbarsInitialization>>,
  ReadonlySignal<NoSerialize<UseOverlayScrollbarsInstance>>,
] => {
  const instance = useSignal<NoSerialize<OverlayScrollbars> | null>(null);
  const osInitialize = useSignal<NoSerialize<UseOverlayScrollbarsInitialization>>();
  const osInstance = useSignal<NoSerialize<UseOverlayScrollbarsInstance>>();

  useTask$(async ({ track }) => {
    const { options } = await track(() => unwrapParams(params));
    const unwrappedOptions = await track(() => unwrapPossibleSignalPossibleQrl(options));
    const unwrappedInstance = unwrapSignal(instance);

    if (OverlayScrollbars.valid(unwrappedInstance)) {
      unwrappedInstance.options(unwrappedOptions || {}, true);
    }
  });

  useTask$(async ({ track }) => {
    const { events } = await track(() => unwrapParams(params));
    const unwrappedEvents = await track(() => unwrapPossibleSignalPossibleQrl(events));
    const unwrappedInstance = unwrapSignal(instance);

    if (OverlayScrollbars.valid(unwrappedInstance)) {
      unwrappedInstance.on(unwrappedEvents || {}, true);
    }
  });

  useVisibleTask$(
    async ({ cleanup }) => {
      const [requestDefer, cancelDefer] = createDefer();
      osInitialize.value = noSerialize(async (target: InitializationTarget) => {
        // if already initialized do nothing
        if (OverlayScrollbars.valid(instance.value)) {
          return;
        }

        const { options, events, defer } = await unwrapParams(params);
        const currOptions = await unwrapPossibleSignalPossibleQrl(options);
        const currEvents = await unwrapPossibleSignalPossibleQrl(events);
        const currDefer = await unwrapPossibleSignalPossibleQrl(defer);

        const init = () => {
          instance.value = noSerialize(
            OverlayScrollbars(target, currOptions || {}, currEvents || {})
          );
        };

        if (currDefer && requestDefer) {
          requestDefer(init, currDefer);
        } else {
          init();
        }
      });
      osInstance.value = noSerialize(() => instance.value || null);

      cleanup(() => {
        cancelDefer();
        instance.value?.destroy();
      });
    },
    { strategy: 'document-idle' }
  );

  return [useComputed$(() => osInitialize.value), useComputed$(() => osInstance.value)];
};
