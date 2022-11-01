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
    options?: PartialOptions;
    /** OverlayScrollbars events. */
    events?: EventListeners;
  };

export interface OverlayScrollbarsComponentRef<T extends keyof JSX.IntrinsicElements = 'div'> {
  /** Returns the OverlayScrollbars instance or null if not initialized. */
  instance(): OverlayScrollbars | null;
  /** Returns the target element. */
  target(): ElementRef<T> | null;
}

const OverlayScrollbarsComponent = <T extends keyof JSX.IntrinsicElements>(
  props: OverlayScrollbarsComponentProps<T>,
  ref: ForwardedRef<OverlayScrollbarsComponentRef<T>>
) => {
  const { element = 'div', options, events, children, ...other } = props;
  const Tag = element;

  const [initialize, instance] = useOverlayScrollbars(options, events);
  const osTargetRef = useRef<ElementRef<T>>(null);
  const osChildrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current: targetElm } = osTargetRef;
    const { current: childrenElm } = osChildrenRef;
    if (targetElm && childrenElm) {
      const osInstance = initialize({
        target: targetElm as any,
        elements: {
          viewport: childrenElm,
          content: childrenElm,
        },
      });

      return () => osInstance.destroy();
    }
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        instance,
        target: () => osTargetRef.current,
      };
    },
    []
  );

  return (
    // @ts-ignore
    <Tag data-overlayscrollbars="" {...other} ref={osTargetRef}>
      <div ref={osChildrenRef}>{children}</div>
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
