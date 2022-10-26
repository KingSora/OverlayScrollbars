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
  osInstance(): OverlayScrollbars | null;
  osTarget(): ElementRef<T> | null;
}

const OverlayScrollbarsComponent = <T extends keyof JSX.IntrinsicElements>(
  props: OverlayScrollbarsComponentProps<T>,
  ref: ForwardedRef<OverlayScrollbarsComponentRef<T>>
) => {
  const { element = 'div', options, events, ...other } = props;
  const Tag = element;

  const osTargetRef = useRef<ElementRef<T>>(null);
  const osInstanceRef = useRef<OverlayScrollbars | null>(null);

  useEffect(() => {
    const { current: target } = osTargetRef;
    if (target) {
      const instance = OverlayScrollbars(target as any, options || {});
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
        osInstance: () => osInstanceRef.current,
        osTarget: () => osTargetRef.current,
      };
    },
    []
  );

  // @ts-ignore
  return <Tag data-overlayscrollbars="" {...other} ref={osTargetRef} />;
};

const OverlayScrollbarsComponentForwardedRef = forwardRef(OverlayScrollbarsComponent) as <
  T extends keyof JSX.IntrinsicElements
>(
  props: OverlayScrollbarsComponentProps<T> & {
    ref?: ForwardedRef<OverlayScrollbarsComponentRef<T>>;
  }
) => ReturnType<typeof OverlayScrollbarsComponent>;

export { OverlayScrollbarsComponentForwardedRef as OverlayScrollbarsComponent };
