import 'index.scss';

export { OverlayScrollbars } from 'overlayscrollbars';
export { scrollbarsHidingPlugin, sizeObserverPlugin } from 'plugins';

export type {
  Options,
  OverflowBehavior,
  ScrollbarVisibilityBehavior,
  ScrollbarAutoHideBehavior,
} from 'options';
export type {
  EventListenerMap,
  EventListener,
  InitialEventListeners,
  OnUpdatedEventListenerArgs,
} from 'eventListeners';
export type {
  Initialization,
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
  StaticInitializationElement,
  DynamicInitializationElement,
} from 'initialization';
export type { Plugin, PluginInstance } from 'plugins';
