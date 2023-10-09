import { createTrinsicObserver } from '~/observers';

describe('createTrinsicObserver', () => {
  beforeEach(() => {
    document.body.outerHTML = '';
  });

  test('trinsic observer', () => {
    const callback = jest.fn();
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
