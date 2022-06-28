import { OSOptions } from 'options';
import { createEventListenerHub, XY } from 'support';
import { PartialOptions } from 'typings';
import type {
  InitialEventListeners,
  AddEventListener,
  RemoveEventListener,
  TriggerEventListener,
  EventListener,
} from 'support/eventListeners';
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

export interface OSEventListenersNameArgsMap {
  initialized: undefined;
  initializationWithdrawn: undefined;
  overflowChanged: OnOverflowChangedEventListenerArgs;
  updated: OnUpdatedEventListenerArgs;
  destroyed: undefined;
}

export type OSEventListener<
  N extends Extract<keyof OSEventListenersNameArgsMap, string> = Extract<
    keyof OSEventListenersNameArgsMap,
    string
  >
> = EventListener<OSEventListenersNameArgsMap, N>;

export type AddOSEventListener = AddEventListener<OSEventListenersNameArgsMap>;

export type RemoveOSEventListener = RemoveEventListener<OSEventListenersNameArgsMap>;

export type TriggerOSEventListener = TriggerEventListener<OSEventListenersNameArgsMap>;

export type InitialOSEventListeners = InitialEventListeners<OSEventListenersNameArgsMap>;

export const createOSEventListenerHub = (initialEventListeners?: InitialOSEventListeners) =>
  createEventListenerHub(initialEventListeners);
