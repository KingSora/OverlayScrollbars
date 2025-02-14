import { vi, describe, test, beforeEach, expect } from 'vitest';
import { createTrinsicObserver } from '../../../src/observers';

describe('createTrinsicObserver', () => {
  beforeEach(() => {
    document.body.outerHTML = '';
  });

  test('trinsic observer', () => {
    const callback = vi.fn();
    const [construct, update] = createTrinsicObserver(document.body, callback);

    expect(construct).toEqual(expect.any(Function));
    expect(update).toEqual(expect.any(Function));

    expect(document.body.innerHTML).toBe('');

    const destroy = construct();
    expect(destroy).toEqual(expect.any(Function));

    expect(document.body.innerHTML).not.toBe('');

    destroy();

    expect(document.body.innerHTML).toBe('');
  });
});
