import { useEffect, useMemo, useRef } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { InitializationTarget } from 'overlayscrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent';

export interface UseOverlayScrollbarsParams {
  /** OverlayScrollbars options. */
  options?: OverlayScrollbarsComponentProps['options'];
  /** OverlayScrollbars events. */
  events?: OverlayScrollbarsComponentProps['events'];
}

export type UseOverlayScrollbarsInitialization = (
  target: InitializationTarget
) => OverlayScrollbars;

export type UseOverlayScrollbarsInstance = () => ReturnType<
  OverlayScrollbarsComponentRef['instance']
>;

/**
 * Hook for advanced usage of OverlayScrollbars. (When the OverlayScrollbarsComponent is not enough)
 * @param params Parameters for customization.
 * @returns A tuple with two values:
 * The first value is the initialization function, it takes one argument which is the `InitializationTarget` and returns the OverlayScrollbars instance.
 * The second value is a function which returns the current OverlayScrollbars instance or `null` if not initialized.
 */
export const useOverlayScrollbars = (
  params?: UseOverlayScrollbarsParams
): [UseOverlayScrollbarsInitialization, UseOverlayScrollbarsInstance] => {
  const { options, events } = params || {};
  const osInstanceRef = useRef<ReturnType<UseOverlayScrollbarsInstance>>(null);
  const optionsRef = useRef(options);
  const eventsRef = useRef(events);

  useEffect(() => {
    const { current: instance } = osInstanceRef;
    if (OverlayScrollbars.valid(instance)) {
      instance.options(options || {}, true);
    }
  }, [options]);

  useEffect(() => {
    const { current: instance } = osInstanceRef;
    if (OverlayScrollbars.valid(instance)) {
      instance.on(events || {}, true);
    }
  }, [events]);

  optionsRef.current = options;
  eventsRef.current = events;

  return useMemo<[UseOverlayScrollbarsInitialization, UseOverlayScrollbarsInstance]>(
    () => [
      (target: InitializationTarget): OverlayScrollbars => {
        // if already initialized return the current instance
        const presentInstance = osInstanceRef.current;
        if (OverlayScrollbars.valid(presentInstance)) {
          return presentInstance;
        }

        const currOptions = optionsRef.current || {};
        const currEvents = eventsRef.current || {};
        const osInstance = (osInstanceRef.current = OverlayScrollbars(
          target,
          currOptions,
          currEvents
        ));

        return osInstance;
      },
      () => osInstanceRef.current,
    ],
    []
  );
};
