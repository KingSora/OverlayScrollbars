import { vi, describe, test, beforeEach, expect } from 'vitest';
import { defaultOptions } from '../../../../src/options';
import { OverlayScrollbars } from '../../../../src/overlayscrollbars';
import {
  OptionsValidationPlugin,
  optionsValidationPluginModuleName,
} from '../../../../src/plugins/optionsValidationPlugin';

const getValidationFn = async () => {
  const {
    registerPluginModuleInstances: registerPluginModuleInstance,
    getStaticPluginModuleInstance,
  } = await import('../../../../src/plugins');
  registerPluginModuleInstance(OptionsValidationPlugin, OverlayScrollbars);
  const validationFn = getStaticPluginModuleInstance<typeof OptionsValidationPlugin>(
    optionsValidationPluginModuleName
  );

  expect(typeof validationFn).toBe('function');
  return validationFn as Exclude<typeof validationFn, undefined>;
};

describe('optionsValidationPlugin', () => {
  beforeEach(async () => {
    vi.doMock(import('../../../../src/plugins'), async (importActual) => {
      const originalModule = await importActual();
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
