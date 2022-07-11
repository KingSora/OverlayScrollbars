import {
  assignDeep,
  isEmptyObject,
  each,
  isFunction,
  keys,
  isHTMLElement,
  XY,
  TRBL,
  createEventListenerHub,
} from 'support';
import { createStructureSetup, createScrollbarsSetup } from 'setups';
import { getOptionsDiff, Options, ReadonlyOSOptions } from 'options';
import { getEnvironment } from 'environment';
import {
  getPlugins,
  addPlugin,
  optionsValidationPluginName,
  OSPlugin,
  OptionsValidationPluginInstance,
} from 'plugins';
import { addInstance, getInstance, removeInstance } from 'instances';
import type { PartialOptions, OverflowStyle } from 'typings';
import type {
  InitializationTarget,
  InitializationTargetObject,
  InitializationStrategy,
} from 'initialization';
import type {
  InitialEventListeners as GeneralInitialEventListeners,
  EventListener as GeneralEventListener,
} from 'support/eventListeners';

/*
onScrollStart               : null,
onScroll                    : null,
onScrollStop                : null,
onOverflowChanged           : null,
onOverflowAmountChanged     : null, // fusion with onOverflowChanged
onDirectionChanged          : null, // gone
onContentSizeChanged        : null, // gone
onHostSizeChanged           : null, // gone
*/

export interface OverlayScrollbarsStatic {
  (
    target: InitializationTarget | InitializationTargetObject,
    options?: PartialOptions<Options>,
    eventListeners?: GeneralInitialEventListeners<EventListenerMap>
  ): OverlayScrollbars;

  plugin(osPlugin: OSPlugin | OSPlugin[]): void;
  env(): Environment;
}

export interface Environment {
  scrollbarSize: XY<number>;
  scrollbarIsOverlaid: XY<boolean>;
  scrollbarStyling: boolean;
  rtlScrollBehavior: { n: boolean; i: boolean };
  flexboxGlue: boolean;
  cssCustomProperties: boolean;
  defaultInitializationStrategy: InitializationStrategy;
  defaultDefaultOptions: Options;

  getInitializationStrategy(): InitializationStrategy;
  setInitializationStrategy(newInitializationStrategy: Partial<InitializationStrategy>): void;
  getDefaultOptions(): Options;
  setDefaultOptions(newDefaultOptions: PartialOptions<Options>): void;
}

export interface State {
  padding: TRBL;
  paddingAbsolute: boolean;
  overflowAmount: XY<number>;
  overflowStyle: XY<OverflowStyle>;
  hasOverflow: XY<boolean>;
}

export interface Elements {
  target: HTMLElement;
  host: HTMLElement;
  padding: HTMLElement;
  viewport: HTMLElement;
  content: HTMLElement;
}

export interface OnUpdatedEventListenerArgs {
  updateHints: {
    sizeChanged: boolean;
    directionChanged: boolean;
    heightIntrinsicChanged: boolean;
    overflowAmountChanged: boolean;
    overflowStyleChanged: boolean;
    hostMutation: boolean;
    contentMutation: boolean;
  };
  changedOptions: PartialOptions<Options>;
  force: boolean;
}

export type EventListenerMap = {
  initialized: [];
  initializationWithdrawn: [];
  updated: [OnUpdatedEventListenerArgs];
  destroyed: [];
};

export type InitialEventListeners = GeneralInitialEventListeners<EventListenerMap>;

export type EventListener<Name extends keyof EventListenerMap> = GeneralEventListener<
  EventListenerMap,
  Name
>;

export interface OverlayScrollbars {
  options(): Options;
  options(newOptions?: PartialOptions<Options>): Options;

  update(force?: boolean): void;

  destroy(): void;

  state(): State;

  elements(): Elements;

  on<Name extends keyof EventListenerMap>(name: Name, listener: EventListener<Name>): () => void;
  on<Name extends keyof EventListenerMap>(name: Name, listener: EventListener<Name>[]): () => void;

  off<Name extends keyof EventListenerMap>(name: Name, listener: EventListener<Name>): void;
  off<Name extends keyof EventListenerMap>(name: Name, listener: EventListener<Name>[]): void;
}

/**
 * Notes:
 * Height intrinsic detection use "content: true" init strategy - or open ticket for custom height intrinsic observer
 */

export const OverlayScrollbars: OverlayScrollbarsStatic = (
  target,
  options?,
  eventListeners?
): OverlayScrollbars => {
  const {
    _getDefaultOptions,
    _nativeScrollbarIsOverlaid,
    _addListener: addEnvListener,
  } = getEnvironment();
  const plugins = getPlugins();
  const instanceTarget = isHTMLElement(target) ? target : target.target;
  const potentialInstance = getInstance(instanceTarget);
  if (potentialInstance) {
    return potentialInstance;
  }

  const optionsValidationPlugin = plugins[
    optionsValidationPluginName
  ] as OptionsValidationPluginInstance;
  const validateOptions = (newOptions?: PartialOptions<Options>) => {
    const opts = newOptions || {};
    const validate = optionsValidationPlugin && optionsValidationPlugin._;
    return validate ? validate(opts, true) : opts;
  };
  const currentOptions: ReadonlyOSOptions = assignDeep(
    {},
    _getDefaultOptions(),
    validateOptions(options)
  );
  const [addEvent, removeEvent, triggerEvent] = createEventListenerHub(eventListeners);

  if (
    _nativeScrollbarIsOverlaid.x &&
    _nativeScrollbarIsOverlaid.y &&
    !currentOptions.nativeScrollbarsOverlaid.initialize
  ) {
    triggerEvent('initializationWithdrawn');
  }

  const [updateStructure, structureState, destroyStructure] = createStructureSetup(
    target,
    currentOptions
  );
  const [updateScrollbars, , destroyScrollbars] = createScrollbarsSetup(
    target,
    currentOptions,
    structureState._elements
  );

  const update = (changedOptions: PartialOptions<Options>, force?: boolean) => {
    updateStructure(changedOptions, force);
    updateScrollbars(changedOptions, force);
  };

  const removeEnvListener = addEnvListener(update.bind(0, {}, true));

  structureState._addOnUpdatedListener((updateHints, changedOptions, force) => {
    const {
      _sizeChanged,
      _directionChanged,
      _heightIntrinsicChanged,
      _overflowAmountChanged,
      _overflowStyleChanged,
      _contentMutation,
      _hostMutation,
    } = updateHints;

    triggerEvent('updated', [
      {
        updateHints: {
          sizeChanged: _sizeChanged,
          directionChanged: _directionChanged,
          heightIntrinsicChanged: _heightIntrinsicChanged,
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

  const instance: OverlayScrollbars = {
    options(newOptions?: PartialOptions<Options>) {
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
    off: removeEvent,
    state() {
      const { _overflowAmount, _overflowStyle, _hasOverflow, _padding, _paddingAbsolute } =
        structureState();
      return assignDeep(
        {},
        {
          overflowAmount: _overflowAmount,
          overflowStyle: _overflowStyle,
          hasOverflow: _hasOverflow,
          padding: _padding,
          paddingAbsolute: _paddingAbsolute,
        }
      );
    },
    elements() {
      const { _target, _host, _padding, _viewport, _content } = structureState._elements;
      return assignDeep(
        {},
        {
          target: _target,
          host: _host,
          padding: _padding || _viewport,
          viewport: _viewport,
          content: _content || _viewport,
        }
      );
    },
    update(force?: boolean) {
      update({}, force);
    },
    destroy: () => {
      removeInstance(instanceTarget);
      removeEnvListener();
      removeEvent();

      destroyScrollbars();
      destroyStructure();

      triggerEvent('destroyed');
    },
  };

  each(keys(plugins), (pluginName) => {
    const pluginInstance = plugins[pluginName];
    if (isFunction(pluginInstance)) {
      pluginInstance(OverlayScrollbars, instance);
    }
  });

  instance.update(true);

  addInstance(instanceTarget, instance);

  triggerEvent('initialized');

  return instance;
};

OverlayScrollbars.plugin = addPlugin;
OverlayScrollbars.env = () => {
  const {
    _nativeScrollbarSize,
    _nativeScrollbarIsOverlaid,
    _nativeScrollbarStyling,
    _rtlScrollBehavior,
    _flexboxGlue,
    _cssCustomProperties,
    _defaultInitializationStrategy,
    _defaultDefaultOptions,
    _getInitializationStrategy,
    _setInitializationStrategy,
    _getDefaultOptions,
    _setDefaultOptions,
  } = getEnvironment();
  return assignDeep(
    {},
    {
      scrollbarSize: _nativeScrollbarSize,
      scrollbarIsOverlaid: _nativeScrollbarIsOverlaid,
      scrollbarStyling: _nativeScrollbarStyling,
      rtlScrollBehavior: _rtlScrollBehavior,
      flexboxGlue: _flexboxGlue,
      cssCustomProperties: _cssCustomProperties,
      defaultInitializationStrategy: _defaultInitializationStrategy,
      defaultDefaultOptions: _defaultDefaultOptions,

      getInitializationStrategy: _getInitializationStrategy,
      setInitializationStrategy: _setInitializationStrategy,
      getDefaultOptions: _getDefaultOptions,
      setDefaultOptions: _setDefaultOptions,
    }
  );
};
