import { createSignal, createMemo } from 'solid-js';
import type { EventListenerArgs } from 'overlayscrollbars';

export type OverlayScrollbarsEvents = keyof EventListenerArgs;

export interface EventObserverEvent {
  active: boolean;
  count: number;
}

export const createEventObserver = () => {
  const [activeEvents, setActiveEvents] = createSignal<OverlayScrollbarsEvents[]>([]);
  const eventCount: Partial<Record<OverlayScrollbarsEvents, number>> = {};
  const timeoutIds: Partial<Record<OverlayScrollbarsEvents, ReturnType<typeof setTimeout>>> = {};

  const activateEvent = (event: OverlayScrollbarsEvents) => {
    const currAmount = eventCount[event];
    eventCount[event] = typeof currAmount === 'number' ? currAmount + 1 : 1;

    setActiveEvents((currActiveEvents) => Array.from(new Set([...currActiveEvents, event])));

    clearTimeout(timeoutIds[event]);
    timeoutIds[event] = setTimeout(() => {
      setActiveEvents((currActiveEvents) => {
        const currActiveEventsSet = new Set(currActiveEvents);
        currActiveEventsSet.delete(event);
        return Array.from(currActiveEventsSet);
      });
    }, 500);
  };

  const getEventObj = (event: OverlayScrollbarsEvents): EventObserverEvent => ({
    active: activeEvents().includes(event),
    count: eventCount[event] || 0,
  });

  const events = createMemo<Record<OverlayScrollbarsEvents, EventObserverEvent>>(() => ({
    initialized: getEventObj('initialized'),
    destroyed: getEventObj('destroyed'),
    updated: getEventObj('updated'),
    scroll: getEventObj('scroll'),
  }));

  return [events, activateEvent] as const;
};
