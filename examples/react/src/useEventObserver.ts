import { useRef, useState } from 'react';
import type { EventListenerArgs } from 'overlayscrollbars';

export type OverlayScrollbarsEvents = keyof EventListenerArgs;

export interface EventObserverEvent {
  active: boolean;
  count: number;
}

export const useEventObserver = () => {
  const [activeEvents, setActiveEvents] = useState<OverlayScrollbarsEvents[]>([]);
  const eventCountRef = useRef<Partial<Record<OverlayScrollbarsEvents, number>>>({});
  const timeoutIds = useRef<
    Partial<Record<OverlayScrollbarsEvents, ReturnType<typeof setTimeout>>>
  >({});

  const activateEvent = (event: OverlayScrollbarsEvents) => {
    const currAmount = eventCountRef.current[event];
    eventCountRef.current[event] = typeof currAmount === 'number' ? currAmount + 1 : 1;

    setActiveEvents((currActiveEvents) => Array.from(new Set([...currActiveEvents, event])));

    clearTimeout(timeoutIds.current[event]);
    timeoutIds.current[event] = setTimeout(() => {
      setActiveEvents((currActiveEvents) => {
        const currActiveEventsSet = new Set(currActiveEvents);
        currActiveEventsSet.delete(event);
        return Array.from(currActiveEventsSet);
      });
    }, 500);
  };

  const getEventObj = (event: OverlayScrollbarsEvents): EventObserverEvent => ({
    active: activeEvents.includes(event),
    count: eventCountRef.current[event] || 0,
  });

  const events: Record<OverlayScrollbarsEvents, EventObserverEvent> = {
    initialized: getEventObj('initialized'),
    destroyed: getEventObj('destroyed'),
    updated: getEventObj('updated'),
    scroll: getEventObj('scroll'),
  };

  return [events, activateEvent] as const;
};
