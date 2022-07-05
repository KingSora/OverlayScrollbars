import { OSOptions } from 'options';
import { createEventListenerHub } from 'support';
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
    directionChanged: boolean;
    heightIntrinsicChanged: boolean;
    overflowAmountChanged: boolean;
    overflowStyleChanged: boolean;
    hostMutation: boolean;
    contentMutation: boolean;
  };
  changedOptions: PartialOptions<OSOptions>;
  force: boolean;
}

export interface OSEventListenersNameArgsMap {
  initialized: undefined;
  initializationWithdrawn: undefined;
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
