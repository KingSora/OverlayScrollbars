import {
  mergeProps,
  splitProps,
  children,
  onCleanup,
  createEffect,
  createRenderEffect,
  createSignal,
  onMount,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { JSX, ParentProps, ComponentProps, Ref } from 'solid-js';
import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';
import { createOverlayScrollbars } from './createOverlayScrollbars';

type InferGeneric<T> = T extends JSX.HTMLAttributes<infer G> ? G : never;

export type OverlayScrollbarsComponentProps<T extends keyof JSX.IntrinsicElements = 'div'> = Omit<
  ComponentProps<T>,
  'ref'
> &
  ParentProps<{
    /** Tag of the root element. */
    element?: T;
    /** OverlayScrollbars options. */
    options?: PartialOptions | false | null;
    /** OverlayScrollbars events. */
    events?: EventListeners | false | null;
    /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
    defer?: boolean | IdleRequestOptions;
    /** OverlayScrollbarsComponent ref. */
    ref?: Exclude<Ref<OverlayScrollbarsComponentRef>, OverlayScrollbarsComponentRef>;
  }>;

export interface OverlayScrollbarsComponentRef<T extends keyof JSX.IntrinsicElements = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): InferGeneric<JSX.IntrinsicElements[T]> | null;
}

export const OverlayScrollbarsComponent = <T extends keyof JSX.IntrinsicElements = 'div'>(
  props: OverlayScrollbarsComponentProps<T>
) => {
  const [finalProps, other] = splitProps(
    mergeProps({ element: 'div' }, props as OverlayScrollbarsComponentProps),
    ['element', 'options', 'events', 'defer', 'ref', 'children']
  );
  const [elementRef, setElementRef] = createSignal<HTMLDivElement | undefined>();
  const [childrenRef, setChildrenRef] = createSignal<HTMLDivElement | undefined>();
  const [hydrated, setHydrated] = createSignal(false);
  const [initialize, instance] = createOverlayScrollbars(finalProps);

  onMount(async () => {
    setHydrated(true);
  });

  createEffect(() => {
    const currElement = elementRef();
    const currChildrenElement = childrenRef();

    if (currElement && currChildrenElement) {
      initialize({
        target: currElement,
        elements: {
          viewport: currChildrenElement,
          content: currChildrenElement,
        },
      });

      onCleanup(() => {
        instance()?.destroy();
      });
    }
  });

  createRenderEffect(() => {
    finalProps.ref?.({
      osInstance: instance,
      getElement: () =>
        /* c8 ignore next */
        elementRef() || null,
    });
  });

  return (
    <Dynamic
      component={finalProps.element}
      data-overlayscrollbars-initialize=""
      ref={(ref: any) => {
        setElementRef(ref);
      }}
      {...other}
    >
      {hydrated() ? (
        <div
          ref={(ref: any) => {
            setChildrenRef(ref);
          }}
        >
          {children(() => finalProps.children)}
        </div>
      ) : (
        children(() => finalProps.children)
      )}
    </Dynamic>
  );
};
