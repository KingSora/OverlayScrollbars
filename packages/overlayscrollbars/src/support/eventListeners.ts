import { isArray, isBoolean, isFunction, isString } from '~/support/utils/types';
import { keys } from '~/support/utils/object';
import { each, push, from, isEmptyArray, runEachAndClear } from '~/support/utils/array';

export type EventListener<EventMap extends Record<string, any[]>, N extends keyof EventMap> = (
  ...args: EventMap[N]
) => void;

export type EventListeners<EventMap extends Record<string, any[]>> = {
  [K in keyof EventMap]?: EventListener<EventMap, K> | EventListener<EventMap, K>[] | null;
};

export type RemoveEvent<EventMap extends Record<string, any[]>> = {
  <N extends keyof EventMap>(name?: N, listener?: EventListener<EventMap, N>): void;
  <N extends keyof EventMap>(name?: N, listener?: EventListener<EventMap, N>[]): void;
  <N extends keyof EventMap>(
    name?: N,
    listener?: EventListener<EventMap, N> | EventListener<EventMap, N>[]
  ): void;
};

export type AddEvent<EventMap extends Record<string, any[]>> = {
  (eventListeners: EventListeners<EventMap>, pure?: boolean): () => void;
  <N extends keyof EventMap>(name: N, listener: EventListener<EventMap, N>): () => void;
  <N extends keyof EventMap>(name: N, listener: EventListener<EventMap, N>[]): () => void;
  <N extends keyof EventMap>(
    nameOrEventListeners: N | EventListeners<EventMap>,
    listener?: EventListener<EventMap, N> | EventListener<EventMap, N>[] | boolean
  ): () => void;
};

export type TriggerEvent<EventMap extends Record<string, any[]>> = {
  <N extends keyof EventMap>(name: N, args?: EventMap[N]): void;
};

export type EventListenerHub<EventMap extends Record<string, any[]>> = [
  AddEvent<EventMap>,
  RemoveEvent<EventMap>,
  TriggerEvent<EventMap>
];

const manageListener = <EventMap extends Record<string, any[]>, N extends keyof EventMap>(
  callback: (listener?: EventListener<EventMap, N>) => void,
  listener?: EventListener<EventMap, N> | EventListener<EventMap, N>[]
) => {
  each(isArray(listener) ? listener : [listener], callback);
};

export const createEventListenerHub = <EventMap extends Record<string, any[]>>(
  initialEventListeners?: EventListeners<EventMap>
): EventListenerHub<EventMap> => {
  const events = new Map<keyof EventMap, Set<EventListener<EventMap, keyof EventMap>>>();

  const removeEvent: RemoveEvent<EventMap> = (name, listener) => {
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

  const addEvent: AddEvent<EventMap> = ((
    nameOrEventListeners: keyof EventMap | EventListeners<EventMap>,
    listenerOrPure:
      | EventListener<EventMap, keyof EventMap>
      | EventListener<EventMap, keyof EventMap>[]
      | boolean
  ) => {
    if (isString(nameOrEventListeners)) {
      const eventSet = events.get(nameOrEventListeners) || new Set();
      events.set(nameOrEventListeners, eventSet);

      manageListener((currListener) => {
        isFunction(currListener) && eventSet.add(currListener);
      }, listenerOrPure as any);

      return removeEvent.bind(0, nameOrEventListeners as any, listenerOrPure as any);
    }
    if (isBoolean(listenerOrPure) && listenerOrPure) {
      removeEvent();
    }

    const eventListenerKeys = keys(nameOrEventListeners) as (keyof EventListeners<EventMap>)[];
    const offFns: (() => void)[] = [];
    each(eventListenerKeys, (key) => {
      const eventListener = (nameOrEventListeners as EventListeners<EventMap>)[key];
      eventListener && push(offFns, addEvent(key, eventListener));
    });

    return runEachAndClear.bind(0, offFns);
  }) as AddEvent<EventMap>; // sorry!

  const triggerEvent: TriggerEvent<EventMap> = (name, args) => {
    const eventSet = events.get(name);

    each(from(eventSet), (event) => {
      if (args && !isEmptyArray(args)) {
        (event as (...eventArgs: EventMap[keyof EventMap]) => void).apply(0, args as any);
      } else {
        (event as () => void)();
      }
    });
  };

  addEvent(initialEventListeners || {});

  return [addEvent, removeEvent, triggerEvent];
};
