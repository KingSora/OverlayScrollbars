import { isArray } from 'support/utils/types';
import { keys } from 'support/utils/object';
import { each, from } from 'support/utils/array';

export type EventListener<
  NameArgsMap extends Record<string, any>,
  Name extends Extract<keyof NameArgsMap, string> = Extract<keyof NameArgsMap, string>
> = (...args: NameArgsMap[Name] extends undefined ? [] : [args: NameArgsMap[Name]]) => void;

export type EventListenerGroup<
  NameArgsMap extends Record<string, any>,
  Name extends Extract<keyof NameArgsMap, string> = Extract<keyof NameArgsMap, string>
> = EventListener<NameArgsMap, Name> | EventListener<NameArgsMap, Name>[];

export type AddEventListener<NameArgsMap extends Record<string, any>> = <
  Name extends Extract<keyof NameArgsMap, string>
>(
  name: Name,
  listener: EventListenerGroup<NameArgsMap, Name>
) => () => void;

export type RemoveEventListener<NameArgsMap extends Record<string, any>> = <
  Name extends Extract<keyof NameArgsMap, string>
>(
  name?: Name,
  listener?: EventListenerGroup<NameArgsMap, Name>
) => void;

export type TriggerEventListener<NameArgsMap extends Record<string, any>> = <
  Name extends Extract<keyof NameArgsMap, string>
>(
  name: Name,
  ...args: NameArgsMap[Name] extends undefined ? [] : [args: NameArgsMap[Name]]
) => void;

export type InitialEventListeners<NameArgsMap extends Record<string, any>> = {
  [K in Extract<keyof NameArgsMap, string>]?: EventListenerGroup<NameArgsMap, K>;
};

const manageListener = <NameArgsMap extends Record<string, any>>(
  callback: (listener?: EventListener<NameArgsMap>) => void,
  listener?: EventListener<NameArgsMap> | EventListener<NameArgsMap>[]
) => {
  each(isArray(listener) ? listener : [listener], callback);
};

export const createEventListenerHub = <NameArgsMap extends Record<string, any>>(
  initialEventListeners?: InitialEventListeners<NameArgsMap>
): [
  AddEventListener<NameArgsMap>,
  RemoveEventListener<NameArgsMap>,
  TriggerEventListener<NameArgsMap>
] => {
  const events = new Map<Extract<keyof NameArgsMap, string>, Set<EventListener<NameArgsMap>>>();
  const removeEvent: RemoveEventListener<NameArgsMap> = (name?, listener?) => {
    if (name) {
      const eventSet = events.get(name);
      manageListener((currListener) => {
        if (eventSet) {
          eventSet[currListener ? 'delete' : 'clear'](currListener!);
        }
      }, listener as EventListenerGroup<NameArgsMap> | undefined);
    } else {
      events.forEach((eventSet) => {
        eventSet.clear();
      });
      events.clear();
    }
  };
  const addEvent: AddEventListener<NameArgsMap> = (name, listener) => {
    const eventSet = events.get(name) || new Set();
    events.set(name, eventSet);

    manageListener((currListener) => {
      currListener && eventSet.add(currListener);
    }, listener as EventListenerGroup<NameArgsMap>);

    return removeEvent.bind(0, name as any, listener as EventListenerGroup<NameArgsMap>);
  };
  const triggerEvent: TriggerEventListener<NameArgsMap> = (name, args?) => {
    const eventSet = events.get(name);

    each(from(eventSet), (event) => {
      if (args) {
        (event as (args: NameArgsMap[Extract<keyof NameArgsMap, string>]) => void)(args as any);
      } else {
        (event as () => void)();
      }
    });
  };

  const initialListenerKeys = keys(initialEventListeners) as Extract<keyof NameArgsMap, string>[];
  each(initialListenerKeys, (key) => {
    addEvent(key, initialEventListeners![key] as any);
  });

  return [addEvent, removeEvent, triggerEvent];
};
