import { OSTarget, OSTargetObject } from 'typings';

import { validateOptions, assignDeep, isEmptyObject } from 'support';
import { createStructureSetup, StructureSetup } from 'setups/structureSetup';
import { createLifecycleHub } from 'lifecycles/lifecycleHub';
import { Options, defaultOptions, optionsTemplate } from 'options';

const OverlayScrollbars = (target: OSTarget | OSTargetObject, options?: Options, extensions?: any): any => {
  const currentOptions: Required<Options> = assignDeep(
    {},
    defaultOptions,
    validateOptions<Options>(options || ({} as Options), optionsTemplate, null, true)._validated
  );
  const structureSetup: StructureSetup = createStructureSetup(target);
  const lifecycleHub = createLifecycleHub(currentOptions, structureSetup);
  const instance = {
    options(newOptions?: Options) {
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
