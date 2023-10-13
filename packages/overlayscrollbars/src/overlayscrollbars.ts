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
} from '~/support';
import { getOptionsDiff } from '~/options';
import { getEnvironment } from '~/environment';
import { cancelInitialization } from '~/initialization';
import { addInstance, getInstance, removeInstance } from '~/instances';
import { createSetups } from '~/setups';
import {
  addPlugins,
  getStaticPluginModuleInstance,
  optionsValidationPluginModuleName,
  pluginModules,
  registerPluginModuleInstances,
} from '~/plugins';
import type { Environment } from '~/environment';
import type { XY, TRBL } from '~/support';
import type { Options, PartialOptions, ReadonlyOptions } from '~/options';
import type {
  InferInstancePluginModuleInstance,
  InferStaticPluginModuleInstance,
  InstancePlugin,
  OptionsValidationPlugin,
  Plugin,
  PluginModuleInstance,
  StaticPlugin,
} from '~/plugins';
import type { InitializationTarget } from '~/initialization';
import type { OverflowStyle } from '~/typings';
import type { EventListenerArgs, EventListener, EventListeners } from '~/eventListeners';
import type {
  ScrollbarsSetupElement,
  ScrollbarStructure,
} from '~/setups/scrollbarsSetup/scrollbarsSetup.elements';

// Notes:
// Height intrinsic detection use "content: true" init strategy - or open ticket for custom height intrinsic observer

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
   * Adds one or multiple plugins.
   * @param plugin Either a signle or an array of plugins to add.
   */
  plugin<P extends Plugin | [Plugin, ...Plugin[]]>(
    plugin: P
  ): P extends [Plugin, ...Plugin[]]
    ? {
        [K in keyof P]: P[K] extends StaticPlugin ? InferStaticPluginModuleInstance<P[K]> : void;
      }
    : P extends StaticPlugin
    ? InferStaticPluginModuleInstance<P>
    : void;
  /**
   * Checks whether the passed value is a valid and not destroyed overlayscrollbars instance.
   * @param osInstance The value which shall be checked.
   */
  valid(osInstance: any): osInstance is OverlayScrollbars;
  /**
   * Returns the overlayscrollbars environment.
   */
  env(): Environment;
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
  /** Get the current options of the instance. */
  options(): Options;
  /**
   * Sets the options of the instance.
   * If the new options are partially filled, they're deeply merged with either the current options or the current default options.
   * @param newOptions The new options.
   * @param pure If true the new options will be merged with the current default options instead of the current options.
   * @returns Returns the current options of the instance.
   */
  options(newOptions: PartialOptions, pure?: boolean): Options;

  /**
   * Adds event listeners to the instance.
   * @param eventListeners An object which contains the added listeners.
   * @param pure If true all already added event listeners will be removed before the new listeners are added.
   * @returns Returns a function which removes the added listeners.
   */
  on(eventListeners: EventListeners, pure?: boolean): () => void;
  /**
   * Adds an event listener to the instance.
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
   * Removes an event listener from the instance.
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
  /** Destroys the instance. */
  destroy(): void;
  /** Returns the instance of the passed plugin or `undefined` if no instance was found. */
  plugin<P extends InstancePlugin>(osPlugin: P): InferInstancePluginModuleInstance<P> | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OverlayScrollbars: OverlayScrollbarsStatic = (
  target: InitializationTarget,
  options?: PartialOptions,
  eventListeners?: EventListeners
) => {
  const { _getDefaultOptions, _addZoomListener, _addResizeListener } = getEnvironment();
  const targetIsElement = isHTMLElement(target);
  const instanceTarget = targetIsElement ? target : target.target;
  const potentialInstance = getInstance(instanceTarget);
  if (options && !potentialInstance) {
    let destroyed = false;
    const destroyFns: (() => void)[] = [];
    const instancePluginModuleInstances: Record<string, PluginModuleInstance> = {};
    const validateOptions = (newOptions: PartialOptions) => {
      const pluginValidate = getStaticPluginModuleInstance<typeof OptionsValidationPlugin>(
        optionsValidationPluginModuleName
      );
      return pluginValidate ? pluginValidate(newOptions, true) : newOptions;
    };
    const currentOptions: ReadonlyOptions = assignDeep(
      {},
      _getDefaultOptions(),
      validateOptions(options)
    );
    const [addEvent, removeEvent, triggerEvent] = createEventListenerHub(eventListeners);
    const [setupsConstruct, setupsUpdate, setupsState, setupsElements, setupsCanceled] =
      createSetups(
        target,
        currentOptions,
        ({ _changedOptions, _force }, { _observersUpdateHints, _structureUpdateHints }) => {
          const {
            _sizeChanged,
            _directionChanged,
            _heightIntrinsicChanged,
            _contentMutation,
            _hostMutation,
          } = _observersUpdateHints;

          const { _overflowEdgeChanged, _overflowAmountChanged, _overflowStyleChanged } =
            _structureUpdateHints;

          triggerEvent('updated', [
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            instance,
            {
              updateHints: {
                sizeChanged: _sizeChanged,
                directionChanged: _directionChanged,
                heightIntrinsicChanged: _heightIntrinsicChanged,
                overflowEdgeChanged: _overflowEdgeChanged,
                overflowAmountChanged: _overflowAmountChanged,
                overflowStyleChanged: _overflowStyleChanged,
                contentMutation: _contentMutation,
                hostMutation: _hostMutation,
              },
              changedOptions: _changedOptions || {},
              force: !!_force,
            },
          ]);
        },
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        (scrollEvent) => triggerEvent('scroll', [instance, scrollEvent])
      );

    const destroy = (canceled: boolean) => {
      removeInstance(instanceTarget);
      runEachAndClear(destroyFns);

      destroyed = true;

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      triggerEvent('destroyed', [instance, canceled]);
      removeEvent();
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
      on: addEvent,
      off: (name, listener) => {
        name && listener && removeEvent(name, listener as any);
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
        } = _structureSetupState;
        return assignDeep(
          {},
          {
            overflowEdge: _overflowEdge,
            overflowAmount: _overflowAmount,
            overflowStyle: _overflowStyle,
            hasOverflow: _hasOverflow,
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
    const resizeUpdate = bind(instance.update, true);
    push(destroyFns, [
      _addZoomListener(resizeUpdate),
      _addResizeListener(resizeUpdate),
      setupsCanceled,
    ]);

    // valid inside plugins
    addInstance(instanceTarget, instance);

    // init plugins
    registerPluginModuleInstances(
      pluginModules,
      OverlayScrollbars,
      instance,
      instancePluginModuleInstances
    );

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

    instance.update(true);

    return instance;
  }
  return potentialInstance!;
};

OverlayScrollbars.plugin = (plugins) => {
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
    _rtlScrollBehavior,
    _flexboxGlue,
    _cssCustomProperties,
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
      rtlScrollBehavior: _rtlScrollBehavior,
      flexboxGlue: _flexboxGlue,
      cssCustomProperties: _cssCustomProperties,
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
