import { $, useComputed$, useSignal } from '@qwik.dev/core';
import type { EventListenerArgs } from 'overlayscrollbars';

export type OverlayScrollbarsEvents = keyof EventListenerArgs;

export interface EventObserverEvent {
  active: boolean;
  count: number;
}

export const useEventObserver = () => {
  const activeEvents = useSignal<OverlayScrollbarsEvents[]>([]);
  const eventCount = useSignal<Partial<Record<OverlayScrollbarsEvents, number>>>({});
  const timeoutIds: Partial<Record<OverlayScrollbarsEvents, ReturnType<typeof setTimeout>>> = {};

  const activateEvent = $((event: OverlayScrollbarsEvents) => {
    const currAmount = eventCount.value[event];
    eventCount.value[event] = typeof currAmount === 'number' ? currAmount + 1 : 1;

    activeEvents.value = Array.from(new Set([...activeEvents.value, event]));

    clearTimeout(timeoutIds[event]);
    timeoutIds[event] = setTimeout(() => {
      const currActiveEventsSet = new Set(activeEvents.value);
      currActiveEventsSet.delete(event);
      activeEvents.value = Array.from(currActiveEventsSet);
    }, 500);
  });

  const events = useComputed$<Record<OverlayScrollbarsEvents, EventObserverEvent>>(() => {
    const getEventObj = (event: OverlayScrollbarsEvents): EventObserverEvent => ({
      active: activeEvents.value.includes(event),
      count: eventCount.value[event] || 0,
    });

    return {
      initialized: getEventObj('initialized'),
      destroyed: getEventObj('destroyed'),
      updated: getEventObj('updated'),
      scroll: getEventObj('scroll'),
    };
  });

  return [events, activateEvent] as const;
};
