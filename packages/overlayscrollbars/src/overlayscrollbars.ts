import {
  assignDeep,
  isEmptyObject,
  each,
  isFunction,
  keys,
  isHTMLElement,
  createEventListenerHub,
  isPlainObject,
} from '~/support';
import { getOptionsDiff } from '~/options';
import { getEnvironment } from '~/environment';
import { cancelInitialization } from '~/initialization';
import { addInstance, getInstance, removeInstance } from '~/instances';
import { createStructureSetup, createScrollbarsSetup } from '~/setups';
import { getPlugins, addPlugin, optionsValidationPluginName } from '~/plugins';
import type { Environment } from '~/environment';
import type { XY, TRBL } from '~/support';
import type { Options, ReadonlyOptions } from '~/options';
import type { Plugin, OptionsValidationPluginInstance, PluginInstance } from '~/plugins';
import type { InitializationTarget } from '~/initialization';
import type { DeepPartial, OverflowStyle } from '~/typings';
import type { EventListenerMap, EventListener, InitialEventListeners } from '~/eventListeners';
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
   * Initialized a new OverlayScrollbars instance to the given target
   * or returns the current OverlayScrollbars instance if the target already has an instance.
   * @param target The target.
   * @param options The options. (Can be just an empty object)
   * @param eventListeners Optional event listeners.
   */
  (
    target: InitializationTarget,
    options: DeepPartial<Options>,
    eventListeners?: InitialEventListeners
  ): OverlayScrollbars;

  /**
   * Adds one or multiple plugins.
   * @param plugin Either a signle or an array of plugins to add.
   */
  plugin(plugin: Plugin | Plugin[]): void;
  /**
   * Checkts whether the passed value is a valid overlayscrollbars instance.
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
   * If the new options are partially filled, they're deeply merged with the current options.
   * @param newOptions The new options.
   */
  options(newOptions: DeepPartial<Options>): Options;

  /**
   * Adds an event listener to the instance.
   * @param name The name of the event.
   * @param listener The listener which is invoked on that event.
   */
  on<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>): () => void;
  /**
   * Adds multiple event listeners to the instance.
   * @param name The name of the event.
   * @param listener The listeners which are invoked on that event.
   */
  on<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>[]): () => void;

  /**
   * Removes an event listener from the instance.
   * @param name The name of the event.
   * @param listener The listener which shall be removed.
   */
  off<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>): void;
  /**
   * Removes multiple event listeners from the instance.
   * @param name The name of the event.
   * @param listener The listeners which shall be removed.
   */
  off<N extends keyof EventListenerMap>(name: N, listener: EventListener<N>[]): void;

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
}

const invokePluginInstance = (
  pluginInstance: PluginInstance,
  staticObj?: OverlayScrollbarsStatic | false | null | undefined | 0,
  instanceObj?: OverlayScrollbars | false | null | undefined | 0
) => {
  if (isFunction(pluginInstance)) {
    pluginInstance(staticObj || undefined, instanceObj || undefined);
  }
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OverlayScrollbars: OverlayScrollbarsStatic = (
  target: InitializationTarget,
  options?: DeepPartial<Options>,
  eventListeners?: InitialEventListeners
) => {
  const { _getDefaultOptions, _getDefaultInitialization, _addListener } = getEnvironment();
  const plugins = getPlugins();
  const targetIsElement = isHTMLElement(target);
  const instanceTarget = targetIsElement ? target : target.target;
  const potentialInstance = getInstance(instanceTarget);
  if (options && !potentialInstance) {
    let destroyed = false;
    const validateOptions = (newOptions: DeepPartial<Options>) => {
      const optionsValidationPlugin = getPlugins()[
        optionsValidationPluginName
      ] as OptionsValidationPluginInstance;
      const validate = optionsValidationPlugin && optionsValidationPlugin._;
      return validate ? validate(newOptions, true) : newOptions;
    };
    const currentOptions: ReadonlyOptions = assignDeep(
      {},
      _getDefaultOptions(),
      validateOptions(options)
    );
    const [addEvent, removeEvent, triggerEvent] = createEventListenerHub(eventListeners);
    const [updateStructure, structureState, destroyStructure] = createStructureSetup(
      target,
      currentOptions
    );
    const [updateScrollbars, scrollbarsState, destroyScrollbars] = createScrollbarsSetup(
      target,
      currentOptions,
      structureState
    );
    const update = (changedOptions: DeepPartial<Options>, force?: boolean): boolean =>
      updateStructure(changedOptions, !!force);
    const removeEnvListener = _addListener(update.bind(0, {}, true));
    const destroy = (canceled?: boolean) => {
      removeInstance(instanceTarget);
      removeEnvListener();

      destroyScrollbars();
      destroyStructure();

      destroyed = true;

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      triggerEvent('destroyed', [instance, !!canceled]);
      removeEvent();
    };

    const instance: OverlayScrollbars = {
      options(newOptions?: DeepPartial<Options>) {
        if (newOptions) {
          const changedOptions = getOptionsDiff(currentOptions, validateOptions(newOptions));
          if (!isEmptyObject(changedOptions)) {
            assignDeep(currentOptions, changedOptions);
            update(changedOptions);
          }
        }
        return assignDeep({}, currentOptions);
      },
      on: addEvent,
      off: (name, listener) => {
        name && listener && removeEvent(name, listener as any);
      },
      state() {
        const {
          _overflowEdge,
          _overflowAmount,
          _overflowStyle,
          _hasOverflow,
          _padding,
          _paddingAbsolute,
          _directionIsRTL,
        } = structureState();
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
        } = structureState._elements;
        const { _horizontal, _vertical } = scrollbarsState._elements;
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
              updateScrollbars({}, true, {});
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
      update: (force?: boolean) => update({}, force),
      destroy: destroy.bind(0),
    };

    structureState._addOnUpdatedListener((updateHints, changedOptions, force: boolean) => {
      updateScrollbars(changedOptions, force, updateHints);
    });

    // valid inside plugins
    addInstance(instanceTarget, instance);

    // init plugins
    each(keys(plugins), (pluginName) => invokePluginInstance(plugins[pluginName], 0, instance));

    if (
      cancelInitialization(
        structureState._elements._isBody,
        _getDefaultInitialization().cancel,
        !targetIsElement && target.cancel
      )
    ) {
      destroy(true);
      return instance;
    }

    structureState._appendElements();
    scrollbarsState._appendElements();

    triggerEvent('initialized', [instance]);

    structureState._addOnUpdatedListener((updateHints, changedOptions, force) => {
      const {
        _sizeChanged,
        _directionChanged,
        _heightIntrinsicChanged,
        _overflowEdgeChanged,
        _overflowAmountChanged,
        _overflowStyleChanged,
        _contentMutation,
        _hostMutation,
      } = updateHints;

      triggerEvent('updated', [
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
          changedOptions,
          force,
        },
      ]);
    });

    instance.update(true);

    return instance;
  }
  return potentialInstance!;
};

OverlayScrollbars.plugin = (plugins: Plugin | Plugin[]) => {
  each(addPlugin(plugins), (pluginInstance) =>
    invokePluginInstance(pluginInstance, OverlayScrollbars)
  );
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
      staticDefaultInitialization: _staticDefaultInitialization,
      staticDefaultOptions: _staticDefaultOptions,

      getDefaultInitialization: _getDefaultInitialization,
      setDefaultInitialization: _setDefaultInitialization,
      getDefaultOptions: _getDefaultOptions,
      setDefaultOptions: _setDefaultOptions,
    }
  );
};
