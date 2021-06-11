import { OSTarget, OSInitializationObject } from 'typings';
import { PartialOptions, validateOptions, assignDeep, isEmptyObject } from 'support';
import { createStructureSetup, StructureSetup } from 'setups/structureSetup';
import { createScrollbarsSetup, ScrollbarsSetup } from 'setups/scrollbarsSetup';
import { createLifecycleHub } from 'lifecycles/lifecycleHub';
import { OSOptions, optionsTemplate } from 'options';
import { getEnvironment } from 'environment';

export interface OverlayScrollbarsStatic {
  (target: OSTarget | OSInitializationObject, options?: PartialOptions<OSOptions>, extensions?: any): OverlayScrollbars;
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
  options?: PartialOptions<OSOptions>,
  extensions?: any
): OverlayScrollbars => {
  const { _getDefaultOptions } = getEnvironment();
  const currentOptions: OSOptions = assignDeep(
    {},
    _getDefaultOptions(),
    validateOptions(options || ({} as PartialOptions<OSOptions>), optionsTemplate, null, true)._validated
  );
  const structureSetup: StructureSetup = createStructureSetup(target);
  const scrollbarsSetup: ScrollbarsSetup = createScrollbarsSetup(target, structureSetup);
  const lifecycleHub = createLifecycleHub(currentOptions, structureSetup, scrollbarsSetup);

  const instance: OverlayScrollbars = {
    options(newOptions?: PartialOptions<OSOptions>) {
      if (newOptions) {
        const { _validated: _changedOptions } = validateOptions(newOptions, optionsTemplate, currentOptions, true);

        if (!isEmptyObject(_changedOptions)) {
          assignDeep(currentOptions, _changedOptions);
          lifecycleHub._update(_changedOptions);
        }
      }
      return currentOptions;
    },
    state: () => lifecycleHub._state(),
    update(force?: boolean) {
      lifecycleHub._update(null, force);
    },
    destroy: () => lifecycleHub._destroy(),
  };

  instance.update(true);

  return instance;
};
