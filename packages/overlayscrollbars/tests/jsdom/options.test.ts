import { validateOptions } from 'support/options';
import { defaultOptions, optionsTemplate } from 'options';

describe('options', () => {
  test('default options matching the options template', () => {
    const { _validated } = validateOptions(defaultOptions, optionsTemplate);
    expect(_validated).toEqual(defaultOptions);
  });
});
