import { capitalizeFirstLetter } from '~/support/utils/strings';

describe('strings', () => {
  test('capitalizeFirstLetter', () => {
    expect(capitalizeFirstLetter('test')).toBe('Test');
    expect(capitalizeFirstLetter(null)).toBe('');
  });
});
