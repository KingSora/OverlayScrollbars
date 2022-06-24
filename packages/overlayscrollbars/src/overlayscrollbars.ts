import { OSTarget, OSInitializationObject, PartialOptions } from 'typings';
import { assignDeep, isEmptyObject, each, isFunction, keys, isHTMLElement } from 'support';
import { createStructureSetup, StructureSetup } from 'setups/structureSetup';
import { createScrollbarsSetup, ScrollbarsSetup } from 'setups/scrollbarsSetup';
import { createLifecycleHub } from 'lifecycles/lifecycleHub';
import { getOptionsDiff, OSOptions } from 'options';
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
  createEventListenerHub,
  EventListenersMap,
  AddEventListener,
  RemoveEventListener,
} from 'eventListeners';

export interface OverlayScrollbarsStatic {
  (
    target: OSTarget | OSInitializationObject,
    options?: PartialOptions<OSOptions>,
    eventListeners?: EventListenersMap
  ): OverlayScrollbars;

  extend(osPlugin: OSPlugin | OSPlugin[]): void;
}

export interface OverlayScrollbars {
  options(): OSOptions;
  options(newOptions?: PartialOptions<OSOptions>): OSOptions;

  update(force?: boolean): void;
  destroy(): void;

  state(): any;

  on: AddEventListener;
  off: RemoveEventListener;
}

export const OverlayScrollbars: OverlayScrollbarsStatic = (
  target,
  options?,
  eventListeners?
): OverlayScrollbars => {
  const { _getDefaultOptions, _nativeScrollbarIsOverlaid } = getEnvironment();
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
  const currentOptions: OSOptions = assignDeep({}, _getDefaultOptions(), validateOptions(options));
  const [addEvent, removeEvent, triggerEvent] = createEventListenerHub(eventListeners);

  if (
    _nativeScrollbarIsOverlaid.x &&
    _nativeScrollbarIsOverlaid.y &&
    !currentOptions.nativeScrollbarsOverlaid.initialize
  ) {
    triggerEvent('initializationWithdrawn');
  }

  const structureSetup: StructureSetup = createStructureSetup(target);
  const scrollbarsSetup: ScrollbarsSetup = createScrollbarsSetup(target, structureSetup);
  const lifecycleHub = createLifecycleHub(
    currentOptions,
    triggerEvent,
    structureSetup,
    scrollbarsSetup
  );

  const instance: OverlayScrollbars = {
    options(newOptions?: PartialOptions<OSOptions>) {
      if (newOptions) {
        const changedOptions = getOptionsDiff(currentOptions, validateOptions(newOptions));

        if (!isEmptyObject(changedOptions)) {
          assignDeep(currentOptions, changedOptions);
          lifecycleHub._update(changedOptions);
        }
      }
      return currentOptions;
    },
    on: addEvent,
    off: removeEvent,
    state: () => lifecycleHub._state(),
    update(force?: boolean) {
      lifecycleHub._update({}, force);
    },
    destroy: () => {
      lifecycleHub._destroy();
      removeInstance(instanceTarget);
      removeEvent();
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
