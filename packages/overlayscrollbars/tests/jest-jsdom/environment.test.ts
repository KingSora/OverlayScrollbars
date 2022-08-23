import { DeepPartial } from 'typings';
import { defaultOptions, Options } from 'options';
import { Initialization } from 'initialization';
import { getEnvironment } from 'environment';
import { scrollbarsHidingPlugin, scrollbarsHidingPluginName } from 'plugins';

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
    jest.doMock('support', () => {
      const originalModule = jest.requireActual('support');
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
    jest.doMock('plugins', () => {
      const originalModule = jest.requireActual('plugins');
      return {
        ...originalModule,
        getPlugins: jest.fn(() => originalModule.getPlugins()),
      };
    });

    ({ getEnvironment: getEnv } = await import('environment'));
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

      _setDefaultOptions(newDefaultOptions);

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

      _setDefaultInitialization(newDefaultInitialization);

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

  describe('addListener', () => {
    test('with scrollbarsHidingPlugin registered before environment was created', async () => {
      const { getPlugins } = await import('plugins');
      (getPlugins as jest.Mock).mockImplementation(() => ({
        [scrollbarsHidingPluginName]: scrollbarsHidingPlugin[scrollbarsHidingPluginName],
      }));

      const { _addListener } = getEnv();
      const listener = jest.fn();

      _addListener(listener);
      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('with scrollbarsHidingPlugin registered after environment was created', async () => {
      const { _addListener } = getEnv();
      const listener = jest.fn();

      _addListener(listener);

      const { getPlugins } = await import('plugins');
      (getPlugins as jest.Mock).mockImplementation(() => ({
        [scrollbarsHidingPluginName]: scrollbarsHidingPlugin[scrollbarsHidingPluginName],
      }));

      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('without scrollbarsHidingPlugin', () => {
      const { _addListener } = getEnv();
      const listener = jest.fn();

      _addListener(listener);
      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(0);
    });
  });
});
