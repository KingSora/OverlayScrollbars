import {
  Slot,
  component$,
  noSerialize,
  useSignal,
  useVisibleTask$,
  type QwikIntrinsicElements,
} from '@builder.io/qwik';
import type { NoSerialize } from '@builder.io/qwik';
import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';
import { useOverlayScrollbars } from './useOverlayScrollbars';

type InferGenericElement<T> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : HTMLElement;

export type OverlayScrollbarsComponentProps<T extends keyof QwikIntrinsicElements = 'div'> =
  QwikIntrinsicElements[T] & {
    /** Tag of the root element. */
    element?: T;
    /** OverlayScrollbars options. */
    options?: PartialOptions | false | null;
    /** OverlayScrollbars events. */
    events?: EventListeners | false | null;
    /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
    defer?: boolean | IdleRequestOptions;
    /** OverlayScrollbarsComponent ref. */
    ref?: (ref: NoSerialize<OverlayScrollbarsComponentRef<T>>) => void;
  };

export interface OverlayScrollbarsComponentRef<T extends keyof QwikIntrinsicElements = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): NoSerialize<OverlayScrollbars> | null;
  /** Returns the root element. */
  getElement(): InferGenericElement<T> | null;
}

export const OverlayScrollbarsComponent = component$(
  <T extends keyof QwikIntrinsicElements = 'div'>({
    element,
    options,
    events,
    defer,
    ref,
    ...other
  }: OverlayScrollbarsComponentProps<T>) => {
    const Tag = (element || 'div') as string;
    const [initialize, osInstance] = useOverlayScrollbars({ options, events, defer }) || [];
    const elementRef = useSignal<InferGenericElement<T>>();
    const slotRef = useSignal<HTMLElement>();

    useVisibleTask$(({ track }) => {
      if (ref) {
        track(() =>
          ref(
            noSerialize({
              osInstance: () => osInstance.value?.() || null,
              getElement: () =>
                /* c8 ignore next */
                elementRef.value || null,
            })
          )
        );
      }
    });

    useVisibleTask$(({ track, cleanup }) => {
      const elm = track(() => elementRef.value);
      const slotElm = track(() => slotRef.value);

      /* c8 ignore start */
      if (!elm) {
        return;
      }
      /* c8 ignore end */

      const target = elm as unknown as HTMLElement;

      track(() =>
        initialize.value?.(
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
        )
      );

      cleanup(() => {
        osInstance.value?.()?.destroy();
      });
    });

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
