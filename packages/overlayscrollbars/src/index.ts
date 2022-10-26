import './index.scss';

export { OverlayScrollbars } from '~/overlayscrollbars';
export { ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from '~/plugins';

export type {
  Options,
  PartialOptions,
  ReadonlyOptions,
  OverflowBehavior,
  ScrollbarsVisibilityBehavior as ScrollbarVisibilityBehavior,
  ScrollbarsAutoHideBehavior as ScrollbarAutoHideBehavior,
} from '~/options';
export type {
  EventListenerMap,
  EventListener,
  EventListeners,
  OnUpdatedEventListenerArgs,
} from '~/eventListeners';
export type {
  Initialization,
  PartialInitialization,
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
  StaticInitializationElement,
  DynamicInitializationElement,
} from '~/initialization';
export type { Plugin, PluginInstance } from '~/plugins';
