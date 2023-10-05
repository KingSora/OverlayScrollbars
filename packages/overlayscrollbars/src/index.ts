import './index.scss';

export { OverlayScrollbars } from '~/overlayscrollbars';
export { ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from '~/plugins';

export type {
  Options,
  PartialOptions,
  ReadonlyOptions,
  OverflowBehavior,
  ScrollbarsVisibilityBehavior,
  ScrollbarsAutoHideBehavior,
} from '~/options';
export type {
  EventListener,
  EventListeners,
  EventListenerArgs,
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
export type {
  PluginModuleInstance,
  PluginModule,
  Plugin,
  StaticPlugin,
  InstancePlugin,
  InferStaticPluginModuleInstance,
  InferInstancePluginModuleInstance,
} from '~/plugins';
