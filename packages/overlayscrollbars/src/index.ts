import './index.scss';

export {
  Environment,
  OverlayScrollbars,
  Elements,
  State,
  CloneableScrollbarElements,
  ScrollbarElements,
} from './overlayscrollbars';
export {
  ScrollbarsHidingPlugin,
  SizeObserverPlugin,
  ClickScrollPlugin,
  ScrollPersistencePlugin,
  createScrollPersistencePlugin,
} from './plugins';

export type {
  Options,
  OptionsDebounceValue,
  PartialOptions,
  ReadonlyOptions,
  OverflowBehavior,
  ScrollbarsVisibilityBehavior,
  ScrollbarsAutoHideBehavior,
  ScrollbarsClickScrollBehavior,
  ScrollbarsClickScrollBehaviorOptions,
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
  ScrollPersistenceStorageAdapter,
  ScrollPersistenceStorage,
  ScrollPersistencePosition,
  ScrollPersistenceAxis,
  ScrollPersistenceKeyResolver,
  ScrollPersistencePluginOptions,
  ScrollPersistencePluginInstance,
} from './plugins';
