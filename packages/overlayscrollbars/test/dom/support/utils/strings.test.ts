import { describe, test, expect } from 'vitest';
import { capitalizeFirstLetter } from '../../../../src/support/utils/strings';

describe('strings', () => {
  test('capitalizeFirstLetter', () => {
    expect(capitalizeFirstLetter('test')).toBe('Test');
    expect(capitalizeFirstLetter(null)).toBe('');
  });
});
