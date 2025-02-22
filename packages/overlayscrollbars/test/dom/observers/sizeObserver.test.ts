import { vi, describe, test, beforeEach, expect } from 'vitest';
import { createSizeObserver as originalCreateSizeObserver } from '../../../src/observers';
import { OverlayScrollbars } from '../../../src/overlayscrollbars';
import { sizeObserverPluginName, SizeObserverPlugin } from '../../../src/plugins';

let createSizeObserver = originalCreateSizeObserver;

const mockResizeObserverConstructor = async (value: any) => {
  vi.resetModules();
  vi.unmock('../../../src/plugins');
  vi.doMock(import('../../../src/support/compatibility/apis'), async (importActual) => ({
    ...(await importActual()),
    ResizeObserverConstructor: value,
  }));

  ({ createSizeObserver } = await import('../../../src/observers'));
};

describe('createSizeObserver', () => {
  beforeEach(async () => {
    await mockResizeObserverConstructor(undefined);
    document.body.outerHTML = '';
  });

  describe('with ResizeObserver', () => {
    test('size observer with full resize observer', async () => {
      const ResizeObserverConstructorMock = vi.fn(() => ({
        observe: vi.fn((target, options) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const readTarget = target;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const readOptionsBox = options?.box;
        }),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }));

      await mockResizeObserverConstructor(ResizeObserverConstructorMock);

      const callback = vi.fn();
      const construct = createSizeObserver(document.body, callback);

      expect(construct).toEqual(expect.any(Function));
      expect(document.body.innerHTML).toBe('');
      expect(ResizeObserverConstructorMock).not.toHaveBeenCalled();

      const destroy = construct();

      expect(destroy).toEqual(expect.any(Function));
      expect(ResizeObserverConstructorMock).toHaveBeenCalledTimes(3); // 1. detect options.box support, 2. content-box observer, 3. border-box observer
      expect(document.body.innerHTML).toBe('');

      destroy();

      expect(document.body.innerHTML).toBe('');

      // check if detection runs a second time
      ResizeObserverConstructorMock.mockReset();
      construct();
      expect(ResizeObserverConstructorMock).toHaveBeenCalledTimes(2); // 1. content-box observer, 2. border-box observer
    });

    test('size observer with resize observer without options.box', async () => {
      const ResizeObserverConstructorMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }));

      await mockResizeObserverConstructor(ResizeObserverConstructorMock);

      const callback = vi.fn();
      const construct = createSizeObserver(document.body, callback);

      expect(construct).toEqual(expect.any(Function));
      expect(document.body.innerHTML).toBe('');
      expect(ResizeObserverConstructorMock).not.toHaveBeenCalled();

      const destroy = construct();

      expect(destroy).toEqual(expect.any(Function));
      expect(ResizeObserverConstructorMock).toHaveBeenCalledTimes(2); // 1. detect options.box support, 2. content-box observer
      expect(document.body.innerHTML).not.toBe('');

      destroy();

      expect(document.body.innerHTML).toBe('');

      // check if detection runs a second time
      ResizeObserverConstructorMock.mockReset();
      construct();
      expect(ResizeObserverConstructorMock).toHaveBeenCalledTimes(1); // now only for content-box observer
    });
  });

  describe('with sizeObserverPlugin', () => {
    const mockSizeObserverPluginFn = vi.fn((...args) =>
      SizeObserverPlugin[sizeObserverPluginName].static()(
        // @ts-ignore
        ...args
      )
    );
    const mockSizeObserverPlugin = {
      [sizeObserverPluginName]: {
        static: () => mockSizeObserverPluginFn,
      },
    } satisfies typeof SizeObserverPlugin;

    beforeEach(async () => {
      await mockResizeObserverConstructor(false);
      vi.doMock(import('../../../src/plugins'), async (importActual) => importActual());
    });

    test('size observer', async () => {
      const { registerPluginModuleInstances } = await import('../../../src/plugins');
      registerPluginModuleInstances(mockSizeObserverPlugin, OverlayScrollbars);

      const callback = vi.fn();
      const construct = createSizeObserver(document.body, callback);

      expect(construct).toEqual(expect.any(Function));
      expect(document.body.innerHTML).toBe('');
      expect(mockSizeObserverPluginFn).not.toHaveBeenCalled();

      const destroy = construct();

      expect(destroy).toEqual(expect.any(Function));
      expect(mockSizeObserverPluginFn).toHaveBeenCalledTimes(1);
      expect(document.body.innerHTML).not.toBe('');

      destroy();

      expect(document.body.innerHTML).toBe('');
    });
  });

  describe('with neither', () => {
    test('size observer', () => {
      const callback = vi.fn();
      const construct = createSizeObserver(document.body, callback);

      expect(construct).toEqual(expect.any(Function));
      expect(document.body.innerHTML).toBe('');

      const destroy = construct();

      expect(destroy).toEqual(expect.any(Function));
      expect(document.body.innerHTML).not.toBe('');

      destroy();

      expect(document.body.innerHTML).toBe('');
    });
  });
});
