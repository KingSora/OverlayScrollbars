import type { EventListenerArgs } from 'overlayscrollbars';

export type OverlayScrollbarsEvents = keyof EventListenerArgs;

export interface EventObserverEvent {
  active: boolean;
  count: number;
}

export const useEventObserver = () => {
  let activeEvents: OverlayScrollbarsEvents[] = $state([]);
  const eventCountRef: Partial<Record<OverlayScrollbarsEvents, number>> = {};
  const timeoutIds: Partial<Record<OverlayScrollbarsEvents, ReturnType<typeof setTimeout>>> = {};

  const activateEvent = (event: OverlayScrollbarsEvents) => {
    const currAmount = eventCountRef[event];
    eventCountRef[event] = typeof currAmount === 'number' ? currAmount + 1 : 1;

    activeEvents = Array.from(new Set([...activeEvents, event]));

    clearTimeout(timeoutIds[event]);
    timeoutIds[event] = setTimeout(() => {
      const currActiveEventsSet = new Set(activeEvents);
      currActiveEventsSet.delete(event);
      activeEvents = Array.from(currActiveEventsSet);
    }, 500);
  };

  const getEventObj = (event: OverlayScrollbarsEvents): EventObserverEvent => ({
    active: activeEvents.includes(event),
    count: eventCountRef[event] || 0,
  });

  const events: Record<OverlayScrollbarsEvents, EventObserverEvent> = $derived({
    initialized: getEventObj('initialized'),
    destroyed: getEventObj('destroyed'),
    updated: getEventObj('updated'),
    scroll: getEventObj('scroll'),
  });

  return [() => events, activateEvent] as const;
};
