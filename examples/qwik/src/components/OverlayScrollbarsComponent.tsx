import { Slot, component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import type { FunctionComponent, PropsOf, Signal } from '@qwik.dev/core';
import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';
import type { PossibleQRL } from './types';
import { useOverlayScrollbars } from './useOverlayScrollbars';

type InferGenericElement<T> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : HTMLElement;

export type OverlayScrollbarsComponentProps<T extends string | FunctionComponent = 'div'> = Omit<
  PropsOf<string extends T ? 'div' : T>,
  'ref'
> & {
  /** Tag of the root element. */
  element?: T;
  /** OverlayScrollbars options. */
  options?: PossibleQRL<PartialOptions | false | null>;
  /** OverlayScrollbars events. */
  events?: PossibleQRL<EventListeners | false | null>;
  /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
  defer?: PossibleQRL<boolean | IdleRequestOptions>;
  /** OverlayScrollbarsComponent ref. */
  ref?: Signal<OverlayScrollbarsComponentRef<T> | undefined>;
};

export interface OverlayScrollbarsComponentRef<T extends string | FunctionComponent = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): InferGenericElement<T> | null;
}

export const OverlayScrollbarsComponent = component$(
  <T extends string | FunctionComponent = 'div'>({
    element,
    options,
    events,
    defer,
    ref,
    ...other
  }: OverlayScrollbarsComponentProps<T>) => {
    const Tag = element || 'div';
    const [osInitialize, osInstance] = useOverlayScrollbars({ options, events, defer });
    const elementRef = useSignal<InferGenericElement<T>>();
    const slotRef = useSignal<HTMLElement>();

    useVisibleTask$(
      async ({ track, cleanup }) => {
        const elm = track(elementRef);
        const slotElm = track(slotRef);
        const initialize = track(osInitialize);
        const instance = track(osInstance);

        /* c8 ignore start */
        if (!initialize || !instance || !elm) {
          return;
        }
        /* c8 ignore end */

        if (ref) {
          ref.value = {
            osInstance: instance,
            getElement: () => elm,
          };
        }

        const target = elm as unknown as HTMLElement;
        initialize(
          element === 'body'
            ? {
                target,
                cancel: {
                  body: null,
                },
              }
            : {
                target,
                elements: {
                  viewport: slotElm,
                  content: slotElm,
                },
              }
        );

        cleanup(async () => {
          if (ref) {
            ref.value = undefined;
          }
          instance()?.destroy();
        });
      },
      { strategy: 'intersection-observer' }
    );

    return (
      <Tag data-overlayscrollbars-initialize="" ref={elementRef} {...other}>
        {element === 'body' ? (
          <Slot />
        ) : (
          <div data-overlayscrollbars-contents="" ref={slotRef}>
            <Slot />
          </div>
        )}
      </Tag>
    );
  }
);
