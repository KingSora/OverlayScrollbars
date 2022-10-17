import { createTrinsicObserver } from '~/observers';

describe('createTrinsicObserver', () => {
  beforeEach(() => {
    document.body.outerHTML = '';
  });

  test('trinsic observer', () => {
    const callback = jest.fn();
    const [destroy, append, update] = createTrinsicObserver(document.body, callback);

    expect(destroy).toEqual(expect.any(Function));
    expect(append).toEqual(expect.any(Function));
    expect(update).toEqual(expect.any(Function));

    expect(document.body.innerHTML).toBe('');

    append();

    expect(document.body.innerHTML).not.toBe('');

    destroy();

    expect(document.body.innerHTML).toBe('');
  });
});
