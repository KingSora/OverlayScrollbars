import { OSOptions } from 'options';
import { each, from, isArray, keys, XY } from 'support';
import { PartialOptions } from 'typings';
/*
onScrollStart               : null,
onScroll                    : null,
onScrollStop                : null,
onOverflowChanged           : null,
onOverflowAmountChanged     : null, // fusion with onOverflowChanged
onDirectionChanged          : null, // gone
onContentSizeChanged        : null, // gone
onHostSizeChanged           : null, // gone
*/

export interface OnUpdatedEventListenerArgs {
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

export interface OnOverflowChangedEventListenerArgs {
  overflow: XY<boolean>; // whether there is an overflow
  scrollableOverflow: XY<boolean>; // whether there is an scrollable overflow
  amount: XY<number>; // the overflow amount in pixel
  previous: {
    overflow: XY<boolean>;
    scrollableOverflow: XY<boolean>;
    amount: XY<number>;
  };
}

export interface EventListenerArgsMap {
  initialized: undefined;
  initializationWithdrawn: undefined;
  overflowChanged: OnOverflowChangedEventListenerArgs;
  updated: OnUpdatedEventListenerArgs;
  destroyed: undefined;
}

export type OSEventListener<N extends keyof EventListenerArgsMap = keyof EventListenerArgsMap> =
  undefined extends EventListenerArgsMap[N] ? () => void : (args: EventListenerArgsMap[N]) => void;

export type AddEventListener = <N extends keyof EventListenerArgsMap>(
  name: N,
  listener: OSEventListener<N> | OSEventListener<N>[]
) => () => void;

export type RemoveEventListener = <N extends keyof EventListenerArgsMap>(
  name?: N,
  listener?: OSEventListener<N> | OSEventListener<N>[]
) => void;

export type TriggerEventListener = <N extends keyof EventListenerArgsMap>(
  name: N,
  ...args: undefined extends EventListenerArgsMap[N]
    ? [args?: never]
    : [args: EventListenerArgsMap[N]]
) => void;

export type EventListenersHub = [AddEventListener, RemoveEventListener, TriggerEventListener];

export type EventListenersMap = {
  [K in keyof EventListenerArgsMap]?: OSEventListener<K> | OSEventListener<K>[];
};

const manageListener = <N extends keyof EventListenerArgsMap>(
  callback: (listener?: OSEventListener<any>) => void,
  listener?: OSEventListener<N> | OSEventListener<N>[]
) => {
  each(isArray(listener) ? listener : [listener], callback);
};

export const createEventListenerHub = (
  initialEventListeners?: EventListenersMap
): EventListenersHub => {
  const events = new Map<keyof EventListenerArgsMap, Set<OSEventListener>>();
  const removeEvent: RemoveEventListener = (name?, listener?) => {
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
  const addEvent: AddEventListener = (name, listener) => {
    const eventSet = events.get(name) || new Set();
    events.set(name, eventSet);

    manageListener((currListener) => {
      eventSet.add(currListener!);
    }, listener);

    return removeEvent.bind(0, name, listener as any);
  };
  const triggerEvent: TriggerEventListener = (name, args?) => {
    const eventSet = events.get(name);

    each(from(eventSet), (event) => {
      if (args) {
        (event as (args: any) => void)(args);
      } else {
        (event as () => void)();
      }
    });
  };

  const initialListenerKeys = keys(initialEventListeners) as (keyof EventListenerArgsMap)[];
  each(initialListenerKeys, (key) => {
    addEvent(key, initialEventListeners![key] as any);
  });

  return [addEvent, removeEvent, triggerEvent];
};
