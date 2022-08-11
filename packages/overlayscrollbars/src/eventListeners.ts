import type { OverlayScrollbars } from 'overlayscrollbars';
import type { DeepPartial } from 'typings';
import type { Options } from 'options';
import type {
  InitialEventListeners as GeneralInitialEventListeners,
  EventListener as GeneralEventListener,
} from 'support/eventListeners';

export interface OnUpdatedEventListenerArgs {
  updateHints: {
    sizeChanged: boolean;
    directionChanged: boolean;
    heightIntrinsicChanged: boolean;
    overflowEdgeChanged: boolean;
    overflowAmountChanged: boolean;
    overflowStyleChanged: boolean;
    hostMutation: boolean;
    contentMutation: boolean;
  };
  changedOptions: DeepPartial<Options>;
  force: boolean;
}

export type EventListenerMap = {
  /**
   * Triggered after all elements are initialized and appended.
   */
  initialized: [instance: OverlayScrollbars];
  /**
   * Triggered after an update.
   */
  updated: [instance: OverlayScrollbars, onUpdatedArgs: OnUpdatedEventListenerArgs];
  /**
   * Triggered after all elements, observers and events are destroyed.
   */
  destroyed: [instance: OverlayScrollbars, canceled: boolean];
};

export type InitialEventListeners = GeneralInitialEventListeners<EventListenerMap>;

export type EventListener<N extends keyof EventListenerMap> = GeneralEventListener<
  EventListenerMap,
  N
>;
