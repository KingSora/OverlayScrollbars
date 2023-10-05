import { defaultOptions } from '~/options';
import { getEnvironment } from '~/environment';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { OverlayScrollbars } from '~/overlayscrollbars';
import type { DeepPartial } from '~/typings';
import type { Options } from '~/options';
import type { Initialization } from '~/initialization';

jest.useFakeTimers();

jest.mock('~/support/compatibility/apis', () => {
  const originalModule = jest.requireActual('~/support/compatibility/apis');
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

describe('environment', () => {
  beforeEach(async () => {
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
      };
    });
    jest.doMock('~/plugins', () => {
      const originalModule = jest.requireActual('~/plugins');
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

  describe('addZoomListener', () => {
    test('with scrollbarsHidingPlugin registered before environment was created', async () => {
      const { registerPluginModuleInstances } = await import('~/plugins');
      registerPluginModuleInstances(ScrollbarsHidingPlugin, OverlayScrollbars);

      const { _addZoomListener } = getEnv();
      const listener = jest.fn();

      _addZoomListener(listener);
      window.dispatchEvent(new Event('resize'));

      jest.advanceTimersByTime(33);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('with scrollbarsHidingPlugin registered after environment was created', async () => {
      const { _addZoomListener } = getEnv();
      const listener = jest.fn();

      _addZoomListener(listener);

      const { registerPluginModuleInstances } = await import('~/plugins');
      registerPluginModuleInstances(ScrollbarsHidingPlugin, OverlayScrollbars);

      window.dispatchEvent(new Event('resize'));

      jest.advanceTimersByTime(33);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('without scrollbarsHidingPlugin', () => {
      const { _addZoomListener } = getEnv();
      const listener = jest.fn();

      _addZoomListener(listener);
      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(0);
    });
  });

  test('addResizeListener', () => {
    const { _addResizeListener } = getEnv();
    const listener = jest.fn();

    _addResizeListener(listener);
    window.dispatchEvent(new Event('resize'));

    expect(listener).not.toHaveBeenCalled();

    jest.advanceTimersByTime(33);

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
