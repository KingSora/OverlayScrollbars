import { BehaviorSubject, map } from 'rxjs';
import type { ChangeDetectorRef } from '@angular/core';
import type { EventListenerArgs } from 'overlayscrollbars';

export type OverlayScrollbarsEvents = keyof EventListenerArgs;

export interface EventObserverEvent {
  active: boolean;
  count: number;
}

export const eventObserver = (cdr: ChangeDetectorRef) => {
  const activeEvents = new BehaviorSubject<OverlayScrollbarsEvents[]>([]);
  const eventCountRef: Partial<Record<OverlayScrollbarsEvents, number>> = {};
  const timeoutIds: Partial<Record<OverlayScrollbarsEvents, ReturnType<typeof setTimeout>>> = {};

  const activateEvent = (event: OverlayScrollbarsEvents) => {
    const currAmount = eventCountRef[event];
    eventCountRef[event] = typeof currAmount === 'number' ? currAmount + 1 : 1;

    activeEvents.next(Array.from(new Set([...activeEvents.getValue(), event])));

    clearTimeout(timeoutIds[event]);
    timeoutIds[event] = setTimeout(() => {
      const currActiveEventsSet = new Set(activeEvents.getValue());
      currActiveEventsSet.delete(event);
      activeEvents.next(Array.from(currActiveEventsSet));
      cdr.detectChanges();
    }, 500);

    cdr.detectChanges();
  };

  const getEventObj = (event: OverlayScrollbarsEvents): EventObserverEvent => ({
    active: activeEvents.getValue().includes(event),
    count: eventCountRef[event] || 0,
  });

  const events = activeEvents.pipe(
    map(() => ({
      initialized: getEventObj('initialized'),
      destroyed: getEventObj('destroyed'),
      updated: getEventObj('updated'),
      scroll: getEventObj('scroll'),
    }))
  );

  return [events, activateEvent] as const;
};
