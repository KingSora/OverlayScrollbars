import { describe, test, expect } from 'vitest';
import { getTrustedTypePolicy, setTrustedTypePolicy } from '../../src/trustedTypePolicy';

describe('trustedTypePolicy', () => {
  test('trustedTypePolicy', () => {
    expect(getTrustedTypePolicy()).toBe(undefined);

    setTrustedTypePolicy('123');
    expect(getTrustedTypePolicy()).toBe('123');

    setTrustedTypePolicy(undefined);
    expect(getTrustedTypePolicy()).toBe(undefined);
  });
});
