import { vi, describe, test, beforeEach, expect } from 'vitest';
import type { DeepPartial } from '../../src/typings';
import type { Options } from '../../src/options';
import type { Initialization } from '../../src/initialization';
import { defaultOptions } from '../../src/options';
import { getEnvironment } from '../../src/environment';
import { ScrollbarsHidingPlugin } from '../../src/plugins';
import { OverlayScrollbars } from '../../src/overlayscrollbars';

vi.useFakeTimers();

const defaultInitialization = {
  elements: {
    host: null,
    padding: expect.any(Boolean),
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

describe('environment', () => {
  beforeEach(async () => {
    document.body.innerHTML = '';
  });

  test('singleton behavior', () => {
    const env = getEnvironment();
    expect(env).toBe(getEnvironment());
  });

  describe('statics', () => {
    test('defaultOptions', () => {
      const { _staticDefaultOptions, _getDefaultOptions } = getEnvironment();
      expect(_staticDefaultOptions).not.toBe(defaultOptions);
      expect(_staticDefaultOptions).toEqual(defaultOptions);
      expect(_staticDefaultOptions).not.toBe(_getDefaultOptions());
      expect(_staticDefaultOptions).toEqual(_getDefaultOptions());
    });

    test('defaultInitialization', () => {
      const { _staticDefaultInitialization, _getDefaultInitialization } = getEnvironment();
      expect(_staticDefaultInitialization).not.toBe(defaultInitialization);
      expect(_staticDefaultInitialization).toEqual(defaultInitialization);
      expect(_staticDefaultInitialization).not.toBe(_getDefaultInitialization());
      expect(_staticDefaultInitialization).toEqual(_getDefaultInitialization());
    });
  });

  describe('defaultOptions', () => {
    test('get', () => {
      const { _getDefaultOptions } = getEnvironment();
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
      const { _getDefaultOptions, _setDefaultOptions } = getEnvironment();
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
      const { _getDefaultInitialization } = getEnvironment();
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
      const { _getDefaultInitialization, _setDefaultInitialization } = getEnvironment();
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
      const { _addResizeListener } = getEnvironment();
      const listener = vi.fn();

      _addResizeListener(listener);

      expect(listener).not.toHaveBeenCalled();

      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('with scrollbarsHidingPlugin registered before environment was created', async () => {
      const { registerPluginModuleInstances } = await import('../../src/plugins');
      registerPluginModuleInstances(
        createMockScrollbarsHidingPlugin(ScrollbarsHidingPlugin),
        OverlayScrollbars
      );

      const { _addResizeListener } = getEnvironment();
      const listener = vi.fn();

      _addResizeListener(listener);
      expect(listener).not.toHaveBeenCalled();

      window.dispatchEvent(new Event('resize'));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('with scrollbarsHidingPlugin registered after environment was created', async () => {
      const { _addResizeListener } = getEnvironment();
      const listener = vi.fn();

      _addResizeListener(listener);

      const { registerPluginModuleInstances } = await import('../../src/plugins');
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
    let environmentModule: typeof import('../../src/environment');
    let nonceModule: typeof import('../../src/nonce');

    beforeEach(async () => {
      vi.resetModules();
      vi.doMock(import('../../src/support'), async (importActual) => {
        const actualModule = await importActual();
        return {
          ...actualModule,
          removeElements: vi.fn().mockImplementation(() => {}),
        };
      });

      environmentModule = await import('../../src/environment');
      nonceModule = await import('../../src/nonce');
    });

    test('without nonce', () => {
      environmentModule.getEnvironment();
      const styleTag = document.body.querySelector('style');
      expect(styleTag).toBeDefined();
      expect(styleTag?.getAttribute('nonce')).toBe(null);
      expect(styleTag?.nonce).toBeFalsy();
    });

    test('with nonce', () => {
      nonceModule.setNonce('my new nonce');
      environmentModule.getEnvironment();
      const styleTag = document.body.querySelector('style');
      expect(styleTag).toBeDefined();
      expect(styleTag?.getAttribute('nonce')).toBe('my new nonce');
      expect(styleTag?.nonce).toBe('my new nonce');
    });
  });
});
