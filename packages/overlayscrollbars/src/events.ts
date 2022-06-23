import { OSOptions } from 'options';
import { each, from, isArray } from 'support';
import { PartialOptions } from 'typings';

export interface onUpdatedEventArgs {
  updateHints: {
    sizeChanged: boolean;
    hostMutation: boolean;
    contentMutation: boolean;
    directionChanged: boolean;
    heightIntrinsicChanged: boolean;
  };
  changedOptions: PartialOptions<OSOptions>;
  force: boolean;
}

export interface EventArgsMap {
  updated: onUpdatedEventArgs;
}

export type OSEventListener<N extends keyof EventArgsMap> = (args: EventArgsMap[N]) => void;

export type AddEvent = <N extends keyof EventArgsMap>(
  name: N,
  listener: OSEventListener<N> | OSEventListener<N>[]
) => () => void;

export type RemoveEvent = <N extends keyof EventArgsMap>(
  name?: N,
  listener?: OSEventListener<N> | OSEventListener<N>[]
) => void;

export type TriggerEvent = <N extends keyof EventArgsMap>(name: N, args: EventArgsMap[N]) => void;

export type EventHub = [AddEvent, RemoveEvent, TriggerEvent];

const manageListener = <N extends keyof EventArgsMap>(
  callback: (listener?: OSEventListener<any>) => void,
  listener?: OSEventListener<N> | OSEventListener<N>[]
) => {
  each(isArray(listener) ? listener : [listener], callback);
};

export const createEventHub = (): EventHub => {
  const events = new Map<string, Set<OSEventListener<any>>>();
  const removeEvent: RemoveEvent = (name?, listener?) => {
    if (name) {
      const eventSet = events.get(name);

      manageListener((currListener) => {
        if (eventSet) {
          eventSet[currListener ? 'delete' : 'clear'](currListener!);
        }
      }, listener);
    } else {
      events.forEach((eventSet) => {
        eventSet.clear();
      });
      events.clear();
    }
  };
  const addEvent: AddEvent = (name, listener) => {
    const eventSet = events.get(name) || new Set();
    events.set(name, eventSet);

    manageListener((currListener) => {
      eventSet.add(currListener!);
    }, listener);

    return removeEvent.bind(0, name, listener as any);
  };
  const triggerEvent: TriggerEvent = (name, args) => {
    const eventSet = events.get(name);

    each(from(eventSet), (event) => {
      event(args);
    });
  };

  return [addEvent, removeEvent, triggerEvent];
};
