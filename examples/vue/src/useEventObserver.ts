import { computed, ref, type ComputedRef } from 'vue';
import type { EventListenerArgs } from 'overlayscrollbars';

export type OverlayScrollbarsEvents = keyof EventListenerArgs;

export interface EventObserverEvent {
  active: boolean;
  count: number;
}

export const useEventObserver = () => {
  const activeEvents = ref<OverlayScrollbarsEvents[]>([]);
  const eventCountRef: Partial<Record<OverlayScrollbarsEvents, number>> = {};
  const timeoutIds: Partial<Record<OverlayScrollbarsEvents, ReturnType<typeof setTimeout>>> = {};

  const activateEvent = (event: OverlayScrollbarsEvents) => {
    const currAmount = eventCountRef[event];
    eventCountRef[event] = typeof currAmount === 'number' ? currAmount + 1 : 1;

    activeEvents.value = Array.from(new Set([...activeEvents.value, event]));

    clearTimeout(timeoutIds[event]);
    timeoutIds[event] = setTimeout(() => {
      const currActiveEventsSet = new Set(activeEvents.value);
      currActiveEventsSet.delete(event);
      activeEvents.value = Array.from(currActiveEventsSet);
    }, 500);
  };

  const getEventObj = (event: OverlayScrollbarsEvents): EventObserverEvent => ({
    active: activeEvents.value.includes(event),
    count: eventCountRef[event] || 0,
  });

  const events: ComputedRef<Record<OverlayScrollbarsEvents, EventObserverEvent>> = computed(() => ({
    initialized: getEventObj('initialized'),
    destroyed: getEventObj('destroyed'),
    updated: getEventObj('updated'),
    scroll: getEventObj('scroll'),
  }));

  return [events, activateEvent] as const;
};
