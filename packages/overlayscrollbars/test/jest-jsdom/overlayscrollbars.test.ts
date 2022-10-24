import { defaultOptions } from '~/options';
import { assignDeep } from '~/support';
import { OptionsValidationPlugin } from '~/plugins';
import { OverlayScrollbars as originalOverlayScrollbars } from '~/overlayscrollbars';
import type { Options } from '~/options';
import type { DeepPartial } from '~/typings';

const bodyElm = document.body;
const div = document.createElement('div');

bodyElm.append(div);

let OverlayScrollbars = originalOverlayScrollbars;

describe('overlayscrollbars', () => {
  beforeEach(async () => {
    jest.resetModules();
    ({ OverlayScrollbars } = await import('~/overlayscrollbars'));
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
              const customOptions: DeepPartial<Options> = {
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
              const initialized = jest.fn();
              const updated = jest.fn();
              const destroyed = jest.fn();
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
          const initialized = jest.fn();
          const updated = jest.fn();
          const destroyed = jest.fn();
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
            const customOptions: DeepPartial<Options> = {
              paddingAbsolute: !defaultOptions.paddingAbsolute,
              overflow: { x: 'hidden' },
            };

            const osInstance = OverlayScrollbars(div, customOptions);
            expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions, customOptions));
          });

          test('changed options', () => {
            const customOptions: DeepPartial<Options> = {
              paddingAbsolute: !defaultOptions.paddingAbsolute,
              overflow: { x: 'hidden' },
            };

            const osInstance = OverlayScrollbars(div, {});
            expect(osInstance.options(customOptions)).toEqual(
              assignDeep({}, defaultOptions, customOptions)
            );
            expect(osInstance.options()).toEqual(assignDeep({}, defaultOptions, customOptions));
            osInstance.destroy();
          });

          test('unchanged wont trigger update', () => {
            const updated = jest.fn();
            const initialOpts: DeepPartial<Options> = {
              paddingAbsolute: true,
              overflow: {
                y: 'hidden',
              },
            };
            const osInstance4 = OverlayScrollbars(div, initialOpts, {
              updated,
            });
            expect(updated).toHaveBeenCalledTimes(1);
            osInstance4.options(initialOpts);
            expect(updated).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    test('on', () => {
      const onInitialized = jest.fn();
      const onUpdated = jest.fn();
      const onUpdated2 = jest.fn();
      const onDestroyed = jest.fn();
      const osInstance = OverlayScrollbars(div, {});

      osInstance.on('initialized', onInitialized);
      osInstance.on('updated', [onUpdated, onUpdated, onUpdated2]);
      osInstance.on('destroyed', onDestroyed);

      expect(onInitialized).not.toHaveBeenCalled();

      expect(onUpdated).not.toHaveBeenCalled();
      expect(onUpdated2).not.toHaveBeenCalled();

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
      expect(onUpdated).toHaveBeenCalledTimes(1);
      expect(onUpdated2).toHaveBeenCalledTimes(1);
    });

    test('off', () => {
      const onInitialized = jest.fn();
      const onUpdated = jest.fn();
      const onUpdated2 = jest.fn();
      const onDestroyed = jest.fn();

      expect(onInitialized).not.toHaveBeenCalled();
      const osInstance = OverlayScrollbars(
        div,
        {},
        {
          initialized: onInitialized,
          updated: [onUpdated, onUpdated, onUpdated2],
          destroyed: onDestroyed,
        }
      );

      expect(onInitialized).toHaveBeenCalledTimes(1);
      expect(onInitialized).toHaveBeenLastCalledWith(osInstance);

      expect(onUpdated).toHaveBeenCalledTimes(1);
      expect(onUpdated2).toHaveBeenCalledTimes(1);

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
        overflowStyle: { x: '', y: '' },
        hasOverflow: { x: false, y: false },
        padding: { t: 0, r: 0, b: 0, l: 0 },
        paddingAbsolute: false,
        directionRTL: false,
        destroyed: false,
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
  });

  describe('static', () => {
    test('plugin', () => {
      expect(OverlayScrollbars.plugin).toEqual(expect.any(Function));
    });

    test('env', () => {
      const env = OverlayScrollbars.env();
      const envObj = {
        scrollbarsSize: { x: 0, y: 0 },
        scrollbarsOverlaid: { x: true, y: true },
        scrollbarsHiding: false,
        rtlScrollBehavior: { i: true, n: false },
        flexboxGlue: true,
        cssCustomProperties: false,
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

  test('plugins', () => {
    const staticPluginFn = jest.fn();
    const staticObjPluginFn = jest.fn();
    const instanceObjPluginFn = jest.fn();
    const staticPlugin = {
      staticPlugin: {
        staticFn: staticPluginFn,
      },
    };
    expect(
      OverlayScrollbars.plugin([
        {
          expect: (staticObj, instanceObj) => {
            if (instanceObj) {
              expect(staticObj).toBe(undefined);
              expect(OverlayScrollbars.valid(instanceObj)).toBe(true);
            }
            if (staticObj) {
              expect(staticObj).toBe(OverlayScrollbars);
              expect(instanceObj).toBe(undefined);
            }
          },
        },
        {
          staticPlugin,
          staticObjPlugin: (staticObj, instanceObj) => {
            if (staticObj) {
              expect(instanceObj).toBe(undefined);
              // @ts-ignore
              staticObj.staticObjPluginFn = staticObjPluginFn;
            }
          },
          instanceObjPlugin: (_, instanceObj) => {
            if (instanceObj) {
              // @ts-ignore
              instanceObj.instanceObjPluginFn = instanceObjPluginFn;
            }
          },
        },
      ])
    ).toBe(undefined);

    expect(staticPluginFn).not.toHaveBeenCalled();
    // @ts-ignore
    staticPlugin.staticPlugin.staticFn();
    expect(staticPluginFn).toHaveBeenCalledTimes(1);

    // staticObj plugin must be available before any initialization
    expect(staticObjPluginFn).not.toHaveBeenCalled();
    // @ts-ignore
    OverlayScrollbars.staticObjPluginFn();
    expect(staticObjPluginFn).toHaveBeenCalledTimes(1);

    const osInstance = OverlayScrollbars(div, {});
    expect(instanceObjPluginFn).not.toHaveBeenCalled();
    // @ts-ignore
    osInstance.instanceObjPluginFn();
    expect(instanceObjPluginFn).toHaveBeenCalledTimes(1);
  });
});
