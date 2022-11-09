import { isArray, isBoolean, isFunction, isString } from '~/support/utils/types';
import { keys } from '~/support/utils/object';
import { each, push, from, isEmptyArray, runEachAndClear } from '~/support/utils/array';

export type EventListener<EventArgs extends Record<string, any[]>, N extends keyof EventArgs> = (
  ...args: EventArgs[N]
) => void;

export type EventListeners<EventArgs extends Record<string, any[]>> = {
  [K in keyof EventArgs]?: EventListener<EventArgs, K> | EventListener<EventArgs, K>[] | null;
};

export type RemoveEvent<EventArgs extends Record<string, any[]>> = {
  <N extends keyof EventArgs>(name?: N, listener?: EventListener<EventArgs, N>): void;
  <N extends keyof EventArgs>(name?: N, listener?: EventListener<EventArgs, N>[]): void;
  <N extends keyof EventArgs>(
    name?: N,
    listener?: EventListener<EventArgs, N> | EventListener<EventArgs, N>[]
  ): void;
};

export type AddEvent<EventArgs extends Record<string, any[]>> = {
  (eventListeners: EventListeners<EventArgs>, pure?: boolean): () => void;
  <N extends keyof EventArgs>(name: N, listener: EventListener<EventArgs, N>): () => void;
  <N extends keyof EventArgs>(name: N, listener: EventListener<EventArgs, N>[]): () => void;
  <N extends keyof EventArgs>(
    nameOrEventListeners: N | EventListeners<EventArgs>,
    listener?: EventListener<EventArgs, N> | EventListener<EventArgs, N>[] | boolean
  ): () => void;
};

export type TriggerEvent<EventArgs extends Record<string, any[]>> = {
  <N extends keyof EventArgs>(name: N, args?: EventArgs[N]): void;
};

export type EventListenerHub<EventArgs extends Record<string, any[]>> = [
  AddEvent<EventArgs>,
  RemoveEvent<EventArgs>,
  TriggerEvent<EventArgs>
];

const manageListener = <EventArgs extends Record<string, any[]>, N extends keyof EventArgs>(
  callback: (listener?: EventListener<EventArgs, N>) => void,
  listener?: EventListener<EventArgs, N> | EventListener<EventArgs, N>[]
) => {
  each(isArray(listener) ? listener : [listener], callback);
};

export const createEventListenerHub = <EventArgs extends Record<string, any[]>>(
  initialEventListeners?: EventListeners<EventArgs>
): EventListenerHub<EventArgs> => {
  const events = new Map<keyof EventArgs, Set<EventListener<EventArgs, keyof EventArgs>>>();

  const removeEvent: RemoveEvent<EventArgs> = (name, listener) => {
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

  const addEvent: AddEvent<EventArgs> = ((
    nameOrEventListeners: keyof EventArgs | EventListeners<EventArgs>,
    listenerOrPure:
      | EventListener<EventArgs, keyof EventArgs>
      | EventListener<EventArgs, keyof EventArgs>[]
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

    const eventListenerKeys = keys(nameOrEventListeners) as (keyof EventListeners<EventArgs>)[];
    const offFns: (() => void)[] = [];
    each(eventListenerKeys, (key) => {
      const eventListener = (nameOrEventListeners as EventListeners<EventArgs>)[key];
      eventListener && push(offFns, addEvent(key, eventListener));
    });

    return runEachAndClear.bind(0, offFns);
  }) as AddEvent<EventArgs>; // sorry!

  const triggerEvent: TriggerEvent<EventArgs> = (name, args) => {
    const eventSet = events.get(name);

    each(from(eventSet), (event) => {
      if (args && !isEmptyArray(args)) {
        (event as (...eventArgs: EventArgs[keyof EventArgs]) => void).apply(0, args as any);
      } else {
        (event as () => void)();
      }
    });
  };

  addEvent(initialEventListeners || {});

  return [addEvent, removeEvent, triggerEvent];
};
