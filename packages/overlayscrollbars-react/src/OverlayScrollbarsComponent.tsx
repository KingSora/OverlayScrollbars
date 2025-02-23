// keep React in the scope to not break users which aren't using react-jsx runtime (react pre v17)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import type { OverlayScrollbars, PartialOptions, EventListeners } from 'overlayscrollbars';

import type {
  ComponentPropsWithoutRef,
  ElementRef,
  ElementType,
  ForwardedRef,
  ReactElement,
} from 'react';
import { useOverlayScrollbars } from './useOverlayScrollbars';

type OverlayScrollbarsComponentBaseProps<T extends ElementType = 'div'> =
  ComponentPropsWithoutRef<T> & {
    /** Tag of the root element. */
    element?: T;
    /** OverlayScrollbars options. */
    options?: PartialOptions | false | null;
    /** OverlayScrollbars events. */
    events?: EventListeners | false | null;
    /** Whether to defer the initialization to a point in time when the browser is idle. (or to the next frame if `window.requestIdleCallback` is not supported) */
    defer?: boolean | IdleRequestOptions;
  };

export type OverlayScrollbarsComponentProps<T extends ElementType = 'div'> =
  OverlayScrollbarsComponentBaseProps<T> & {
    ref?: ForwardedRef<OverlayScrollbarsComponentRef<T>>;
  };

export interface OverlayScrollbarsComponentRef<T extends ElementType = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): ElementRef<T> | null;
}

const OverlayScrollbarsComponent = <T extends ElementType = 'div'>(
  props: T extends ElementType ? OverlayScrollbarsComponentBaseProps<T> : never,
  ref: ForwardedRef<OverlayScrollbarsComponentRef<T>>
): ReactElement | null => {
  const { element = 'div', options, events, defer, children, ...other } = props;
  const Tag = element;
  const elementRef = useRef<ElementRef<T>>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [initialize, osInstance] = useOverlayScrollbars({ options, events, defer });

  useEffect(() => {
    const { current: elm } = elementRef;
    const { current: contentsElm } = childrenRef;

    /* c8 ignore start */
    if (!elm) {
      return;
    }
    /* c8 ignore end */

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
              viewport: contentsElm,
              content: contentsElm,
            },
          }
    );

    return () => osInstance()?.destroy();
  }, [initialize, osInstance, element]);

  useImperativeHandle(ref, () => {
    return {
      osInstance,
      getElement: () => elementRef.current,
    };
  }, [osInstance]);

  return (
    <Tag data-overlayscrollbars-initialize="" ref={elementRef} {...other}>
      {element === 'body' ? (
        children
      ) : (
        <div data-overlayscrollbars-contents="" ref={childrenRef}>
          {children}
        </div>
      )}
    </Tag>
  );
};

const OverlayScrollbarsComponentForwardedRef = forwardRef(OverlayScrollbarsComponent) as <
  T extends ElementType = 'div',
>(
  props: OverlayScrollbarsComponentProps<T>
) => ReturnType<typeof OverlayScrollbarsComponent>;

export { OverlayScrollbarsComponentForwardedRef as OverlayScrollbarsComponent };
