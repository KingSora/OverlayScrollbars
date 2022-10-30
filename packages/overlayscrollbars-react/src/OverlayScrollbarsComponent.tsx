import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { PartialOptions, EventListeners } from 'overlayscrollbars';
import type { ComponentPropsWithoutRef, ElementRef, ForwardedRef } from 'react';

export type OverlayScrollbarsComponentProps<T extends keyof JSX.IntrinsicElements = 'div'> =
  ComponentPropsWithoutRef<T> & {
    element?: T;
    options?: PartialOptions;
    events?: EventListeners;
  };

export interface OverlayScrollbarsComponentRef<T extends keyof JSX.IntrinsicElements = 'div'> {
  instance(): OverlayScrollbars | null;
  target(): ElementRef<T> | null;
}

const OverlayScrollbarsComponent = <T extends keyof JSX.IntrinsicElements>(
  props: OverlayScrollbarsComponentProps<T>,
  ref: ForwardedRef<OverlayScrollbarsComponentRef<T>>
) => {
  const { element = 'div', options, events, children, ...other } = props;
  const Tag = element;

  const osTargetRef = useRef<ElementRef<T>>(null);
  const osChildrenRef = useRef<HTMLDivElement>(null);
  const osInstanceRef = useRef<OverlayScrollbars | null>(null);

  useEffect(() => {
    const { current: targetElm } = osTargetRef;
    const { current: childrenElm } = osChildrenRef;
    if (targetElm && childrenElm) {
      const instance = OverlayScrollbars(
        {
          target: targetElm as any,
          elements: {
            viewport: childrenElm,
            content: childrenElm,
          },
        },
        options || {},
        events
      );
      osInstanceRef.current = instance;

      return () => instance.destroy();
    }
  }, []);

  useEffect(() => {
    const { current: instance } = osInstanceRef;
    if (OverlayScrollbars.valid(instance) && options) {
      instance.options(options, true);
    }
  }, [options]);

  useEffect(() => {
    const { current: instance } = osInstanceRef;
    if (OverlayScrollbars.valid(instance) && events) {
      return instance.on(events);
    }
  }, [events]);

  useImperativeHandle(
    ref,
    () => {
      return {
        instance: () => osInstanceRef.current,
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
