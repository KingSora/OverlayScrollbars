import { getNonce, setNonce } from '~/nonce';

describe('nonce', () => {
  test('nonce', () => {
    expect(getNonce()).toBe(undefined);

    setNonce('123');
    expect(getNonce()).toBe('123');

    setNonce(undefined);
    expect(getNonce()).toBe(undefined);
  });
});
