import {
  mergeProps,
  splitProps,
  children,
  onCleanup,
  createEffect,
  createRenderEffect,
  createSignal,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { JSX, ParentProps, ComponentProps, Ref, ValidComponent } from 'solid-js';
import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';
import { createOverlayScrollbars } from './createOverlayScrollbars';

type InferGenericElement<T> = T extends keyof JSX.HTMLAttributes<infer G> ? G : HTMLElement;

export type OverlayScrollbarsComponentProps<T extends ValidComponent = 'div'> = Omit<
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
    ref?: Ref<OverlayScrollbarsComponentRef<T>>;
  }>;

export interface OverlayScrollbarsComponentRef<T extends ValidComponent = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): InferGenericElement<T> | null;
}

export const OverlayScrollbarsComponent = <T extends ValidComponent = 'div'>(
  props: OverlayScrollbarsComponentProps<T>
) => {
  const [finalProps, other] = splitProps(
    mergeProps({ element: 'div' }, props as OverlayScrollbarsComponentProps),
    ['element', 'options', 'events', 'defer', 'ref', 'children']
  );
  const [elementRef, setElementRef] = createSignal<HTMLDivElement | undefined>();
  const [childrenRef, setChildrenRef] = createSignal<HTMLDivElement | undefined>();
  const [initialize, instance] = createOverlayScrollbars(finalProps);
  // https://github.com/KingSora/OverlayScrollbars/issues/700
  // use the children helper outside of jsx: https://docs.solidjs.com/reference/component-apis/children
  const resolvedChildren = children(() => finalProps.children);

  createEffect(() => {
    const target = elementRef();
    const contentsElement = childrenRef();

    /* c8 ignore start */
    if (!target) {
      return;
    }
    /* c8 ignore end */

    initialize(
      finalProps.element === 'body'
        ? {
            target,
            cancel: {
              body: null,
            },
          }
        : {
            target,
            elements: {
              viewport: contentsElement,
              content: contentsElement,
            },
          }
    );

    onCleanup(() => {
      instance()?.destroy();
    });
  });

  createRenderEffect(() => {
    const ref = {
      osInstance: instance,
      getElement: () =>
        /* c8 ignore next */
        elementRef() || null,
    };

    if (typeof finalProps.ref === 'function') {
      finalProps.ref(ref);
    } else {
      finalProps.ref = ref;
    }
  });

  return (
    <Dynamic
      component={finalProps.element}
      data-overlayscrollbars-initialize=""
      ref={setElementRef}
      {...other}
    >
      {finalProps.element === 'body' ? (
        resolvedChildren()
      ) : (
        <div data-overlayscrollbars-contents="" ref={setChildrenRef}>
          {resolvedChildren()}
        </div>
      )}
    </Dynamic>
  );
};
