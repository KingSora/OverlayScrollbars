import './index.scss';

export {
  Environment,
  OverlayScrollbars,
  Elements,
  State,
  CloneableScrollbarElements,
  ScrollbarElements,
} from './overlayscrollbars';
export { ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from './plugins';

export type {
  Options,
  PartialOptions,
  ReadonlyOptions,
  OverflowBehavior,
  ScrollbarsVisibilityBehavior,
  ScrollbarsAutoHideBehavior,
} from './options';
export type {
  EventListener,
  EventListeners,
  EventListenerArgs,
  OnUpdatedEventListenerArgs,
} from './eventListeners';
export type {
  Initialization,
  PartialInitialization,
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
  StaticInitialization,
  DynamicInitialization,
  StaticInitializationElement,
  DynamicInitializationElement,
} from './initialization';
export type {
  PluginModuleInstance,
  PluginModule,
  Plugin,
  StaticPlugin,
  InstancePlugin,
  InstancePluginEvent,
  InferStaticPluginModuleInstance,
  InferInstancePluginModuleInstance,
} from './plugins';
