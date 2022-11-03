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
  instance(): OverlayScrollbars | null;
  /** Returns the root element. */
  element(): ElementRef<T> | null;
}

const OverlayScrollbarsComponent = <T extends keyof JSX.IntrinsicElements>(
  props: OverlayScrollbarsComponentProps<T>,
  ref: ForwardedRef<OverlayScrollbarsComponentRef<T>>
) => {
  const { element = 'div', options, events, children, ...other } = props;
  const Tag = element;
  const elementRef = useRef<ElementRef<T>>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [initialize, instance] = useOverlayScrollbars({ options, events });

  useEffect(() => {
    const { current: elm } = elementRef;
    const { current: childrenElm } = childrenRef;
    if (elm && childrenElm) {
      const osInstance = initialize({
        target: elm as any,
        elements: {
          viewport: childrenElm,
          content: childrenElm,
        },
      });

      return () => osInstance.destroy();
    }
  }, [initialize, element]);

  useImperativeHandle(
    ref,
    () => {
      return {
        instance,
        element: () => elementRef.current,
      };
    },
    []
  );

  return (
    // @ts-ignore
    <Tag data-overlayscrollbars="" {...other} ref={elementRef}>
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
