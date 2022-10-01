import { isArray } from '~/support/utils/types';
import { keys } from '~/support/utils/object';
import { each, from, isEmptyArray } from '~/support/utils/array';

export type EventListener<EventMap extends Record<string, any[]>, N extends keyof EventMap> = (
  ...args: EventMap[N]
) => void;

export type InitialEventListeners<EventMap extends Record<string, any[]>> = {
  [K in keyof EventMap]?: EventListener<EventMap, K> | EventListener<EventMap, K>[];
};

const manageListener = <EventMap extends Record<string, any[]>, N extends keyof EventMap>(
  callback: (listener?: EventListener<EventMap, N>) => void,
  listener?: EventListener<EventMap, N> | EventListener<EventMap, N>[]
) => {
  each(isArray(listener) ? listener : [listener], callback);
};

export const createEventListenerHub = <EventMap extends Record<string, any[]>>(
  initialEventListeners?: InitialEventListeners<EventMap>
) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  type EventListener<N extends keyof EventMap> = (...args: EventMap[N]) => void;
  type RemoveEvent = {
    <N extends keyof EventMap>(name?: N, listener?: EventListener<N>): void;
    <N extends keyof EventMap>(name?: N, listener?: EventListener<N>[]): void;
    <N extends keyof EventMap>(name?: N, listener?: EventListener<N> | EventListener<N>[]): void;
  };
  type AddEvent = {
    <N extends keyof EventMap>(name: N, listener: EventListener<N>): () => void;
    <N extends keyof EventMap>(name: N, listener: EventListener<N>[]): () => void;
    <N extends keyof EventMap>(
      name: N,
      listener: EventListener<N> | EventListener<N>[]
    ): () => void;
  };
  type TriggerEvent = {
    <N extends keyof EventMap>(name: N, args?: EventMap[N]): void;
  };

  const events = new Map<keyof EventMap, Set<EventListener<keyof EventMap>>>();

  const removeEvent: RemoveEvent = <N extends keyof EventMap>(
    name?: N,
    listener?: EventListener<N> | EventListener<N>[]
  ): void => {
    if (name) {
      const eventSet = events.get(name);
      manageListener((currListener) => {
        if (eventSet) {
          eventSet[currListener ? 'delete' : 'clear'](currListener! as any);
        }
      }, listener);
    } else {
      events.forEach((eventSet) => {
        eventSet.clear();
      });
      events.clear();
    }
  };

  const addEvent: AddEvent = <N extends keyof EventMap>(
    name: N,
    listener: EventListener<N> | EventListener<N>[]
  ): (() => void) => {
    const eventSet = events.get(name) || new Set();
    events.set(name, eventSet);

    manageListener((currListener) => {
      currListener && eventSet.add(currListener);
    }, listener as any);

    return removeEvent.bind(0, name as any, listener as any);
  };

  const triggerEvent: TriggerEvent = <N extends keyof EventMap>(
    name: N,
    args?: EventMap[N]
  ): void => {
    const eventSet = events.get(name);

    each(from(eventSet), (event) => {
      if (args && !isEmptyArray(args)) {
        (event as (...eventArgs: EventMap[keyof EventMap]) => void).apply(0, args as any);
      } else {
        (event as () => void)();
      }
    });
  };

  const initialListenerKeys = keys(initialEventListeners) as Extract<keyof EventMap, string>[];
  each(initialListenerKeys, (key) => {
    addEvent(key, initialEventListeners![key] as any);
  });

  return [addEvent, removeEvent, triggerEvent] as [AddEvent, RemoveEvent, TriggerEvent];
};
