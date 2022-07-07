import { OSTarget, OSInitializationObject, PartialOptions, OverflowStyle } from 'typings';
import {
  assignDeep,
  isEmptyObject,
  each,
  isFunction,
  keys,
  isHTMLElement,
  XY,
  TRBL,
} from 'support';
import { createStructureSetup, createScrollbarsSetup } from 'setups';
import { getOptionsDiff, OSOptions, ReadonlyOSOptions } from 'options';
import { DefaultInitializationStrategy, getEnvironment, InitializationStrategy } from 'environment';
import {
  getPlugins,
  addPlugin,
  optionsValidationPluginName,
  OSPlugin,
  OptionsValidationPluginInstance,
} from 'plugins';
import { addInstance, getInstance, removeInstance } from 'instances';
import {
  createOSEventListenerHub,
  InitialOSEventListeners,
  AddOSEventListener,
  RemoveOSEventListener,
} from 'eventListeners';

export interface OverlayScrollbarsStatic {
  (
    target: OSTarget | OSInitializationObject,
    options?: PartialOptions<OSOptions>,
    eventListeners?: InitialOSEventListeners
  ): OverlayScrollbars;

  plugin(osPlugin: OSPlugin | OSPlugin[]): void;
  env(): OverlayScrollbarsEnv;
}

export interface OverlayScrollbarsEnv {
  scrollbarSize: XY<number>;
  scrollbarIsOverlaid: XY<boolean>;
  scrollbarStyling: boolean;
  rtlScrollBehavior: { n: boolean; i: boolean };
  flexboxGlue: boolean;
  cssCustomProperties: boolean;
  defaultInitializationStrategy: DefaultInitializationStrategy;
  defaultDefaultOptions: OSOptions;

  getInitializationStrategy(): InitializationStrategy;
  setInitializationStrategy(newInitializationStrategy: Partial<InitializationStrategy>): void;
  getDefaultOptions(): OSOptions;
  setDefaultOptions(newDefaultOptions: PartialOptions<OSOptions>): void;
}

export interface OverlayScrollbarsState {
  padding: TRBL;
  paddingAbsolute: boolean;
  overflowAmount: XY<number>;
  overflowStyle: XY<OverflowStyle>;
  hasOverflow: XY<boolean>;
}

export interface OverlayScrollbarsElements {
  target: HTMLElement;
  host: HTMLElement;
  padding: HTMLElement;
  viewport: HTMLElement;
  content: HTMLElement;
}

export interface OverlayScrollbars {
  options(): OSOptions;
  options(newOptions?: PartialOptions<OSOptions>): OSOptions;

  update(force?: boolean): void;
  destroy(): void;

  state(): OverlayScrollbarsState;
  elements(): OverlayScrollbarsElements;

  on: AddOSEventListener;
  off: RemoveOSEventListener;
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
  const validateOptions = (newOptions?: PartialOptions<OSOptions>) => {
    const opts = newOptions || {};
    const validate = optionsValidationPlugin && optionsValidationPlugin._;
    return validate ? validate(opts, true) : opts;
  };
  const currentOptions: ReadonlyOSOptions = assignDeep(
    {},
    _getDefaultOptions(),
    validateOptions(options)
  );
  const [addEvent, removeEvent, triggerEvent] = createOSEventListenerHub(eventListeners);

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

  const update = (changedOptions: PartialOptions<OSOptions>, force?: boolean) => {
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

    triggerEvent('updated', {
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
    });
  });

  const instance: OverlayScrollbars = {
    options(newOptions?: PartialOptions<OSOptions>) {
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
