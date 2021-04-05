import { OSTarget, OSTargetObject } from 'typings';

import { PartialOptions, validateOptions, assignDeep, isEmptyObject } from 'support';
import { createStructureSetup, StructureSetup } from 'setups/structureSetup';
import { createLifecycleHub } from 'lifecycles/lifecycleHub';
import { OverlayScrollbarsOptions, optionsTemplate } from 'options';
import { getEnvironment } from 'environment';

const OverlayScrollbars = (target: OSTarget | OSTargetObject, options?: PartialOptions<OverlayScrollbarsOptions>, extensions?: any): any => {
  const { _getDefaultOptions } = getEnvironment();
  const currentOptions: OverlayScrollbarsOptions = assignDeep(
    {},
    _getDefaultOptions(),
    validateOptions(options || ({} as PartialOptions<OverlayScrollbarsOptions>), optionsTemplate, null, true)._validated
  );
  const structureSetup: StructureSetup = createStructureSetup(target);
  const lifecycleHub = createLifecycleHub(currentOptions, structureSetup);
  const instance = {
    options(newOptions?: PartialOptions<OverlayScrollbarsOptions>) {
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

export { OverlayScrollbars };
