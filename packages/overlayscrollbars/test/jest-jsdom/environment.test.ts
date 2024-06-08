import { defaultOptions } from '~/options';
import { getEnvironment } from '~/environment';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { OverlayScrollbars } from '~/overlayscrollbars';
import * as nonceM from '~/nonce';
import type { DeepPartial } from '~/typings';
import type { Options } from '~/options';
import type { Initialization } from '~/initialization';

jest.useFakeTimers();

jest.mock('~/support/utils/alias', () => {
  const originalModule = jest.requireActual('~/support/utils/alias');
  const mockRAF = (arg: any) => setTimeout(arg, 0);
  return {
    ...originalModule,
    // @ts-ignore
    rAF: jest.fn().mockImplementation((...args) => mockRAF(...args)),
    // @ts-ignore
    cAF: jest.fn().mockImplementation((...args) => clearTimeout(...args)),
    // @ts-ignore
    setT: jest.fn().mockImplementation((...args) => setTimeout(...args)),
    // @ts-ignore
    clearT: jest.fn().mockImplementation((...args) => clearTimeout(...args)),
  };
});

const defaultInitialization = {
  elements: {
    host: null,
    padding: true,
    viewport: expect.any(Function),
    content: false,
  },
  scrollbars: {
    slot: true,
  },
  cancel: {
    nativeScrollbarsOverlaid: false,
    body: null,
  },
};

let getEnv = getEnvironment;
let nonceModule = nonceM;

describe('environment', () => {
  beforeEach(async () => {
    document.body.innerHTML = '';
    jest.resetModules();
    jest.doMock('~/support', () => {
      const originalModule = jest.requireActual('~/support');
      let i = 0;
      return {
        ...originalModule,
        offsetSize: jest.fn().mockImplementation(() => {
          i += 1;
          return { w: 100 + i, h: 100 + i };
        }),
        clientSize: jest.fn().mockImplementation(() => ({ w: 90, h: 90 })),
        removeElements: jest.fn().mockImplementation(),
      };
    });
    jest.doMock('~/plugins', () => {
      const originalModule = jest.requireActual('~/plugins');
      return { ...originalModule };
    });
    jest.doMock('~/nonce', () => {
      const originalModule = jest.requireActual('~/nonce');
      nonceModule = originalModule;
      return { ...originalModule };
    });

    ({ getEnvironment: getEnv } = await import('~/environment'));
  });

  test('singleton behavior', () => {
    const env = getEnv();
    expect(env).toBe(getEnv());
  });

  describe('statics', () => {
    test('defaultOptions', () => {
      const { _staticDefaultOptions, _getDefaultOptions } = getEnv();
      expect(_staticDefaultOptions).not.toBe(defaultOptions);
      expect(_staticDefaultOptions).toEqual(defaultOptions);
      expect(_staticDefaultOptions).not.toBe(_getDefaultOptions());
      expect(_staticDefaultOptions).toEqual(_getDefaultOptions());
    });

    test('defaultInitialization', () => {
      const { _staticDefaultInitialization, _getDefaultInitialization } = getEnv();
      expect(_staticDefaultInitialization).not.toBe(defaultInitialization);
      expect(_staticDefaultInitialization).toEqual(defaultInitialization);
      expect(_staticDefaultInitialization).not.toBe(_getDefaultInitialization());
      expect(_staticDefaultInitialization).toEqual(_getDefaultInitialization());
    });
  });

  describe('defaultOptions', () => {
    test('get', () => {
      const { _getDefaultOptions } = getEnv();
      expect(_getDefaultOptions()).not.toBe(defaultOptions);
      expect(_getDefaultOptions()).toEqual(defaultOptions);
    });

    test('set', () => {
      const newDefaultOptions: DeepPartial<Options> = {
        paddingAbsolute: true,
        overflow: {
          x: 'hidden',
        },
      };
      const { _getDefaultOptions, _setDefaultOptions } = getEnv();
      expect(_getDefaultOptions()).not.toBe(defaultOptions);
      expect(_getDefaultOptions()).toEqual(defaultOptions);

      expect(_setDefaultOptions(newDefaultOptions)).toEqual(_getDefaultOptions());

      expect(_getDefaultOptions()).toEqual({
        ...defaultOptions,
        ...newDefaultOptions,
        overflow: {
          ...defaultOptions.overflow,
          ...newDefaultOptions.overflow,
        },
      });
    });
  });

  describe('defaultInitialization', () => {
    test('get', () => {
      const { _getDefaultInitialization } = getEnv();
      expect(_getDefaultInitialization()).not.toBe(defaultInitialization);
      expect(_getDefaultInitialization()).toEqual(defaultInitialization);
    });

    test('set', () => {
      const newDefaultInitialization: DeepPartial<Initialization> = {
        elements: {
          viewport: false,
          padding: false,
        },
        cancel: {
          body: true,
          nativeScrollbarsOverlaid: false,
        },
      };
      const { _getDefaultInitialization, _setDefaultInitialization } = getEnv();
      expect(_getDefaultInitialization()).not.toBe(defaultInitialization);
      expect(_getDefaultInitialization()).toEqual(defaultInitialization);

      expect(_setDefaultInitialization(newDefaultInitialization)).toEqual(
        _getDefaultInitialization()
      );

      expect(_getDefaultInitialization()).toEqual({
        ...defaultInitialization,
        ...newDefaultInitialization,
        elements: {
          ...defaultInitialization.elements,
          ...newDefaultInitialization.elements,
        },
        cancel: {
          ...defaultInitialization.cancel,
          ...newDefaultInitialization.cancel,
        },
      });
    });
  });

  describe('addResizeListener', () => {
    const createMockScrollbarsHidingPlugin = (
      original: typeof ScrollbarsHidingPlugin
    ): typeof ScrollbarsHidingPlugin => {
      return {
        __osScrollbarsHidingPlugin: {
          static: (...args) => {
            const originalResult = original.__osScrollbarsHidingPlugin.static(...args);
            return {
              ...originalResult,
            };
          },
        },
      };
    };

    test('without any plugin with native scrollbars hiding', () => {
      const { _addResizeListener } = getEnv();
      const listener = jest.fn();

      _addResizeListener(listener);

      expect(listener).not.toHaveBeenCalled();

      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('with scrollbarsHidingPlugin registered before environment was created', async () => {
      const { registerPluginModuleInstances } = await import('~/plugins');
      registerPluginModuleInstances(
        createMockScrollbarsHidingPlugin(ScrollbarsHidingPlugin),
        OverlayScrollbars
      );

      const { _addResizeListener } = getEnv();
      const listener = jest.fn();

      _addResizeListener(listener);
      expect(listener).not.toHaveBeenCalled();

      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('with scrollbarsHidingPlugin registered after environment was created', async () => {
      const { _addResizeListener } = getEnv();
      const listener = jest.fn();

      _addResizeListener(listener);

      const { registerPluginModuleInstances } = await import('~/plugins');
      registerPluginModuleInstances(
        createMockScrollbarsHidingPlugin(ScrollbarsHidingPlugin),
        OverlayScrollbars
      );

      expect(listener).not.toHaveBeenCalled();

      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('nonce', () => {
    test('without nonce', () => {
      getEnv();
      const styleTag = document.body.querySelector('style');
      expect(styleTag).toBeDefined();
      expect(styleTag?.getAttribute('nonce')).toBe(null);
      expect(styleTag?.nonce).toBeFalsy();
    });

    test('with nonce', () => {
      nonceModule.setNonce('my new nonce');
      getEnv();
      const styleTag = document.body.querySelector('style');
      expect(styleTag).toBeDefined();
      expect(styleTag?.getAttribute('nonce')).toBe('my new nonce');
      expect(styleTag?.nonce).toBe('my new nonce');
    });
  });
});
