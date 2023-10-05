import { defaultOptions } from '~/options';
import { OverlayScrollbars } from '~/overlayscrollbars';
import {
  OptionsValidationPlugin,
  optionsValidationPluginModuleName,
} from '~/plugins/optionsValidationPlugin';

const getValidationFn = async () => {
  const {
    registerPluginModuleInstances: registerPluginModuleInstance,
    getStaticPluginModuleInstance,
  } = await import('~/plugins');
  registerPluginModuleInstance(OptionsValidationPlugin, OverlayScrollbars);
  const validationFn = getStaticPluginModuleInstance<
    typeof optionsValidationPluginModuleName,
    typeof OptionsValidationPlugin
  >(optionsValidationPluginModuleName);

  expect(typeof validationFn).toBe('function');
  return validationFn as Exclude<typeof validationFn, undefined>;
};

describe('optionsValidationPlugin', () => {
  beforeEach(async () => {
    jest.doMock('~/plugins', () => {
      const originalModule = jest.requireActual('~/plugins');
      return { ...originalModule };
    });
  });

  test('default options matching the options template', async () => {
    const validationFn = await getValidationFn();

    expect(validationFn(defaultOptions)).toEqual(defaultOptions);
  });

  test('foreign options are in the result', async () => {
    const validationFn = await getValidationFn();
    const foreignOps = {
      someOption: true,
      someDeepOption: {
        someDeepOption: false,
      },
    };

    // @ts-ignore
    expect(validationFn(foreignOps)).toEqual(foreignOps);
  });
});
