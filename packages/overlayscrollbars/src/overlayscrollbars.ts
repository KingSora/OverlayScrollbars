import { OSTarget, OSInitializationObject, PartialOptions } from 'typings';
import { assignDeep, isEmptyObject, each, isFunction, keys, isHTMLElement, WH, XY } from 'support';
import { createStructureSetup, createScrollbarsSetup } from 'setups';
import { getOptionsDiff, OSOptions, ReadonlyOSOptions } from 'options';
import { getEnvironment } from 'environment';
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

  extend(osPlugin: OSPlugin | OSPlugin[]): void;
}

export interface OverlayScrollbars {
  options(): OSOptions;
  options(newOptions?: PartialOptions<OSOptions>): OSOptions;

  update(force?: boolean): void;
  destroy(): void;

  state(): any;

  on: AddOSEventListener;
  off: RemoveOSEventListener;
}

const createOverflowChangedArgs = (
  overflowAmount: WH<number>,
  hasOverflow: XY<boolean>,
  overflowScroll: XY<boolean>
) => ({
  amount: {
    x: overflowAmount.w,
    y: overflowAmount.h,
  },
  overflow: hasOverflow,
  scrollableOverflow: assignDeep({}, overflowScroll),
});

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

  structureState._addOnUpdatedListener((updateHints, changedOptions, force) => {
    const {
      _sizeChanged,
      _directionChanged,
      _heightIntrinsicChanged,
      _overflowAmountChanged,
      _overflowScrollChanged,
      _contentMutation,
      _hostMutation,
    } = updateHints;
    const { _overflowAmount, _overflowScroll, _hasOverflow } = structureState();

    if (_overflowAmountChanged || _overflowScrollChanged) {
      triggerEvent(
        'overflowChanged',
        assignDeep({}, createOverflowChangedArgs(_overflowAmount, _hasOverflow, _overflowScroll), {
          previous: createOverflowChangedArgs(_overflowAmount!, _hasOverflow, _overflowScroll!),
        })
      );
    }

    triggerEvent('updated', {
      updateHints: {
        sizeChanged: _sizeChanged,
        directionChanged: _directionChanged,
        heightIntrinsicChanged: _heightIntrinsicChanged,
        overflowAmountChanged: _overflowAmountChanged,
        overflowScrollChanged: _overflowScrollChanged,
        contentMutation: _contentMutation,
        hostMutation: _hostMutation,
      },
      changedOptions,
      force,
    });
  });

  const removeEnvListener = addEnvListener(update.bind(0, {}, true));

  const instance: OverlayScrollbars = {
    options(newOptions?: PartialOptions<OSOptions>) {
      if (newOptions) {
        const changedOptions = getOptionsDiff(currentOptions, validateOptions(newOptions));

        if (!isEmptyObject(changedOptions)) {
          assignDeep(currentOptions, changedOptions);
          update(changedOptions);
        }
      }
      return currentOptions;
    },
    on: addEvent,
    off: removeEvent,
    state: () => ({
      _overflowAmount: structureState()._overflowAmount,
    }),
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

OverlayScrollbars.extend = addPlugin;
