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
import { addInstance, getInstance } from 'instances';

export interface OverlayScrollbarsStatic {
  (
    target: OSTarget | OSInitializationObject,
    options?: PartialOptions<OSOptions>,
    extensions?: any
  ): OverlayScrollbars;

  extend(osPlugin: OSPlugin | OSPlugin[]): void;
}

export interface OverlayScrollbars {
  options(): OSOptions;
  options(newOptions?: PartialOptions<OSOptions>): OSOptions;

  update(force?: boolean): void;
  destroy(): void;

  state(): any;
}

export const OverlayScrollbars: OverlayScrollbarsStatic = (
  target: OSTarget | OSInitializationObject,
  options?: PartialOptions<OSOptions>
): OverlayScrollbars => {
  const potentialInstance = getInstance(isHTMLElement(target) ? target : target.target);
  if (potentialInstance) {
    return potentialInstance;
  }

  const { _getDefaultOptions } = getEnvironment();
  const plugins = getPlugins();
  const optionsValidationPlugin = plugins[
    optionsValidationPluginName
  ] as OptionsValidationPluginInstance;
  const validateOptions = (newOptions?: PartialOptions<OSOptions>) => {
    const opts = newOptions || {};
    const validate = optionsValidationPlugin && optionsValidationPlugin._;
    return validate ? validate(opts, true) : opts;
  };
  const currentOptions: OSOptions = assignDeep({}, _getDefaultOptions(), validateOptions(options));
  const structureSetup: StructureSetup = createStructureSetup(target);
  const scrollbarsSetup: ScrollbarsSetup = createScrollbarsSetup(target, structureSetup);
  const lifecycleHub = createLifecycleHub(currentOptions, structureSetup, scrollbarsSetup);

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
    state: () => lifecycleHub._state(),
    update(force?: boolean) {
      lifecycleHub._update({}, force);
    },
    destroy: () => lifecycleHub._destroy(),
  };

  each(keys(plugins), (pluginName) => {
    const pluginInstance = plugins[pluginName];
    if (isFunction(pluginInstance)) {
      pluginInstance(OverlayScrollbars, instance);
    }
  });

  instance.update(true);

  addInstance(structureSetup._targetObj._target, instance);

  return instance;
};

OverlayScrollbars.extend = addPlugin;
