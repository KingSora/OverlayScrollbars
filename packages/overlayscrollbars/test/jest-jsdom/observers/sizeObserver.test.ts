import { createSizeObserver as originalCreateSizeObserver } from '~/observers';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { sizeObserverPluginName } from '~/plugins';
import { SizeObserverPlugin } from '~/plugins';

let createSizeObserver = originalCreateSizeObserver;

const mockResizeObserverConstructor = async (value: any) => {
  jest.resetModules();
  jest.unmock('~/plugins');
  jest.doMock('~/support/compatibility/apis', () => ({
    ...jest.requireActual('~/support/compatibility/apis'),
    ResizeObserverConstructor: value,
  }));

  ({ createSizeObserver } = await import('~/observers'));
};

describe('createSizeObserver', () => {
  beforeEach(() => {
    mockResizeObserverConstructor(undefined);
    document.body.outerHTML = '';
  });

  describe('with ResizeObserver', () => {
    const mockResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    beforeEach(() => {
      mockResizeObserver.mockClear();
      mockResizeObserverConstructor(mockResizeObserver);
      document.body.outerHTML = '';
    });

    test('size observer', () => {
      const callback = jest.fn();
      const [destroy, append] = createSizeObserver(document.body, callback);

      expect(destroy).toEqual(expect.any(Function));
      expect(append).toEqual(expect.any(Function));

      expect(document.body.innerHTML).toBe('');

      expect(mockResizeObserver).not.toHaveBeenCalled();

      append();

      expect(mockResizeObserver).toHaveBeenCalledTimes(1);

      expect(document.body.innerHTML).not.toBe('');

      destroy();

      expect(document.body.innerHTML).toBe('');
    });
  });

  describe('with sizeObserverPlugin', () => {
    const mockSizeObserverPluginFn = jest.fn((...args) =>
      // @ts-ignore
      SizeObserverPlugin[sizeObserverPluginName].osStatic()(...args)
    );
    const mockSizeObserverPlugin: typeof SizeObserverPlugin = {
      [sizeObserverPluginName]: {
        osStatic: () => mockSizeObserverPluginFn,
      },
    };

    beforeEach(() => {
      mockResizeObserverConstructor(false);
      jest.doMock('~/plugins', () => {
        const originalModule = jest.requireActual('~/plugins');
        return { ...originalModule };
      });
      document.body.outerHTML = '';
    });

    test('size observer', async () => {
      const { registerPluginModuleInstances } = await import('~/plugins');
      registerPluginModuleInstances(mockSizeObserverPlugin, OverlayScrollbars);

      const callback = jest.fn();
      const [destroy, append] = createSizeObserver(document.body, callback);

      expect(destroy).toEqual(expect.any(Function));
      expect(append).toEqual(expect.any(Function));

      expect(document.body.innerHTML).toBe('');

      expect(mockSizeObserverPluginFn).not.toHaveBeenCalled();

      append();

      expect(mockSizeObserverPluginFn).toHaveBeenCalledTimes(1);

      expect(document.body.innerHTML).not.toBe('');

      destroy();

      expect(document.body.innerHTML).toBe('');
    });
  });

  describe('with neither', () => {
    test('size observer', () => {
      const callback = jest.fn();
      const [destroy, append] = createSizeObserver(document.body, callback);

      expect(destroy).toEqual(expect.any(Function));
      expect(append).toEqual(expect.any(Function));

      expect(document.body.innerHTML).toBe('');

      append();

      expect(document.body.innerHTML).toBe('');

      destroy();

      expect(document.body.innerHTML).toBe('');
    });
  });
});
