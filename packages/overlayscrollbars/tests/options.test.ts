import { validate } from 'core/options';
import { defaultOptions, optionsTemplate } from 'options';

describe('options', () => {
  test('default options matching the options template', () => {
    const { validated } = validate(defaultOptions, optionsTemplate);
    expect(validated).toEqual(defaultOptions);
  });
});
