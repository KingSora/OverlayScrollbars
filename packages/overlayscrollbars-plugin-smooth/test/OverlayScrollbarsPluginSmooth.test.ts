import { describe, test, expect } from 'vitest';
import { hi } from '~/index';

describe('OverlayScrollbarsPluginSmooth', () => {
  test('default', () => {
    expect(hi).toBe('hi');
  });
});
