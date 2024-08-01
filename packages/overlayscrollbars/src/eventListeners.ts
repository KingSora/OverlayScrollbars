import type { OverlayScrollbars } from './overlayscrollbars';
import type { PartialOptions } from './options';
import type {
  EventListeners as GeneralEventListeners,
  EventListener as GeneralEventListener,
  AddEvent as GeneralAddEvent,
  RemoveEvent as GeneralRemoveEvent,
  TriggerEvent as GeneralTriggerEvent,
} from './support';

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
    /** Whether the scroll coordinates changed. */
    scrollCoordinatesChanged: boolean;
    /** Whether an host mutation took place. */
    hostMutation: boolean;
    /** Whether an content mutation took place. */
    contentMutation: boolean;
    /** Whether the host element appeared. */
    appear: boolean;
  };
  /** The changed options. */
  changedOptions: PartialOptions;
  /** Whether the update happened with an force invalidated cache. */
  force: boolean;
}

/**
 * A mapping between event names and their listener arguments.
 */
export type EventListenerArgs = {
  /** Dispatched after all elements are initialized and appended. */
  initialized: [instance: OverlayScrollbars];
  /** Dispatched after an update. */
  updated: [instance: OverlayScrollbars, onUpdatedArgs: OnUpdatedEventListenerArgs];
  /** Dispatched after all elements, observers and events are destroyed. */
  destroyed: [instance: OverlayScrollbars, canceled: boolean];
  /** Dispatched on scroll. */
  scroll: [instance: OverlayScrollbars, event: Event];
};

/**
 * An object which describes event listeners.
 * Simplified it looks like:
 * {
 *   [eventName: string]: EventListener | EventListener[]
 * }
 */
export type EventListeners = GeneralEventListeners<EventListenerArgs>;

/** An event listener. */
export type EventListener<N extends keyof EventListenerArgs> = GeneralEventListener<
  EventListenerArgs,
  N
>;

/** A function which adds event listeners. */
export type AddEvent = GeneralAddEvent<EventListenerArgs>;

/** A function which removes event listeners. */
export type RemoveEvent = GeneralRemoveEvent<EventListenerArgs>;

/** A function which triggers event listeners. */
export type TriggerEvent = GeneralTriggerEvent<EventListenerArgs>;
