import { describe, test, expect } from 'vitest';
import { hi } from '~/overlayscrollbars-plugin-smooth';

describe('OverlayScrollbarsPluginSmooth', () => {
  test('default', () => {
    expect(hi).toBe('hi');
  });
});
