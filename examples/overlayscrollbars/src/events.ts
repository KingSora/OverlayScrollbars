import type { EventListenerArgs } from 'overlayscrollbars';

type OverlayScrollbarsEvents = keyof EventListenerArgs;

interface EventObserverEvent {
  active: boolean;
  count: number;
}

const eventsSection = document.querySelector('#eventsSection') as HTMLElement;
const events = document.querySelector('#events') as HTMLElement;

const onEventsChanged = (changedEvents: Record<OverlayScrollbarsEvents, EventObserverEvent>) => {
  eventsSection.style.display = '';
  events.innerHTML = '';

  Object.entries(changedEvents).forEach(([eventName, event]) => {
    const eventElement = document.createElement('div');
    eventElement.className = `event ${event.active ? 'active' : ''}`;
    eventElement.textContent = `${eventName} (${event.count})`;

    events.append(eventElement);
  });
};

export const eventObserver = () => {
  let activeEvents: OverlayScrollbarsEvents[] = [];
  const eventCount: Partial<Record<OverlayScrollbarsEvents, number>> = {};
  const timeoutIds: Partial<Record<OverlayScrollbarsEvents, ReturnType<typeof setTimeout>>> = {};

  const getEventObj = (event: OverlayScrollbarsEvents): EventObserverEvent => ({
    active: activeEvents.includes(event),
    count: eventCount[event] || 0,
  });

  const updateActiveEvents = (newActiveEvents: OverlayScrollbarsEvents[]) => {
    activeEvents = newActiveEvents;
    onEventsChanged({
      initialized: getEventObj('initialized'),
      destroyed: getEventObj('destroyed'),
      updated: getEventObj('updated'),
      scroll: getEventObj('scroll'),
    });
  };

  const activateEvent = (event: OverlayScrollbarsEvents) => {
    const currAmount = eventCount[event];
    eventCount[event] = typeof currAmount === 'number' ? currAmount + 1 : 1;

    updateActiveEvents(Array.from(new Set([...activeEvents, event])));

    clearTimeout(timeoutIds[event]);
    timeoutIds[event] = setTimeout(() => {
      const currActiveEventsSet = new Set(activeEvents);
      currActiveEventsSet.delete(event);
      updateActiveEvents(Array.from(currActiveEventsSet));
    }, 500);
  };

  return activateEvent;
};
