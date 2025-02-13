/* eslint-disable @typescript-eslint/no-explicit-any */
import type { XY, TRBL } from './support';
import type { Options, PartialOptions, ReadonlyOptions } from './options';
import type {
  InferInstancePluginModuleInstance,
  InferStaticPluginModuleInstance,
  InstancePlugin,
  OptionsValidationPlugin,
  Plugin,
  PluginModuleInstance,
  StaticPlugin,
} from './plugins';
import type { Initialization, InitializationTarget, PartialInitialization } from './initialization';
import type { OverflowStyle } from './typings';
import type { EventListenerArgs, EventListener, EventListeners } from './eventListeners';
import type {
  ScrollbarsSetupElement,
  ScrollbarStructure,
} from './setups/scrollbarsSetup/scrollbarsSetup.elements';
import {
  addPlugins,
  getStaticPluginModuleInstance,
  optionsValidationPluginModuleName,
  pluginModules,
  registerPluginModuleInstances,
} from './plugins';
import { createSetups } from './setups';
import { addInstance, getInstance, removeInstance } from './instances';
import { cancelInitialization } from './initialization';
import { getEnvironment } from './environment';
import { getOptionsDiff } from './options';
import {
  assignDeep,
  isEmptyObject,
  isFunction,
  isHTMLElement,
  createEventListenerHub,
  isPlainObject,
  keys,
  isArray,
  push,
  runEachAndClear,
  bind,
  removeUndefinedProperties,
} from './support';
import { setNonce } from './nonce';
import { setTrustedTypePolicy } from './trustedTypePolicy';

// Notes:
// Height intrinsic detection use "content: true" init strategy - or open ticket for custom height intrinsic observer

/**
 * Describes the OverlayScrollbars environment.
 */
export interface Environment {
  /** The native scrollbars size of the browser / system. */
  scrollbarsSize: XY<number>;
  /** Whether the native scrollbars are overlaid. */
  scrollbarsOverlaid: XY<boolean>;
  /** Whether the browser supports native scrollbars hiding. */
  scrollbarsHiding: boolean;
  /** Whether the browser supports the ScrollTimeline API. */
  scrollTimeline: boolean;
  /** The default Initialization to use if nothing else is specified. */
  staticDefaultInitialization: Initialization;
  /** The default Options to use if nothing else is specified. */
  staticDefaultOptions: Options;

  /** Returns the current default Initialization. */
  getDefaultInitialization(): Initialization;
  /** Returns the current default Options. */
  getDefaultOptions(): Options;

  /**
   * Sets a new default Initialization.
   * If the new default Initialization is partially filled, its deeply merged with the current default Initialization.
   * @param newDefaultInitialization The new default Initialization.
   * @returns The current default Initialization.
   */
  setDefaultInitialization(newDefaultInitialization: PartialInitialization): Initialization;
  /**
   * Sets new default Options.
   * If the new default Options are partially filled, they're deeply merged with the current default Options.
   * @param newDefaultOptions The new default Options.
   * @returns The current default options.
   */
  setDefaultOptions(newDefaultOptions: PartialOptions): Options;
}

/**
 * The primary entry point to OverlayScrollbars.
 */
export interface OverlayScrollbarsStatic {
  /**
   * Returns the current OverlayScrollbars instance if the target already has an instance.
   * @param target The initialization target to from which the instance shall be returned.
   */
  (target: InitializationTarget): OverlayScrollbars | undefined;
  /**
   * Initializes a new OverlayScrollbars instance to the given target
   * or returns the current OverlayScrollbars instance if the target already has an instance.
   * @param target The target.
   * @param options The options. (Can be just an empty object)
   * @param eventListeners Optional event listeners.
   */
  (
    target: InitializationTarget,
    options: PartialOptions,
    eventListeners?: EventListeners
  ): OverlayScrollbars;

  /**
   * Checks whether the passed value is a valid and not destroyed overlayscrollbars instance.
   * @param osInstance The value which shall be checked.
   */
  valid(osInstance: any): osInstance is OverlayScrollbars;
  /**
   * Gets the environment.
   */
  env(): Environment;
  /**
   * Sets the nonce attribute for inline styles.
   */
  nonce(newNonce: string | undefined): void;
  /**
   * Sets the trusted type policy used for DOM operations.
   */
  trustedTypePolicy(newTrustedTypePolicy: unknown | undefined): void;
  /**
   * Adds a single plugin.
   * @param plugin The plugin to be added.
   * @returns The plugins static modules instance or `void` if no instance was found.
   */
  plugin<P extends Plugin>(
    plugin: P
  ): P extends StaticPlugin ? InferStaticPluginModuleInstance<P> : void;
  /**
   * Adds multiple plugins.
   * @param plugins The plugins to be added.
   * @returns The plugins static modules instances or `void` if no instance was found.
   */
  plugin<P extends [Plugin, ...Plugin[]]>(
    plugins: P
  ): P extends [Plugin, ...Plugin[]]
    ? {
        [K in keyof P]: P[K] extends StaticPlugin ? InferStaticPluginModuleInstance<P[K]> : void;
      }
    : void;
}

/**
 * Describes a OverlayScrollbars instances state.
 */
export interface State {
  /** Describes the current padding in pixel. */
  padding: TRBL;
  /** Whether the current padding is absolute. */
  paddingAbsolute: boolean;
  /** The client width (x) & height (y) of the viewport in pixel. */
  overflowEdge: XY<number>;
  /** The overflow amount in pixel. */
  overflowAmount: XY<number>;
  /** The css overflow style of the viewport. */
  overflowStyle: XY<OverflowStyle>;
  /** Whether the viewport has an overflow. */
  hasOverflow: XY<boolean>;
  /** The scroll coordinates of the viewport. */
  scrollCoordinates: {
    /** The start (origin) scroll coordinates for each axis. */
    start: XY<number>;
    /** The end scroll coordinates for each axis. */
    end: XY<number>;
  };
  /** Whether the direction is considered rtl. */
  directionRTL: boolean;
  /** Whether the instance is considered destroyed. */
  destroyed: boolean;
}

/**
 * Describes the elements of a scrollbar.
 */
export interface ScrollbarElements {
  /**
   * The root element of the scrollbar.
   * The HTML structure looks like this:
   * <scrollbar>
   *   <track>
   *     <handle />
   *   </track>
   * </scrollbar>
   */
  scrollbar: HTMLElement;
  /** The track element of the scrollbar. */
  track: HTMLElement;
  /** The handle element of the scrollbar. */
  handle: HTMLElement;
}

/**
 * Describes the elements of a scrollbar and provides the possibility to clone them.
 */
export interface CloneableScrollbarElements extends ScrollbarElements {
  /**
   * Clones the current scrollbar and returns the cloned elements.
   * The returned elements aren't added to the DOM.
   */
  clone(): ScrollbarElements;
}

/**
 * Describes the elements of a OverlayScrollbars instance.
 */
export interface Elements {
  /** The element the instance was applied to. */
  target: HTMLElement;
  /** The host element. Its the root of all other elements. */
  host: HTMLElement;
  /**
   * The element which is responsible to apply correct paddings.
   * Depending on the Initialization it can be the same as the viewport element.
   */
  padding: HTMLElement;
  /** The element which is responsible to do any scrolling. */
  viewport: HTMLElement;
  /**
   * The element which is responsible to hold the content.
   * Depending on the Initialization it can be the same as the viewport element.
   */
  content: HTMLElement;
  /**
   * The element through which you can get the current `scrollLeft` or `scrollTop` offset.
   * Depending on the target element it can be the same as the viewport element.
   */
  scrollOffsetElement: HTMLElement;
  /**
   * The element through which you can add `scroll` events.
   * Depending on the target element it can be the same as the viewport element.
   */
  scrollEventElement: HTMLElement | Document;
  /** The horizontal scrollbar elements. */
  scrollbarHorizontal: CloneableScrollbarElements;
  /** The vertical scrollbar elements. */
  scrollbarVertical: CloneableScrollbarElements;
}

/**
 * Describes a OverlayScrollbars instance.
 */
export interface OverlayScrollbars {
  /** Gets the current options of the instance. */
  options(): Options;
  /**
   * Sets the options of the instance.
   * If the new options are partially filled, they're deeply merged with either the current options or the current default options.
   * @param newOptions The new options which should be applied.
   * @param pure Whether the options should be reset before the new options are added.
   * @returns Returns the current options of the instance.
   */
  options(newOptions: PartialOptions, pure?: boolean): Options;

  /**
   * Adds event listeners to the instance.
   * @param eventListeners An object which contains the added listeners.
   * @param pure Whether all already added event listeners should be removed before the new listeners are added.
   * @returns Returns a function which removes the added listeners.
   */
  on(eventListeners: EventListeners, pure?: boolean): () => void;
  /**
   * Adds a single event listener to the instance.
   * @param name The name of the event.
   * @param listener The listener which is invoked on that event.
   * @returns Returns a function which removes the added listeners.
   */
  on<N extends keyof EventListenerArgs>(name: N, listener: EventListener<N>): () => void;
  /**
   * Adds multiple event listeners to the instance.
   * @param name The name of the event.
   * @param listener The listeners which are invoked on that event.
   * @returns Returns a function which removes the added listeners.
   */
  on<N extends keyof EventListenerArgs>(name: N, listener: EventListener<N>[]): () => void;

  /**
   * Removes a single event listener from the instance.
   * @param name The name of the event.
   * @param listener The listener which shall be removed.
   */
  off<N extends keyof EventListenerArgs>(name: N, listener: EventListener<N>): void;
  /**
   * Removes multiple event listeners from the instance.
   * @param name The name of the event.
   * @param listener The listeners which shall be removed.
   */
  off<N extends keyof EventListenerArgs>(name: N, listener: EventListener<N>[]): void;

  /**
   * Updates the instance.
   * @param force Whether the update should force the cache to be invalidated.
   * @returns A boolean which indicates whether the `update` event was triggered through this update.
   * The update event is only triggered if something changed because of this update.
   */
  update(force?: boolean): boolean;
  /** Returns the state of the instance. */
  state(): State;
  /** Returns the elements of the instance. */
  elements(): Elements;
  /** Destroys the instance and removes all added elements. */
  destroy(): void;
  /** Returns the instance of the passed plugin or `undefined` if no instance was found. */
  plugin<P extends InstancePlugin>(osPlugin: P): InferInstancePluginModuleInstance<P> | undefined;
}

export const OverlayScrollbars: OverlayScrollbarsStatic = (
  target: InitializationTarget,
  options?: PartialOptions,
  eventListeners?: EventListeners
) => {
  const { _getDefaultOptions } = getEnvironment();
  const targetIsElement = isHTMLElement(target);
  const instanceTarget = targetIsElement ? target : target.target;
  const potentialInstance = getInstance(instanceTarget);
  if (options && !potentialInstance) {
    let destroyed = false;
    const destroyFns: (() => void)[] = [];
    const instancePluginModuleInstances: Record<string, PluginModuleInstance> = {};
    const validateOptions = (newOptions: PartialOptions) => {
      const newOptionsWithoutUndefined = removeUndefinedProperties(newOptions, true);
      const pluginValidate = getStaticPluginModuleInstance<typeof OptionsValidationPlugin>(
        optionsValidationPluginModuleName
      );
      return pluginValidate
        ? pluginValidate(newOptionsWithoutUndefined, true)
        : newOptionsWithoutUndefined;
    };
    const currentOptions: ReadonlyOptions = assignDeep(
      {},
      _getDefaultOptions(),
      validateOptions(options)
    );
    const [addPluginEvent, removePluginEvents, triggerPluginEvent] =
      createEventListenerHub<EventListenerArgs>();
    const [addInstanceEvent, removeInstanceEvents, triggerInstanceEvent] =
      createEventListenerHub(eventListeners);
    const triggerEvent: typeof triggerPluginEvent = (name, args) => {
      triggerInstanceEvent(name, args);
      triggerPluginEvent(name, args);
    };
    const [setupsConstruct, setupsUpdate, setupsState, setupsElements, setupsCanceled] =
      createSetups(
        target,
        currentOptions,
        () => destroyed,
        ({ _changedOptions, _force }, { _observersUpdateHints, _structureUpdateHints }) => {
          const {
            _sizeChanged,
            _directionChanged,
            _heightIntrinsicChanged,
            _contentMutation,
            _hostMutation,
            _appear,
          } = _observersUpdateHints;

          const {
            _overflowEdgeChanged,
            _overflowAmountChanged,
            _overflowStyleChanged,
            _scrollCoordinatesChanged,
          } = _structureUpdateHints;

          triggerEvent('updated', [
            instance,
            {
              updateHints: {
                sizeChanged: !!_sizeChanged,
                directionChanged: !!_directionChanged,
                heightIntrinsicChanged: !!_heightIntrinsicChanged,
                overflowEdgeChanged: !!_overflowEdgeChanged,
                overflowAmountChanged: !!_overflowAmountChanged,
                overflowStyleChanged: !!_overflowStyleChanged,
                scrollCoordinatesChanged: !!_scrollCoordinatesChanged,
                contentMutation: !!_contentMutation,
                hostMutation: !!_hostMutation,
                appear: !!_appear,
              },
              changedOptions: _changedOptions || {},
              force: !!_force,
            },
          ]);
        },

        (scrollEvent) => triggerEvent('scroll', [instance, scrollEvent])
      );

    const destroy = (canceled: boolean) => {
      removeInstance(instanceTarget);
      runEachAndClear(destroyFns);

      destroyed = true;

      triggerEvent('destroyed', [instance, canceled]);
      removePluginEvents();
      removeInstanceEvents();
    };

    const instance: OverlayScrollbars = {
      options(newOptions?: PartialOptions, pure?: boolean) {
        if (newOptions) {
          const base = pure ? _getDefaultOptions() : {};
          const changedOptions = getOptionsDiff(
            currentOptions,
            assignDeep(base, validateOptions(newOptions))
          );
          if (!isEmptyObject(changedOptions)) {
            assignDeep(currentOptions, changedOptions);
            setupsUpdate({ _changedOptions: changedOptions });
          }
        }
        return assignDeep({}, currentOptions);
      },
      on: addInstanceEvent,
      off: (name, listener) => {
        if (name && listener) {
          removeInstanceEvents(name, listener);
        }
      },
      state() {
        const { _observersSetupState, _structureSetupState } = setupsState();
        const { _directionIsRTL } = _observersSetupState;
        const {
          _overflowEdge,
          _overflowAmount,
          _overflowStyle,
          _hasOverflow,
          _padding,
          _paddingAbsolute,
          _scrollCoordinates,
        } = _structureSetupState;
        return assignDeep(
          {},
          {
            overflowEdge: _overflowEdge,
            overflowAmount: _overflowAmount,
            overflowStyle: _overflowStyle,
            hasOverflow: _hasOverflow,
            scrollCoordinates: {
              start: _scrollCoordinates._start,
              end: _scrollCoordinates._end,
            },
            padding: _padding,
            paddingAbsolute: _paddingAbsolute,
            directionRTL: _directionIsRTL,
            destroyed,
          }
        );
      },
      elements() {
        const {
          _target,
          _host,
          _padding,
          _viewport,
          _content,
          _scrollOffsetElement,
          _scrollEventElement,
        } = setupsElements._structureSetupElements;
        const { _horizontal, _vertical } = setupsElements._scrollbarsSetupElements;
        const translateScrollbarStructure = (
          scrollbarStructure: ScrollbarStructure
        ): ScrollbarElements => {
          const { _handle, _track, _scrollbar } = scrollbarStructure;
          return {
            scrollbar: _scrollbar,
            track: _track,
            handle: _handle,
          };
        };
        const translateScrollbarsSetupElement = (
          scrollbarsSetupElement: ScrollbarsSetupElement
        ): CloneableScrollbarElements => {
          const { _scrollbarStructures, _clone } = scrollbarsSetupElement;
          const translatedStructure = translateScrollbarStructure(_scrollbarStructures[0]);

          return assignDeep({}, translatedStructure, {
            clone: () => {
              const result = translateScrollbarStructure(_clone());
              setupsUpdate({ _cloneScrollbar: true });
              return result;
            },
          });
        };
        return assignDeep(
          {},
          {
            target: _target,
            host: _host,
            padding: _padding || _viewport,
            viewport: _viewport,
            content: _content || _viewport,
            scrollOffsetElement: _scrollOffsetElement,
            scrollEventElement: _scrollEventElement,
            scrollbarHorizontal: translateScrollbarsSetupElement(_horizontal),
            scrollbarVertical: translateScrollbarsSetupElement(_vertical),
          }
        );
      },
      update: (_force?: boolean) => setupsUpdate({ _force, _takeRecords: true }),
      destroy: bind(destroy, false),
      plugin: <P extends InstancePlugin>(plugin: P) =>
        instancePluginModuleInstances[keys(plugin)[0]] as
          | InferInstancePluginModuleInstance<P>
          | undefined,
    };

    push(destroyFns, [setupsCanceled]);

    // valid inside plugins
    addInstance(instanceTarget, instance);

    // init plugins
    registerPluginModuleInstances(pluginModules, OverlayScrollbars, [
      instance,
      addPluginEvent,
      instancePluginModuleInstances,
    ]);

    if (
      cancelInitialization(
        setupsElements._structureSetupElements._isBody,
        !targetIsElement && target.cancel
      )
    ) {
      destroy(true);
      return instance;
    }

    push(destroyFns, setupsConstruct());

    triggerEvent('initialized', [instance]);

    instance.update();

    return instance;
  }
  return potentialInstance!;
};

OverlayScrollbars.plugin = (plugins: Plugin | Plugin[]) => {
  const isArr = isArray(plugins);
  const pluginsToAdd: Plugin<string, void | PluginModuleInstance, void | PluginModuleInstance>[] =
    isArr ? plugins : [plugins];
  const result = pluginsToAdd.map(
    (plugin) => registerPluginModuleInstances(plugin, OverlayScrollbars)[0]
  );
  addPlugins(pluginsToAdd);
  return isArr ? result : (result[0] as any);
};
OverlayScrollbars.valid = (osInstance: any): osInstance is OverlayScrollbars => {
  const hasElmsFn = osInstance && (osInstance as OverlayScrollbars).elements;
  const elements = isFunction(hasElmsFn) && hasElmsFn();
  return isPlainObject(elements) && !!getInstance(elements.target);
};
OverlayScrollbars.env = () => {
  const {
    _nativeScrollbarsSize,
    _nativeScrollbarsOverlaid,
    _nativeScrollbarsHiding,
    _scrollTimeline,
    _staticDefaultInitialization,
    _staticDefaultOptions,
    _getDefaultInitialization,
    _setDefaultInitialization,
    _getDefaultOptions,
    _setDefaultOptions,
  } = getEnvironment();
  return assignDeep(
    {},
    {
      scrollbarsSize: _nativeScrollbarsSize,
      scrollbarsOverlaid: _nativeScrollbarsOverlaid,
      scrollbarsHiding: _nativeScrollbarsHiding,
      scrollTimeline: _scrollTimeline,
      staticDefaultInitialization: _staticDefaultInitialization,
      staticDefaultOptions: _staticDefaultOptions,

      getDefaultInitialization: _getDefaultInitialization,
      setDefaultInitialization: _setDefaultInitialization,
      getDefaultOptions: _getDefaultOptions,
      setDefaultOptions: _setDefaultOptions,
    }
  );
};
OverlayScrollbars.nonce = setNonce;
OverlayScrollbars.trustedTypePolicy = setTrustedTypePolicy;
