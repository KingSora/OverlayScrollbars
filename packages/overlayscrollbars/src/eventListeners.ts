import type { OverlayScrollbars } from '~/overlayscrollbars';
import type { DeepPartial } from '~/typings';
import type { Options } from '~/options';
import type {
  InitialEventListeners as GeneralInitialEventListeners,
  EventListener as GeneralEventListener,
} from '~/support/eventListeners';

/**
 * Describes the changes that happend due to an update.
 */
export interface OnUpdatedEventListenerArgs {
  /** Hints which describe what changed in the DOM.  */
  updateHints: {
    /** Whether the size of the host element changed. */
    sizeChanged: boolean;
    /** Whether the direction of the host element changed. */
    directionChanged: boolean;
    /** Whether the intrinsic height behavior changed. */
    heightIntrinsicChanged: boolean;
    /** Whether the overflow edge (clientWidth / clientHeight) of the viewport element changed. */
    overflowEdgeChanged: boolean;
    /** Whether the overflow amount changed. */
    overflowAmountChanged: boolean;
    /** Whether the overflow style changed. */
    overflowStyleChanged: boolean;
    /** Whether an host mutation took place. */
    hostMutation: boolean;
    /** Whether an content mutation took place. */
    contentMutation: boolean;
  };
  /** The changed options. */
  changedOptions: DeepPartial<Options>;
  /** Whether the update happened with and force invalidated cache. */
  force: boolean;
}

/**
 * A mapping between event names and their listener arguments.
 */
export type EventListenerMap = {
  /** Triggered after all elements are initialized and appended. */
  initialized: [instance: OverlayScrollbars];
  /** Triggered after an update. */
  updated: [instance: OverlayScrollbars, onUpdatedArgs: OnUpdatedEventListenerArgs];
  /** Triggered after all elements, observers and events are destroyed. */
  destroyed: [instance: OverlayScrollbars, canceled: boolean];
};

/**
 * An object which describes the initial event listeners.
 * Simplified it looks like:
 * {
 *   [eventName: string]: EventListener | EventListener[]
 * }
 */
export type InitialEventListeners = GeneralInitialEventListeners<EventListenerMap>;

/** An event listener. */
export type EventListener<N extends keyof EventListenerMap> = GeneralEventListener<
  EventListenerMap,
  N
>;
