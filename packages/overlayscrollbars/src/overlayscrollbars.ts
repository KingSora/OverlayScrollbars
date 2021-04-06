import { OSTarget, OSTargetObject } from 'typings';
import { PartialOptions, validateOptions, assignDeep, isEmptyObject } from 'support';
import { createStructureSetup, StructureSetup } from 'setups/structureSetup';
import { createLifecycleHub } from 'lifecycles/lifecycleHub';
import { OSOptions, optionsTemplate } from 'options';
import { getEnvironment } from 'environment';

export interface OverlayScrollbarsStatic {
  (target: OSTarget | OSTargetObject, options?: PartialOptions<OSOptions>, extensions?: any): OverlayScrollbars;
}

export interface OverlayScrollbars {
  options(): OSOptions;
  options(newOptions?: PartialOptions<OSOptions>): OSOptions;

  update(force?: boolean): void;
}

const OverlayScrollbars: OverlayScrollbarsStatic = (
  target: OSTarget | OSTargetObject,
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
  const lifecycleHub = createLifecycleHub(currentOptions, structureSetup);
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
    update(force?: boolean) {
      lifecycleHub._update(null, force);
    },
  };

  instance.update(true);

  return instance;
};

export default OverlayScrollbars;
