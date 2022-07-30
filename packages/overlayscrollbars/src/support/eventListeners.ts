import { isArray } from 'support/utils/types';
import { keys } from 'support/utils/object';
import { each, from, isEmptyArray } from 'support/utils/array';

export type EventListener<
  EventMap extends Record<string, any[]>,
  Name extends keyof EventMap = keyof EventMap
> = (...args: EventMap[Name]) => void;

export type InitialEventListeners<EventMap extends Record<string, any[]>> = {
  [K in keyof EventMap]?: EventListener<EventMap> | EventListener<EventMap>[];
};

const manageListener = <EventMap extends Record<string, any[]>>(
  callback: (listener?: EventListener<EventMap>) => void,
  listener?: EventListener<EventMap> | EventListener<EventMap>[]
) => {
  each(isArray(listener) ? listener : [listener], callback);
};

export const createEventListenerHub = <EventMap extends Record<string, any[]>>(
  initialEventListeners?: InitialEventListeners<EventMap>
) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  type EventListener<Name extends keyof EventMap = keyof EventMap> = (
    ...args: EventMap[Name]
  ) => void;
  type RemoveEvent = {
    <Name extends keyof EventMap>(name?: Name, listener?: EventListener<Name>): void;
    <Name extends keyof EventMap>(name?: Name, listener?: EventListener<Name>[]): void;
    <Name extends keyof EventMap>(
      name?: Name,
      listener?: EventListener<Name> | EventListener<Name>[]
    ): void;
  };
  type AddEvent = {
    <Name extends keyof EventMap>(name: Name, listener: EventListener<Name>): () => void;
    <Name extends keyof EventMap>(name: Name, listener: EventListener<Name>[]): () => void;
    <Name extends keyof EventMap>(
      name: Name,
      listener: EventListener<Name> | EventListener<Name>[]
    ): () => void;
  };
  type TriggerEvent = {
    <Name extends keyof EventMap>(name: Name, args?: EventMap[Name]): void;
  };

  const events = new Map<keyof EventMap, Set<EventListener>>();

  const removeEvent: RemoveEvent = <Name extends keyof EventMap>(
    name?: Name,
    listener?: EventListener<Name> | EventListener<Name>[]
  ): void => {
    if (name) {
      const eventSet = events.get(name);
      manageListener((currListener) => {
        if (eventSet) {
          eventSet[currListener ? 'delete' : 'clear'](currListener!);
        }
      }, listener as any);
    } else {
      events.forEach((eventSet) => {
        eventSet.clear();
      });
      events.clear();
    }
  };

  const addEvent: AddEvent = <Name extends keyof EventMap>(
    name: Name,
    listener: EventListener<Name> | EventListener<Name>[]
  ): (() => void) => {
    const eventSet = events.get(name) || new Set();
    events.set(name, eventSet);

    manageListener((currListener) => {
      currListener && eventSet.add(currListener);
    }, listener as any);

    return removeEvent.bind(0, name as any, listener as any);
  };

  const triggerEvent: TriggerEvent = <Name extends keyof EventMap>(
    name: Name,
    args?: EventMap[Name]
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
