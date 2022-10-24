import { isArray, isString } from '~/support/utils/types';
import { keys } from '~/support/utils/object';
import { each, push, from, isEmptyArray, runEachAndClear } from '~/support/utils/array';

export type EventListener<EventMap extends Record<string, any[]>, N extends keyof EventMap> = (
  ...args: EventMap[N]
) => void;

export type EventListeners<EventMap extends Record<string, any[]>> = {
  [K in keyof EventMap]?: EventListener<EventMap, K> | EventListener<EventMap, K>[];
};

const manageListener = <EventMap extends Record<string, any[]>, N extends keyof EventMap>(
  callback: (listener?: EventListener<EventMap, N>) => void,
  listener?: EventListener<EventMap, N> | EventListener<EventMap, N>[]
) => {
  each(isArray(listener) ? listener : [listener], callback);
};

export const createEventListenerHub = <EventMap extends Record<string, any[]>>(
  initialEventListeners?: EventListeners<EventMap>
) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  type EventListener<N extends keyof EventMap> = (...args: EventMap[N]) => void;
  type RemoveEvent = {
    <N extends keyof EventMap>(name?: N, listener?: EventListener<N>): void;
    <N extends keyof EventMap>(name?: N, listener?: EventListener<N>[]): void;
    <N extends keyof EventMap>(name?: N, listener?: EventListener<N> | EventListener<N>[]): void;
  };
  type AddEvent = {
    (eventListeners: EventListeners<EventMap>): () => void;
    <N extends keyof EventMap>(name: N, listener: EventListener<N>): () => void;
    <N extends keyof EventMap>(name: N, listener: EventListener<N>[]): () => void;
    <N extends keyof EventMap>(
      nameOrEventListeners: N | EventListeners<EventMap>,
      listener?: EventListener<N> | EventListener<N>[]
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
    nameOrEventListeners: N | EventListeners<EventMap>,
    listener?: EventListener<N> | EventListener<N>[]
  ): (() => void) => {
    if (isString(nameOrEventListeners)) {
      const eventSet = events.get(nameOrEventListeners) || new Set();
      events.set(nameOrEventListeners, eventSet);

      manageListener((currListener) => {
        currListener && eventSet.add(currListener);
      }, listener as any);

      return removeEvent.bind(0, nameOrEventListeners as any, listener as any);
    }

    const eventListenerKeys = keys(nameOrEventListeners) as (keyof EventListeners<EventMap>)[];
    const offFns: (() => void)[] = [];
    each(eventListenerKeys, (key) => {
      push(offFns, addEvent(key, (nameOrEventListeners as EventListeners<EventMap>)[key]));
    });

    return runEachAndClear.bind(0, offFns);
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

  addEvent(initialEventListeners || {});

  return [addEvent, removeEvent, triggerEvent] as [AddEvent, RemoveEvent, TriggerEvent];
};
