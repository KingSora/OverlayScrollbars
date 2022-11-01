import { useEffect, useCallback, useRef } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { PartialOptions, InitializationTarget, EventListeners } from 'overlayscrollbars';

export type UseOverlayScrollbarsInitialization = (
  target: InitializationTarget
) => OverlayScrollbars;

export type UseOverlayScrollbarsInstance = () => OverlayScrollbars | null;

/**
 * Hook for advanced usage of OverlayScrollbars. (When the OverlayScrollbarsComponent is not enough)
 * @param options OverlayScrollbars options.
 * @param events OverlayScrollbars events.
 * @returns A tuple with two values:
 * The first value is the initialization function.
 * The second value is an function which returns the current OverlayScrollbars instance or null if not initialized.
 */
export const useOverlayScrollbars = (
  options?: PartialOptions,
  events?: EventListeners
): [UseOverlayScrollbarsInitialization, UseOverlayScrollbarsInstance] => {
  const osInstanceRef = useRef<OverlayScrollbars | null>(null);
  const optionsRef = useRef<PartialOptions>();
  const eventsRef = useRef<EventListeners>();
  const offInitialEventsRef = useRef<(() => void) | void>();

  useEffect(() => {
    const { current: instance } = osInstanceRef;
    if (OverlayScrollbars.valid(instance) && options) {
      instance.options(options, true);
    }
  }, [options]);

  useEffect(() => {
    const { current: instance } = osInstanceRef;
    const { current: offInitialEvents } = offInitialEventsRef;
    if (OverlayScrollbars.valid(instance) && events) {
      offInitialEvents && (offInitialEventsRef.current = offInitialEvents()); // once called assign it to undefined so its not called again
      return instance.on(events);
    }
  }, [events]);

  optionsRef.current = options;
  eventsRef.current = events;

  return [
    useCallback((target: InitializationTarget): OverlayScrollbars => {
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

      offInitialEventsRef.current = osInstance.on(currEvents);

      return osInstance;
    }, []),
    useCallback(() => osInstanceRef.current, []),
  ];
};
