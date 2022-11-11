import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import type { OverlayScrollbars } from 'overlayscrollbars';
import type { PartialOptions, EventListeners } from 'overlayscrollbars';
import type { ComponentPropsWithoutRef, ElementRef, ForwardedRef } from 'react';
import { useOverlayScrollbars } from './useOverlayScrollbars';

export type OverlayScrollbarsComponentProps<T extends keyof JSX.IntrinsicElements = 'div'> =
  ComponentPropsWithoutRef<T> & {
    /** Tag of the root element. */
    element?: T;
    /** OverlayScrollbars options. */
    options?: PartialOptions | false | null;
    /** OverlayScrollbars events. */
    events?: EventListeners | false | null;
  };

export interface OverlayScrollbarsComponentRef<T extends keyof JSX.IntrinsicElements = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  osInstance(): OverlayScrollbars | null;
  /** Returns the root element. */
  getElement(): ElementRef<T> | null;
}

const OverlayScrollbarsComponent = <T extends keyof JSX.IntrinsicElements>(
  props: OverlayScrollbarsComponentProps<T>,
  ref: ForwardedRef<OverlayScrollbarsComponentRef<T>>
) => {
  const { element = 'div', options, events, children, ...other } = props;
  const Tag = element;
  const elementRef = useRef<ElementRef<T>>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [initialize, osInstance] = useOverlayScrollbars({ options, events });

  useEffect(() => {
    const { current: elm } = elementRef;
    const { current: childrenElm } = childrenRef;
    if (elm && childrenElm) {
      const instance = initialize({
        target: elm as any,
        elements: {
          viewport: childrenElm,
          content: childrenElm,
        },
      });

      return () => instance.destroy();
    }
  }, [initialize, element]);

  useImperativeHandle(
    ref,
    () => {
      return {
        osInstance,
        getElement: () => elementRef.current,
      };
    },
    []
  );

  return (
    // @ts-ignore
    <Tag data-overlayscrollbars-initialize="" ref={elementRef} {...other}>
      <div ref={childrenRef}>{children}</div>
    </Tag>
  );
};

const OverlayScrollbarsComponentForwardedRef = forwardRef(OverlayScrollbarsComponent) as <
  T extends keyof JSX.IntrinsicElements
>(
  props: OverlayScrollbarsComponentProps<T> & {
    ref?: ForwardedRef<OverlayScrollbarsComponentRef<T>>;
  }
) => ReturnType<typeof OverlayScrollbarsComponent>;

export { OverlayScrollbarsComponentForwardedRef as OverlayScrollbarsComponent };
