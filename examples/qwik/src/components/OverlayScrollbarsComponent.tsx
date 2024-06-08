import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { FunctionComponent, NoSerialize, PropsOf } from '@builder.io/qwik';
import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';
import type { UseOverlayScrollbarsParams } from './useOverlayScrollbars';
import { useOverlayScrollbars } from './useOverlayScrollbars';

type InferGenericElement<T> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : HTMLElement;

export type OverlayScrollbarsComponentProps<T extends string | FunctionComponent = 'div'> =
  PropsOf<T> & {
    /** Tag of the root element. */
    element?: T;
    /** OverlayScrollbars options. */
    options?: NoSerialize<PartialOptions> | PartialOptions | false | null;
    /** OverlayScrollbars events. */
    events?: NoSerialize<EventListeners> | EventListeners | false | null;
    /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
    defer?: boolean | IdleRequestOptions;
    /** OverlayScrollbarsComponent ref. */
    ref?: (ref: NoSerialize<OverlayScrollbarsComponentRef<T>>) => void;
  };

export interface OverlayScrollbarsComponentRef<T extends string | FunctionComponent = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): NoSerialize<OverlayScrollbars> | null;
  /** Returns the root element. */
  getElement(): InferGenericElement<T> | null;
}

export const OverlayScrollbarsComponent = component$(
  <T extends string | FunctionComponent = 'div'>({
    element,
    options,
    events,
    defer,
    ...other
  }: OverlayScrollbarsComponentProps<T>) => {
    const Tag = element || 'div';
    const params = useSignal<UseOverlayScrollbarsParams>({ options, events, defer });
    const [initialize, osInstance] = useOverlayScrollbars(params) || [];
    const elementRef = useSignal<InferGenericElement<T>>();
    const slotRef = useSignal<HTMLElement>();
    const rendered = useSignal(false);

    console.log('render', { options, events, defer });

    // useVisibleTask$(({ track }) => {
    //   if (ref) {
    //     track(() =>
    //       ref(
    //         noSerialize({
    //           osInstance: () => osInstance.value?.() || null,
    //           getElement: () =>
    //             /* c8 ignore next */
    //             elementRef.value || null,
    //         })
    //       )
    //     );
    //   }
    // });
    useVisibleTask$(({ track }) => {
      track(rendered);
      console.log('AAA', { options, events, defer });
      params.value = { options, events, defer };
    });

    useVisibleTask$(({ track, cleanup }) => {
      const elm = elementRef.value;
      const slotElm = slotRef.value;

      /* c8 ignore start */
      if (!elm || !track(rendered)) {
        rendered.value = true;
        return;
      }
      /* c8 ignore end */

      const target = elm as unknown as HTMLElement;

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
      );

      cleanup(() => {
        osInstance.value?.()?.destroy();
      });
    });

    // https://github.com/QwikDev/qwik/issues/6465
    // @ts-ignore
    other['data-overlayscrollbars-initialize'] = '';
    // @ts-ignore
    other.ref = elementRef;

    return (
      <Tag {...(other as any)}>
        {/** https://github.com/QwikDev/qwik/issues/6464#issuecomment-2154452328 */}
        {!rendered.value && <></>}
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
