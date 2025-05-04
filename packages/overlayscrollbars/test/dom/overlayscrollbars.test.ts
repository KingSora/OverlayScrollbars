import { vi, describe, test, beforeEach, afterEach, expect } from 'vitest';
import type { Plugin } from '../../src/plugins';
import type { PartialOptions } from '../../src/options';
import { defaultOptions } from '../../src/options';
import { assignDeep, noop } from '../../src/support';
import {
  ClickScrollPlugin,
  OptionsValidationPlugin,
  ScrollbarsHidingPlugin,
  SizeObserverPlugin,
} from '../../src/plugins';

vi.useFakeTimers();

const bodyElm = document.body;
const div = document.createElement('div');
const div2 = document.createElement('div');
const div3 = document.createElement('div');

bodyElm.append(div);
bodyElm.append(div2);

describe('overlayscrollbars', () => {
  let OverlayScrollbars: Awaited<typeof import('../../src/overlayscrollbars')>['OverlayScrollbars'];

  beforeEach(async () => {
    vi.resetModules();
    ({ OverlayScrollbars } = await import('../../src/overlayscrollbars'));
  });

  afterEach(() => {
    const instance = OverlayScrollbars(div);
    if (OverlayScrollbars.valid(instance)) {
      instance.destroy();
    }
  });

  describe('instance', () => {
    describe('initialization', () => {
      describe('initialization completed', () => {
        [div, { target: div }].forEach((init) => {
          describe(`as ${init === div ? 'element' : 'object'}`, () => {
            test('without options', () => {
              const osInstance = OverlayScrollbars(init);

              expect(OverlayScrollbars.valid(osInstance)).toBe(false);
              expect(div.children.length).toBe(0);
            });

            test('with empty options', () => {
              const osInstance = OverlayScrollbars(init, {});

              expect(OverlayScrollbars.valid(osInstance)).toBe(true);
              expect(div.children.length).not.toBe(0);

              expect(osInstance.options()).not.toBe(defaultOptions);
              expect(osInstance.options()).toEqual(defaultOptions);
            });

            test('with custom options', () => {
              const customOptions: PartialOptions = {
                paddingAbsolute: false,
                showNativeOverlaidScrollbars: true,
                overflow: {
                  x: 'hidden',
                },
                update: {
                  ignoreMutation: () => true,
                  elementEvents: null,
                },
                scrollbars: {
                  pointers: null,
                  autoHideDelay: 0,
                },
              };
              const osInstance = OverlayScrollbars(init, customOptions);

              expect(OverlayScrollbars.valid(osInstance)).toBe(true);
              expect(div.children.length).not.toBe(0);

              expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions, customOptions));
            });

            test('with event listeners', () => {
              const initialized = vi.fn();
              const updated = vi.fn();
              const destroyed = vi.fn();
              const osInstance = OverlayScrollbars(
                init,
                {},
                {
                  initialized,
                  updated,
                  destroyed,
                }
              );

              expect(OverlayScrollbars.valid(osInstance)).toBe(true);
              expect(div.children.length).not.toBe(0);

              expect(initialized).toHaveBeenCalledTimes(1);
              expect(initialized).toHaveBeenCalledWith(osInstance);

              expect(updated).toHaveBeenCalledTimes(1);
              expect(updated).toHaveBeenCalledWith(osInstance, expect.any(Object));

              expect(destroyed).not.toHaveBeenCalled();

              osInstance.destroy();

              expect(destroyed).toHaveBeenCalledTimes(1);
              expect(destroyed).toHaveBeenCalledWith(osInstance, false);
            });
          });
        });
      });

      describe('initialization canceled', () => {
        test('without options', () => {
          const osInstance = OverlayScrollbars({
            target: div,
            cancel: { nativeScrollbarsOverlaid: true },
          });

          expect(OverlayScrollbars.valid(osInstance)).toBe(false);
          expect(div.children.length).toBe(0);
        });

        test('with empty options', () => {
          const osInstance = OverlayScrollbars(
            {
              target: div,
              cancel: { nativeScrollbarsOverlaid: true },
            },
            {}
          );

          expect(OverlayScrollbars.valid(osInstance)).toBe(false);
          expect(div.children.length).toBe(0);
        });

        test('with event listeners', () => {
          const initialized = vi.fn();
          const updated = vi.fn();
          const destroyed = vi.fn();
          const osInstance = OverlayScrollbars(
            {
              target: div,
              cancel: { nativeScrollbarsOverlaid: true },
            },
            {},
            {
              initialized,
              updated,
              destroyed,
            }
          );

          expect(OverlayScrollbars.valid(osInstance)).toBe(false);
          expect(div.children.length).toBe(0);

          expect(initialized).not.toHaveBeenCalled();
          expect(updated).not.toHaveBeenCalled();
          expect(destroyed).toHaveBeenCalledTimes(1);
          expect(destroyed).toHaveBeenCalledWith(osInstance, true);
        });
      });
    });

    describe('elements', () => {
      test('get elements', () => {
        const osInstance = OverlayScrollbars(div, {});
        const elements = osInstance.elements();
        const elementsObj = {
          target: div,
          host: div,
          padding: expect.any(HTMLElement),
          viewport: expect.any(HTMLElement),
          content: expect.any(HTMLElement),
          scrollOffsetElement: expect.any(HTMLElement),
          scrollEventElement: expect.any(HTMLElement),
          scrollbarHorizontal: {
            scrollbar: expect.any(HTMLElement),
            track: expect.any(HTMLElement),
            handle: expect.any(HTMLElement),
            clone: expect.any(Function),
          },
          scrollbarVertical: {
            scrollbar: expect.any(HTMLElement),
            track: expect.any(HTMLElement),
            handle: expect.any(HTMLElement),
            clone: expect.any(Function),
          },
        };

        expect(elements).not.toBe(osInstance.elements());
        // clone function identity is always different
        expect(
          assignDeep({}, elements, {
            scrollbarHorizontal: {
              clone: null,
            },
            scrollbarVertical: {
              clone: null,
            },
          })
        ).toEqual(
          assignDeep({}, osInstance.elements(), {
            scrollbarHorizontal: {
              clone: null,
            },
            scrollbarVertical: {
              clone: null,
            },
          })
        );
        expect(elements).toEqual(elementsObj);

        osInstance.destroy();

        expect(elements).toEqual(elementsObj);
      });

      test('clone scrollbars', () => {
        const osInstance = OverlayScrollbars(div, {});
        const elements = osInstance.elements();

        const hClone = elements.scrollbarHorizontal.clone();
        const vClone = elements.scrollbarVertical.clone();

        expect(hClone).toEqual({
          scrollbar: expect.any(HTMLElement),
          track: expect.any(HTMLElement),
          handle: expect.any(HTMLElement),
        });
        expect(vClone).toEqual({
          scrollbar: expect.any(HTMLElement),
          track: expect.any(HTMLElement),
          handle: expect.any(HTMLElement),
        });

        div.append(hClone.scrollbar);
        div.append(vClone.scrollbar);

        osInstance.destroy();

        expect(div.innerHTML).toBe('');
      });
    });

    describe('options', () => {
      [false, true].forEach((withValidationPlugin) => {
        describe(`${withValidationPlugin ? 'with' : 'without'} optionsValidationPlugin`, () => {
          beforeEach(() => {
            if (withValidationPlugin) {
              OverlayScrollbars.plugin(OptionsValidationPlugin);
            }
          });

          test('equality', () => {
            const osInstance = OverlayScrollbars(div, {});
            expect(osInstance.options()).not.toBe(defaultOptions);
            expect(osInstance.options()).toEqual(defaultOptions);
            OverlayScrollbars(div)!.destroy();
          });

          test('initial options', () => {
            const customOptions: PartialOptions = {
              paddingAbsolute: !defaultOptions.paddingAbsolute,
              overflow: { x: 'hidden' },
            };

            const osInstance = OverlayScrollbars(div, customOptions);
            expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions, customOptions));
          });

          test('changed options', () => {
            const customOptions: PartialOptions = {
              paddingAbsolute: !defaultOptions.paddingAbsolute,
              overflow: { x: 'hidden' },
            };
            const customOptions2: PartialOptions = {
              overflow: { y: 'hidden' },
            };

            const osInstance = OverlayScrollbars(div, {});
            expect(osInstance.options(customOptions)).toEqual(
              assignDeep({}, defaultOptions, customOptions)
            );
            expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions, customOptions));
            expect(osInstance.options(customOptions2)).toEqual(
              assignDeep({}, defaultOptions, customOptions, customOptions2)
            );
            expect(osInstance.options()).toEqual(
              assignDeep({}, defaultOptions, customOptions, customOptions2)
            );
            osInstance.destroy();
          });

          test('changed options pure', () => {
            const customOptions: PartialOptions = {
              paddingAbsolute: !defaultOptions.paddingAbsolute,
              overflow: { x: 'hidden' },
            };
            const customOptions2: PartialOptions = {
              overflow: { y: 'hidden' },
            };

            const osInstance = OverlayScrollbars(div, {});
            expect(osInstance.options(customOptions, true)).toEqual(
              assignDeep({}, defaultOptions, customOptions)
            );
            expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions, customOptions));
            expect(osInstance.options(customOptions2, true)).toEqual(
              assignDeep({}, defaultOptions, customOptions2)
            );
            expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions, customOptions2));
            osInstance.destroy();
          });

          test('unchanged wont trigger update', () => {
            const updated = vi.fn();
            const initialOpts: PartialOptions = {
              paddingAbsolute: true,
              overflow: {
                y: 'hidden',
              },
            };
            const osInstance = OverlayScrollbars(div, initialOpts, {
              updated,
            });
            expect(updated).toHaveBeenCalledTimes(1);
            osInstance.options(initialOpts);
            osInstance.options(initialOpts);
            osInstance.options({});
            osInstance.options({});
            expect(updated).toHaveBeenCalledTimes(1);
            osInstance.options(initialOpts, true);
            osInstance.options(initialOpts, true);
            expect(updated).toHaveBeenCalledTimes(1);

            osInstance.options({}, true);
            osInstance.options({}, true);
            expect(updated).toHaveBeenCalledTimes(2);
            osInstance.options(defaultOptions, true);
            osInstance.options(defaultOptions, true);
            expect(updated).toHaveBeenCalledTimes(2);

            osInstance.options(initialOpts);
            osInstance.options(initialOpts);
            expect(updated).toHaveBeenCalledTimes(3);
            osInstance.options(defaultOptions);
            osInstance.options(defaultOptions);
            expect(updated).toHaveBeenCalledTimes(4);

            osInstance.options(initialOpts, true);
            osInstance.options(initialOpts, true);
            expect(updated).toHaveBeenCalledTimes(5);
            osInstance.options(defaultOptions, true);
            osInstance.options(defaultOptions, true);
            expect(updated).toHaveBeenCalledTimes(6);
          });

          test('undefined values are ignored for initial options', () => {
            const initialOpts: PartialOptions = {
              paddingAbsolute: undefined,
              overflow: undefined,
            };
            const osInstance = OverlayScrollbars(div, initialOpts);
            expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions));
          });

          test('undefined values are ignored when changing options', () => {
            const initialOpts: PartialOptions = {
              paddingAbsolute: true,
              overflow: {
                y: 'hidden',
              },
            };
            const osInstance = OverlayScrollbars(div, initialOpts);
            osInstance.options({
              paddingAbsolute: undefined,
              overflow: undefined,
            });
            expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions, initialOpts));
          });
        });
      });
    });

    test('on', () => {
      const onInitialized = vi.fn();
      const onUpdated = vi.fn();
      const onUpdated2 = vi.fn();
      const onDestroyed = vi.fn();
      const onScroll = vi.fn();
      const osInstance = OverlayScrollbars(div, {});

      osInstance.on('initialized', onInitialized);
      osInstance.on('updated', [onUpdated, onUpdated, onUpdated2]);
      osInstance.on('destroyed', onDestroyed);
      osInstance.on('scroll', onScroll);

      expect(onInitialized).not.toHaveBeenCalled();

      expect(onUpdated).not.toHaveBeenCalled();
      expect(onUpdated2).not.toHaveBeenCalled();

      expect(onScroll).not.toHaveBeenCalled();

      osInstance.elements().scrollEventElement.dispatchEvent(new Event('scroll'));
      expect(onScroll).toHaveBeenCalledTimes(1);
      expect(onScroll).toHaveBeenLastCalledWith(osInstance, expect.any(Object));

      osInstance.update();
      expect(onUpdated).not.toHaveBeenCalled();
      expect(onUpdated2).not.toHaveBeenCalled();

      osInstance.update(true);
      expect(onUpdated).toHaveBeenCalledTimes(1);
      expect(onUpdated2).toHaveBeenCalledTimes(1);
      expect(onUpdated).toHaveBeenLastCalledWith(osInstance, expect.any(Object));
      expect(onUpdated2).toHaveBeenLastCalledWith(osInstance, expect.any(Object));

      expect(onDestroyed).not.toHaveBeenCalled();
      OverlayScrollbars(div)!.destroy();
      expect(onDestroyed).toHaveBeenCalledTimes(1);
      expect(onDestroyed).toHaveBeenLastCalledWith(osInstance, false);

      // after destruction no further events are triggered
      osInstance.update(true);
      osInstance.elements().scrollEventElement.dispatchEvent(new Event('scroll'));
      expect(onUpdated).toHaveBeenCalledTimes(1);
      expect(onUpdated2).toHaveBeenCalledTimes(1);
      expect(onScroll).toHaveBeenCalledTimes(1);
    });

    test('off', () => {
      const onInitialized = vi.fn();
      const onUpdated = vi.fn();
      const onUpdated2 = vi.fn();
      const onDestroyed = vi.fn();
      const onScroll = vi.fn();

      expect(onInitialized).not.toHaveBeenCalled();
      const osInstance = OverlayScrollbars(
        div,
        {},
        {
          initialized: onInitialized,
          updated: [onUpdated, onUpdated, onUpdated2],
          destroyed: onDestroyed,
          scroll: onScroll,
        }
      );

      expect(onInitialized).toHaveBeenCalledTimes(1);
      expect(onInitialized).toHaveBeenLastCalledWith(osInstance);

      expect(onUpdated).toHaveBeenCalledTimes(1);
      expect(onUpdated2).toHaveBeenCalledTimes(1);

      expect(onScroll).not.toHaveBeenCalled();
      osInstance.elements().scrollEventElement.dispatchEvent(new Event('scroll'));
      expect(onUpdated).toHaveBeenCalledTimes(1);

      osInstance.off('scroll', onScroll);
      osInstance.elements().scrollEventElement.dispatchEvent(new Event('scroll'));
      expect(onUpdated).toHaveBeenCalledTimes(1);

      osInstance.update(true);

      expect(onUpdated).toHaveBeenCalledTimes(2);
      expect(onUpdated2).toHaveBeenCalledTimes(2);

      osInstance.off('updated', onUpdated2);
      osInstance.update(true);
      expect(onUpdated).toHaveBeenCalledTimes(3);
      expect(onUpdated2).toHaveBeenCalledTimes(2);

      osInstance.on('updated', onUpdated2);
      osInstance.update(true);
      expect(onUpdated).toHaveBeenCalledTimes(4);
      expect(onUpdated2).toHaveBeenCalledTimes(3);

      osInstance.off('updated', [onUpdated, onUpdated2]);
      osInstance.update(true);
      expect(onUpdated).toHaveBeenCalledTimes(4);
      expect(onUpdated2).toHaveBeenCalledTimes(3);

      osInstance.off('destroyed', onDestroyed);
      expect(onDestroyed).not.toHaveBeenCalled();
      osInstance.destroy();
      expect(onDestroyed).not.toHaveBeenCalled();
    });

    test('state', () => {
      const osInstance = OverlayScrollbars(div, {});
      const state = osInstance.state();
      const stateObj = {
        overflowEdge: { x: 0, y: 0 },
        overflowAmount: { x: 0, y: 0 },
        overflowStyle: { x: 'hidden', y: 'hidden' },
        hasOverflow: { x: false, y: false },
        padding: { t: 0, r: 0, b: 0, l: 0 },
        paddingAbsolute: false,
        directionRTL: false,
        destroyed: false,
        scrollCoordinates: {
          start: {
            x: 0,
            y: 0,
          },
          end: {
            x: 0,
            y: 0,
          },
        },
      };

      expect(state).not.toBe(osInstance.state());
      expect(state).toEqual(osInstance.state());
      expect(state).toEqual(stateObj);

      osInstance.options({ paddingAbsolute: true });
      expect(osInstance.state()).toEqual(
        expect.objectContaining({
          paddingAbsolute: true,
        })
      );

      osInstance.destroy();
      expect(osInstance.state()).toEqual(
        expect.objectContaining({
          destroyed: true,
        })
      );
    });

    test('update', () => {
      const osInstance = OverlayScrollbars(div, {});
      expect(osInstance.update()).toBe(false);
      expect(osInstance.update(false)).toBe(false);
      expect(osInstance.update(true)).toBe(true);

      // host mutation
      div.style.cursor = 'pointer';
      expect(osInstance.update()).toBe(true);
    });

    describe('environment resize listener', () => {
      test('without overflow', () => {
        const updated = vi.fn();
        OverlayScrollbars(
          div,
          {},
          {
            updated,
          }
        );

        expect(updated).toHaveBeenCalledTimes(1);

        window.dispatchEvent(new Event('resize'));

        expect(updated).toHaveBeenCalledTimes(1);

        vi.runAllTimers();

        expect(updated).toHaveBeenCalledTimes(1);
      });

      test('with overflow', () => {
        const updated = vi.fn();
        const instance = OverlayScrollbars(div, {});

        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
          configurable: true,
          get: function () {
            return this._scrollHeight || 0;
          },
          set(val) {
            this._scrollHeight = val;
          },
        });

        Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
          configurable: true,
          get: function () {
            return this._clientHeight || 0;
          },
          set(val) {
            this._clientHeight = val;
          },
        });

        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
          configurable: true,
          get: function () {
            return this._offsetHeight || 0;
          },
          set(val) {
            this._offsetHeight = val;
          },
        });

        // @ts-ignore
        instance.elements().viewport.scrollHeight = 300;
        // @ts-ignore
        instance.elements().viewport.clientHeight = 100;
        // @ts-ignore
        instance.elements().viewport.offsetHeight = 100;

        instance.update(true);
        instance.on('updated', updated);

        expect(updated).toHaveBeenCalledTimes(0);

        window.dispatchEvent(new Event('resize'));
        expect(updated).toHaveBeenCalledTimes(1);

        window.dispatchEvent(new Event('resize'));
        expect(updated).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);

        window.dispatchEvent(new Event('resize'));
        expect(updated).toHaveBeenCalledTimes(1);

        window.dispatchEvent(new Event('resize'));
        expect(updated).toHaveBeenCalledTimes(1);

        vi.runAllTimers();

        expect(updated).toHaveBeenCalledTimes(2); // should be 2 if something changes
      });
    });
  });

  describe('static', () => {
    test('plugin', () => {
      expect(OverlayScrollbars.plugin).toEqual(expect.any(Function));
    });

    test('env', () => {
      const env = OverlayScrollbars.env();
      const envObj = {
        scrollbarsSize: { x: expect.any(Number), y: expect.any(Number) },
        scrollbarsOverlaid: { x: expect.any(Boolean), y: expect.any(Boolean) },
        scrollbarsHiding: expect.any(Boolean),
        scrollTimeline: expect.any(Boolean),
        staticDefaultInitialization: expect.any(Object),
        staticDefaultOptions: expect.any(Object),
        getDefaultInitialization: expect.any(Function),
        setDefaultInitialization: expect.any(Function),
        getDefaultOptions: expect.any(Function),
        setDefaultOptions: expect.any(Function),
      };
      expect(env).not.toBe(OverlayScrollbars.env());
      expect(env).toEqual(OverlayScrollbars.env());
      expect(env).toEqual(envObj);
    });

    describe('nonce', () => {
      beforeEach(async () => {
        document.body.innerHTML = '';

        vi.resetModules();
        vi.doMock(import('../../src/support'), async (importActual) => {
          const actualModule = await importActual();
          return {
            ...actualModule,
            removeElements: vi.fn().mockImplementation(() => {}),
          };
        });
      });

      test('without nonce', () => {
        OverlayScrollbars.env();

        expect(document.body.querySelector('style')?.nonce).toBeFalsy();
      });

      test('with nonce', () => {
        OverlayScrollbars.nonce('abc');
        OverlayScrollbars.env();

        expect(document.body.querySelector('style')?.nonce).toBe('abc');
      });
    });

    describe('trustedTypePolicy', () => {
      beforeEach(async () => {
        document.body.innerHTML = '';

        vi.resetModules();
        vi.doMock(import('../../src/support'), async (importActual) => {
          const actualModule = await importActual();
          return {
            ...actualModule,
            removeElements: vi.fn().mockImplementation(() => {}),
          };
        });
      });

      test('with trustedTypePolicy', () => {
        const trustedTypeCreateHtmlFn = vi.fn();
        OverlayScrollbars.trustedTypePolicy({
          createHTML: (html: string) => {
            trustedTypeCreateHtmlFn();
            return html;
          },
        });
        OverlayScrollbars.env();

        expect(trustedTypeCreateHtmlFn).toBeCalled();
      });
    });

    test('valid', () => {
      expect(OverlayScrollbars.valid(true)).toBe(false);
      expect(OverlayScrollbars.valid(false)).toBe(false);
      expect(OverlayScrollbars.valid('')).toBe(false);
      expect(OverlayScrollbars.valid(123)).toBe(false);
      expect(OverlayScrollbars.valid({})).toBe(false);
      expect(OverlayScrollbars.valid(div)).toBe(false);
      expect(OverlayScrollbars.valid(setTimeout)).toBe(false);

      expect(OverlayScrollbars.valid(OverlayScrollbars(div))).toBe(false);

      const osInstance = OverlayScrollbars(div, {});
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);

      osInstance.destroy();
      expect(OverlayScrollbars.valid(osInstance)).toBe(false);
    });
  });

  test('plugin', () => {
    const osStaticPlugin = vi.fn();
    const osInstancePlugin = vi.fn();
    const osInstancePluginInitializedEvent = vi.fn();
    const osInstancePluginDestroyedEvent = vi.fn();
    const staticObjPluginFn = vi.fn();
    const staticObjPluginFn2 = vi.fn();
    const instanceObjPluginFn = vi.fn();

    expect(osStaticPlugin).not.toHaveBeenCalled();
    expect(osInstancePlugin).not.toHaveBeenCalled();

    const neverPlugin = {} satisfies Plugin;
    const emptyPlugin = { hi: {} } satisfies Plugin;

    const dummyPlugin = {
      dummyPlugin: {
        static: (staticObj) => {
          let count = 0;
          expect(staticObj).toBe(OverlayScrollbars);
          osStaticPlugin();
          return {
            dummyPluginStaticInstance: 'dummyPluginStatic',
            getCount: () => count,
            increment: () => {
              count++;
            },
          };
        },
        instance: (instanceObj, event, staticObj) => {
          let count = 0;
          expect(OverlayScrollbars.valid(instanceObj)).toBe(true);
          expect(staticObj).toBe(OverlayScrollbars);
          osInstancePlugin();

          event('initialized', osInstancePluginInitializedEvent);
          event('destroyed', osInstancePluginDestroyedEvent);

          return {
            dummyPluginInstanceInstance: 'dummyPluginInstance',
            getCount: () => count,
            increment: () => {
              count++;
            },
          };
        },
      },
    } satisfies Plugin;

    const dummyPlugin2 = {
      dummyPlugin2: {
        static: (staticObj) => {
          // @ts-ignore
          staticObj.staticObjPluginFn = staticObjPluginFn;
          return { dummyPlugin2StaticInstance: 2 as const };
        },
        instance: (instanceObj, event, staticObj) => {
          event('destroyed', osInstancePluginDestroyedEvent);

          // @ts-ignore
          instanceObj.instanceObjPluginFn = instanceObjPluginFn;
          // @ts-ignore
          staticObj.staticObjPluginFn2 = staticObjPluginFn2;
        },
      },
    } satisfies Plugin;

    expect(OverlayScrollbars.plugin(neverPlugin)).toEqual(undefined);
    expect(OverlayScrollbars.plugin(emptyPlugin)).toEqual(undefined);
    const plugins = OverlayScrollbars.plugin([neverPlugin, emptyPlugin, dummyPlugin, dummyPlugin2]);
    const [
      neverPluginInstance,
      emptyPluginInstance,
      dummyPluginStaticInstance,
      dummyPlugin2StaticInstance,
    ] = plugins;

    expect(plugins).toHaveLength(4);
    expect(emptyPluginInstance).toBe(undefined);
    expect(neverPluginInstance).toBe(undefined);
    expect(dummyPluginStaticInstance.dummyPluginStaticInstance).toBe('dummyPluginStatic');
    expect(dummyPluginStaticInstance.getCount()).toBe(0);
    expect(typeof dummyPluginStaticInstance.increment).toBe('function');
    dummyPluginStaticInstance.increment();
    expect(dummyPluginStaticInstance.getCount()).toBe(1);
    expect(dummyPlugin2StaticInstance.dummyPlugin2StaticInstance).toBe(2);
    expect(osStaticPlugin).toHaveBeenCalledTimes(1);

    // staticObj plugin must be available before any initialization
    expect(staticObjPluginFn).not.toHaveBeenCalled();
    // @ts-ignore
    OverlayScrollbars.staticObjPluginFn();
    expect(staticObjPluginFn).toHaveBeenCalledTimes(1);

    expect(osInstancePlugin).not.toHaveBeenCalled();
    expect(osInstancePluginInitializedEvent).not.toHaveBeenCalled();
    const osInstance = OverlayScrollbars(div, {});
    expect(osInstancePlugin).toHaveBeenCalledTimes(1);
    expect(osInstancePluginInitializedEvent).toHaveBeenCalledTimes(1);
    const osInstance2 = OverlayScrollbars(div2, {});
    expect(osInstancePlugin).toHaveBeenCalledTimes(2);
    expect(osInstancePluginInitializedEvent).toHaveBeenCalledTimes(2);

    expect(instanceObjPluginFn).not.toHaveBeenCalled();
    expect(instanceObjPluginFn).not.toHaveBeenCalled();
    // @ts-ignore
    osInstance.instanceObjPluginFn();
    expect(instanceObjPluginFn).toHaveBeenCalledTimes(1);
    // @ts-ignore
    osInstance2.instanceObjPluginFn();
    expect(instanceObjPluginFn).toHaveBeenCalledTimes(2);
    // @ts-ignore
    expect(osInstance.plugin(emptyPlugin)).not.toBeDefined();
    // @ts-ignore
    expect(osInstance2.plugin(emptyPlugin)).not.toBeDefined();

    const checkInstancePluginInstance = (
      pluginInstance: ReturnType<typeof osInstance.plugin<typeof dummyPlugin>>
    ) => {
      expect(pluginInstance).toBeDefined();
      expect(pluginInstance?.dummyPluginInstanceInstance).toBe('dummyPluginInstance');
      expect(pluginInstance?.getCount()).toBe(0);
      expect(typeof pluginInstance?.increment).toBe('function');

      pluginInstance?.increment();

      expect(pluginInstance?.getCount()).toBe(1);

      expect(osInstance.plugin(dummyPlugin2)).not.toBeDefined();
    };

    checkInstancePluginInstance(osInstance.plugin(dummyPlugin));
    checkInstancePluginInstance(osInstance2.plugin(dummyPlugin));

    expect(osStaticPlugin).toHaveBeenCalledTimes(1);
    expect(osInstancePlugin).toHaveBeenCalledTimes(2);

    OverlayScrollbars(div3, {});

    expect(osStaticPlugin).toHaveBeenCalledTimes(1);
    expect(osInstancePlugin).toHaveBeenCalledTimes(3);

    osInstance.on({
      initialized: noop,
      destroyed: noop,
      scroll: noop,
      updated: noop,
    });

    osInstance2.on(
      {
        initialized: noop,
        destroyed: noop,
        scroll: noop,
        updated: noop,
      },
      true
    );

    expect(osInstancePluginDestroyedEvent).not.toHaveBeenCalled();

    osInstance.destroy();
    osInstance2.destroy();

    expect(osInstancePluginDestroyedEvent).toHaveBeenCalledTimes(2);
  });

  test('build in plugins', () => {
    const [clickScroll, scrollbarHiding, sizeObserver, optionsValidation] =
      OverlayScrollbars.plugin([
        ClickScrollPlugin,
        ScrollbarsHidingPlugin,
        SizeObserverPlugin,
        OptionsValidationPlugin,
      ]);

    expect(typeof clickScroll).toBe('function');
    expect(typeof scrollbarHiding).toBe('object');
    expect(typeof scrollbarHiding._viewportArrangement).toBe('function');
    expect(typeof sizeObserver).toBe('function');
    expect(typeof optionsValidation).toBe('function');

    expect(OverlayScrollbars(div, {})).toBeDefined();
  });
});
