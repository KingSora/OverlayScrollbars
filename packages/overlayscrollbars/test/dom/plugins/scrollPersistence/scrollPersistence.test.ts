import { vi, describe, test, beforeEach, afterEach, expect } from 'vitest';
import type {
  ScrollPersistencePluginOptions,
  ScrollPersistenceStorageAdapter,
} from '../../../../src/plugins';

vi.useFakeTimers();

const createClampedScrollMock = (element: HTMLElement, initialMax: { x: number; y: number }) => {
  let scrollLeftVal = 0;
  let scrollTopVal = 0;
  const max = { ...initialMax };

  Object.defineProperty(element, 'scrollLeft', {
    configurable: true,
    get: () => scrollLeftVal,
    set: (val: number) => {
      scrollLeftVal = Math.max(0, Math.min(val, max.x));
    },
  });

  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    get: () => scrollTopVal,
    set: (val: number) => {
      scrollTopVal = Math.max(0, Math.min(val, max.y));
    },
  });

  return max;
};

describe('ScrollPersistencePlugin', () => {
  let OverlayScrollbars: Awaited<
    typeof import('../../../../src/overlayscrollbars')
  >['OverlayScrollbars'];
  let ScrollPersistencePlugin: Awaited<
    typeof import('../../../../src/plugins')
  >['ScrollPersistencePlugin'];
  let createScrollPersistencePlugin: Awaited<
    typeof import('../../../../src/plugins')
  >['createScrollPersistencePlugin'];
  let container: HTMLDivElement;

  beforeEach(async () => {
    vi.resetModules();
    sessionStorage.clear();
    localStorage.clear();
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.id = 'scroll-target';
    document.body.append(container);

    ({ OverlayScrollbars } = await import('../../../../src/overlayscrollbars'));
    ({ ScrollPersistencePlugin, createScrollPersistencePlugin } = await import(
      '../../../../src/plugins'
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
    sessionStorage.clear();
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('saves scroll position to sessionStorage and restores on re-initialization', () => {
    OverlayScrollbars.plugin(ScrollPersistencePlugin);

    const instance1 = OverlayScrollbars(container, {});
    const { scrollOffsetElement, scrollEventElement } = instance1.elements();

    scrollOffsetElement.scrollLeft = 42;
    scrollOffsetElement.scrollTop = 275;
    scrollEventElement.dispatchEvent(new Event('scroll'));

    expect(sessionStorage.length).toBe(0);

    vi.advanceTimersByTime(100);

    const key = instance1.plugin(ScrollPersistencePlugin)?.key();
    expect(key).toBe('os-scroll:/:#scroll-target');
    expect(sessionStorage.getItem(key!)).toBe(JSON.stringify({ x: 42, y: 275 }));

    instance1.destroy();

    const reloadedContainer = document.createElement('div');
    reloadedContainer.id = 'scroll-target';
    document.body.innerHTML = '';
    document.body.append(reloadedContainer);

    const instance2 = OverlayScrollbars(reloadedContainer, {});
    const restoredEl = instance2.elements().scrollOffsetElement;

    expect(restoredEl.scrollLeft).toBe(42);
    expect(restoredEl.scrollTop).toBe(275);

    instance2.destroy();
  });

  test('flushes pending debounced save on pagehide and beforeunload', () => {
    OverlayScrollbars.plugin(ScrollPersistencePlugin);

    const instance = OverlayScrollbars(container, {});
    const { scrollOffsetElement, scrollEventElement } = instance.elements();
    const pluginInstance = instance.plugin(ScrollPersistencePlugin)!;

    scrollOffsetElement.scrollTop = 180;
    scrollEventElement.dispatchEvent(new Event('scroll'));
    expect(pluginInstance.get()).toBeNull();

    window.dispatchEvent(new Event('pagehide'));
    expect(pluginInstance.get()).toEqual({ x: 0, y: 180 });

    scrollOffsetElement.scrollTop = 320;
    scrollEventElement.dispatchEvent(new Event('scroll'));
    expect(pluginInstance.get()).toEqual({ x: 0, y: 180 });

    window.dispatchEvent(new Event('beforeunload'));
    expect(pluginInstance.get()).toEqual({ x: 0, y: 320 });

    instance.destroy();
  });

  test('flushes pending debounced save on destroy when not canceled', () => {
    OverlayScrollbars.plugin(ScrollPersistencePlugin);

    const instance = OverlayScrollbars(container, {});
    const { scrollOffsetElement, scrollEventElement } = instance.elements();
    const pluginInstance = instance.plugin(ScrollPersistencePlugin)!;

    scrollOffsetElement.scrollLeft = 15;
    scrollOffsetElement.scrollTop = 95;
    scrollEventElement.dispatchEvent(new Event('scroll'));
    expect(pluginInstance.get()).toBeNull();

    instance.destroy();
    expect(pluginInstance.get()).toEqual({ x: 15, y: 95 });
  });

  test('does not persist or restore when initialization is canceled', () => {
    OverlayScrollbars.plugin(ScrollPersistencePlugin);

    const addSpy = vi.spyOn(window, 'addEventListener');
    const instance = OverlayScrollbars(
      {
        target: container,
        cancel: { nativeScrollbarsOverlaid: true },
      },
      {}
    );

    const unloadListeners = addSpy.mock.calls.filter(
      ([name]) => name === 'pagehide' || name === 'beforeunload'
    );
    expect(unloadListeners).toHaveLength(0);
    expect(OverlayScrollbars.valid(instance)).toBe(false);
    expect(sessionStorage.length).toBe(0);
  });

  test('preserves negative scroll coordinates for RTL and reversed layouts', () => {
    OverlayScrollbars.plugin(createScrollPersistencePlugin({ debounce: false }));

    const instance1 = OverlayScrollbars(container, {});
    const { scrollOffsetElement, scrollEventElement } = instance1.elements();

    scrollOffsetElement.scrollLeft = -240;
    scrollOffsetElement.scrollTop = -110;
    scrollEventElement.dispatchEvent(new Event('scroll'));

    expect(instance1.plugin(ScrollPersistencePlugin)?.get()).toEqual({ x: -240, y: -110 });
    instance1.destroy();

    const reloaded = document.createElement('div');
    reloaded.id = 'scroll-target';
    document.body.innerHTML = '';
    document.body.append(reloaded);

    const instance2 = OverlayScrollbars(reloaded, {});
    expect(instance2.elements().scrollOffsetElement.scrollLeft).toBe(-240);
    expect(instance2.elements().scrollOffsetElement.scrollTop).toBe(-110);
    instance2.destroy();
  });

  test('does not overwrite pre-scrolled position on automatic restore but allows explicit restore', () => {
    OverlayScrollbars.plugin(ScrollPersistencePlugin);
    sessionStorage.setItem('os-scroll:/:#scroll-target', JSON.stringify({ x: 10, y: 400 }));

    container.scrollTop = 125;

    const instance = OverlayScrollbars(container, {});
    const { scrollOffsetElement } = instance.elements();
    const pluginInstance = instance.plugin(ScrollPersistencePlugin)!;

    expect(scrollOffsetElement.scrollTop).toBe(125);
    expect(pluginInstance.restore()).toBe(true);
    expect(scrollOffsetElement.scrollLeft).toBe(10);
    expect(scrollOffsetElement.scrollTop).toBe(400);

    instance.destroy();
  });

  describe('key resolution', () => {
    test('uses data-overlayscrollbars-scroll-key attribute and supports opt-out with false', () => {
      OverlayScrollbars.plugin(createScrollPersistencePlugin({ debounce: false }));

      const keyed = document.createElement('div');
      keyed.setAttribute('data-overlayscrollbars-scroll-key', 'sidebar');
      document.body.append(keyed);

      const optedOut = document.createElement('div');
      optedOut.id = 'ignored';
      optedOut.setAttribute('data-overlayscrollbars-scroll-key', 'false');
      document.body.append(optedOut);

      const addSpy = vi.spyOn(window, 'addEventListener');
      const instanceOptedOut = OverlayScrollbars(optedOut, {});
      expect(
        addSpy.mock.calls.filter(([name]) => name === 'pagehide' || name === 'beforeunload')
      ).toHaveLength(0);
      expect(instanceOptedOut.plugin(ScrollPersistencePlugin)?.key()).toBeNull();
      instanceOptedOut.elements().scrollOffsetElement.scrollTop = 50;
      instanceOptedOut.elements().scrollEventElement.dispatchEvent(new Event('scroll'));
      expect(sessionStorage.length).toBe(0);

      const instanceKeyed = OverlayScrollbars(keyed, {});
      expect(instanceKeyed.plugin(ScrollPersistencePlugin)?.key()).toBe('os-scroll:/:sidebar');
      instanceKeyed.elements().scrollOffsetElement.scrollTop = 88;
      instanceKeyed.elements().scrollEventElement.dispatchEvent(new Event('scroll'));
      expect(sessionStorage.getItem('os-scroll:/:sidebar')).toBe(JSON.stringify({ x: 0, y: 88 }));

      instanceKeyed.destroy();
      instanceOptedOut.destroy();
    });

    test('derives deterministic DOM path keys for elements without id and for body', () => {
      OverlayScrollbars.plugin(createScrollPersistencePlugin({ debounce: false }));

      const wrapper = document.createElement('section');
      const siblingA = document.createElement('div');
      const siblingB = document.createElement('div');
      wrapper.append(siblingA, siblingB);
      document.body.append(wrapper);

      const instA = OverlayScrollbars(siblingA, {});
      const instB = OverlayScrollbars(siblingB, {});
      const instBody = OverlayScrollbars(document.body, {});

      const keyA = instA.plugin(ScrollPersistencePlugin)?.key();
      const keyB = instB.plugin(ScrollPersistencePlugin)?.key();
      const keyBody = instBody.plugin(ScrollPersistencePlugin)?.key();

      expect(keyA).toBe('os-scroll:/:body>section[0]>div[0]');
      expect(keyB).toBe('os-scroll:/:body>section[0]>div[1]');
      expect(keyA).not.toBe(keyB);
      expect(keyBody).toBe('os-scroll:/:body');

      instA.destroy();
      instB.destroy();
      instBody.destroy();
    });

    test('derives path relative to nearest ancestor with id', () => {
      OverlayScrollbars.plugin(ScrollPersistencePlugin);

      const root = document.createElement('div');
      root.id = 'app';
      const first = document.createElement('div');
      const second = document.createElement('div');
      root.append(first, second);
      document.body.append(root);

      const inst = OverlayScrollbars(second, {});
      expect(inst.plugin(ScrollPersistencePlugin)?.key()).toBe('os-scroll:/:#app>div[1]');
      inst.destroy();
    });

    test('supports static string key, empty string opt-out, custom function resolver, and custom prefix', () => {
      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          key: 'fixed-key',
          prefix: 'custom:',
          debounce: false,
        })
      );

      const inst1 = OverlayScrollbars(container, {});
      expect(inst1.plugin(ScrollPersistencePlugin)?.key()).toBe('custom:fixed-key');
      inst1.destroy();

      OverlayScrollbars.plugin(createScrollPersistencePlugin({ key: '' }));
      const inst2 = OverlayScrollbars(container, {});
      expect(inst2.plugin(ScrollPersistencePlugin)?.key()).toBeNull();
      inst2.destroy();

      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          prefix: '',
          key: (inst) => {
            const id = inst.elements().target.id;
            return id === 'scroll-target' ? 'resolved-key' : false;
          },
        })
      );

      const other = document.createElement('div');
      other.id = 'other';
      document.body.append(other);

      const inst3 = OverlayScrollbars(container, {});
      const inst4 = OverlayScrollbars(other, {});

      expect(inst3.plugin(ScrollPersistencePlugin)?.key()).toBe('resolved-key');
      expect(inst4.plugin(ScrollPersistencePlugin)?.key()).toBeNull();

      inst3.destroy();
      inst4.destroy();
    });
  });

  describe('storage backends and error handling', () => {
    test('supports localStorage', () => {
      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          storage: 'local',
          debounce: false,
        })
      );

      const inst = OverlayScrollbars(container, {});
      inst.elements().scrollOffsetElement.scrollTop = 310;
      inst.elements().scrollEventElement.dispatchEvent(new Event('scroll'));

      expect(localStorage.getItem('os-scroll:/:#scroll-target')).toBe(
        JSON.stringify({ x: 0, y: 310 })
      );
      expect(sessionStorage.length).toBe(0);
      inst.destroy();
    });

    test('supports custom storage adapter without cloning it', () => {
      const backingMap = new Map<string, string>();
      const customStorage: ScrollPersistenceStorageAdapter & { data: Map<string, string> } = {
        data: backingMap,
        getItem(k) {
          return this.data.get(k) ?? null;
        },
        setItem(k, v) {
          this.data.set(k, v);
        },
        removeItem(k) {
          this.data.delete(k);
        },
      };

      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          storage: customStorage,
          debounce: false,
        })
      );

      const inst = OverlayScrollbars(container, {});
      const pluginInstance = inst.plugin(ScrollPersistencePlugin)!;

      inst.elements().scrollOffsetElement.scrollTop = 77;
      inst.elements().scrollEventElement.dispatchEvent(new Event('scroll'));

      expect(backingMap.get('os-scroll:/:#scroll-target')).toBe(JSON.stringify({ x: 0, y: 77 }));
      expect(pluginInstance.get()).toEqual({ x: 0, y: 77 });

      pluginInstance.clear();
      expect(backingMap.size).toBe(0);
      expect(pluginInstance.get()).toBeNull();
      inst.destroy();
    });

    test('handles malformed, non-object, and non-finite stored values gracefully', () => {
      OverlayScrollbars.plugin(ScrollPersistencePlugin);
      const key = 'os-scroll:/:#scroll-target';

      for (const badValue of [
        'not-json',
        'null',
        '123',
        JSON.stringify({ x: 'bad', y: 10 }),
        JSON.stringify({ x: 10 }),
      ]) {
        sessionStorage.setItem(key, badValue);
        const inst = OverlayScrollbars(container, {});
        expect(inst.plugin(ScrollPersistencePlugin)?.get()).toBeNull();
        expect(inst.elements().scrollOffsetElement.scrollTop).toBe(0);
        inst.destroy();
      }
    });

    test('handles throwing storage adapters and unavailable browser storage safely', () => {
      const throwingStorage: ScrollPersistenceStorageAdapter = {
        getItem: () => {
          throw new Error('SecurityError');
        },
        setItem: () => {
          throw new Error('QuotaExceededError');
        },
        removeItem: () => {
          throw new Error('SecurityError');
        },
      };

      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          storage: throwingStorage,
          debounce: false,
        })
      );

      const inst1 = OverlayScrollbars(container, {});
      const plugin1 = inst1.plugin(ScrollPersistencePlugin)!;
      expect(() => {
        inst1.elements().scrollOffsetElement.scrollTop = 50;
        inst1.elements().scrollEventElement.dispatchEvent(new Event('scroll'));
        plugin1.save();
        plugin1.get();
        plugin1.restore();
        plugin1.clear();
      }).not.toThrow();
      inst1.destroy();

      const originalSessionStorage = Object.getOwnPropertyDescriptor(window, 'sessionStorage');
      Object.defineProperty(window, 'sessionStorage', {
        configurable: true,
        get() {
          throw new Error('Access denied');
        },
      });

      try {
        OverlayScrollbars.plugin(ScrollPersistencePlugin);
        const inst2 = OverlayScrollbars(container, {});
        expect(() => {
          inst2.plugin(ScrollPersistencePlugin)?.save();
          inst2.plugin(ScrollPersistencePlugin)?.get();
          inst2.plugin(ScrollPersistencePlugin)?.clear();
        }).not.toThrow();
        inst2.destroy();
      } finally {
        if (originalSessionStorage) {
          Object.defineProperty(window, 'sessionStorage', originalSessionStorage);
        }
      }

      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          storage: {} as unknown as ScrollPersistencePluginOptions['storage'],
        })
      );
      const inst3 = OverlayScrollbars(container, {});
      expect(inst3.plugin(ScrollPersistencePlugin)?.get()).toBeNull();
      inst3.destroy();
    });
  });

  describe('axes option', () => {
    test('persists and restores only y axis when axes is y', () => {
      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          axes: 'y',
          debounce: false,
        })
      );

      const inst1 = OverlayScrollbars(container, {});
      const { scrollOffsetElement, scrollEventElement } = inst1.elements();
      scrollOffsetElement.scrollLeft = 90;
      scrollOffsetElement.scrollTop = 210;
      scrollEventElement.dispatchEvent(new Event('scroll'));

      expect(inst1.plugin(ScrollPersistencePlugin)?.get()).toEqual({ x: 0, y: 210 });
      inst1.destroy();

      sessionStorage.setItem('os-scroll:/:#scroll-target', JSON.stringify({ x: 99, y: 210 }));
      container.scrollLeft = 35;
      container.scrollTop = 0;

      const inst2 = OverlayScrollbars(container, {});
      expect(inst2.elements().scrollOffsetElement.scrollLeft).toBe(35);
      expect(inst2.elements().scrollOffsetElement.scrollTop).toBe(210);
      inst2.destroy();
    });

    test('persists and restores only x axis when axes is x', () => {
      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          axes: 'x',
          debounce: false,
        })
      );

      const inst1 = OverlayScrollbars(container, {});
      const { scrollOffsetElement, scrollEventElement } = inst1.elements();
      scrollOffsetElement.scrollLeft = 140;
      scrollOffsetElement.scrollTop = 330;
      scrollEventElement.dispatchEvent(new Event('scroll'));

      expect(inst1.plugin(ScrollPersistencePlugin)?.get()).toEqual({ x: 140, y: 0 });
      inst1.destroy();

      sessionStorage.setItem('os-scroll:/:#scroll-target', JSON.stringify({ x: 140, y: 99 }));
      container.scrollLeft = 0;
      container.scrollTop = 55;

      const inst2 = OverlayScrollbars(container, {});
      expect(inst2.elements().scrollOffsetElement.scrollLeft).toBe(140);
      expect(inst2.elements().scrollOffsetElement.scrollTop).toBe(55);
      inst2.destroy();
    });
  });

  describe('debounce option', () => {
    test('coalesces rapid scroll events with custom debounce ms', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      OverlayScrollbars.plugin(createScrollPersistencePlugin({ debounce: 250 }));

      const inst = OverlayScrollbars(container, {});
      const { scrollOffsetElement, scrollEventElement } = inst.elements();

      scrollOffsetElement.scrollTop = 50;
      scrollEventElement.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(100);

      scrollOffsetElement.scrollTop = 150;
      scrollEventElement.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(150);

      expect(setItemSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(setItemSpy).toHaveBeenCalledTimes(1);
      expect(inst.plugin(ScrollPersistencePlugin)?.get()).toEqual({ x: 0, y: 150 });
      inst.destroy();
    });

    test('writes synchronously when debounce is null or false', () => {
      for (const debounceVal of [null, false] as const) {
        sessionStorage.clear();
        OverlayScrollbars.plugin(createScrollPersistencePlugin({ debounce: debounceVal }));

        const inst = OverlayScrollbars(container, {});
        inst.elements().scrollOffsetElement.scrollTop = 64;
        inst.elements().scrollEventElement.dispatchEvent(new Event('scroll'));

        expect(inst.plugin(ScrollPersistencePlugin)?.get()).toEqual({ x: 0, y: 64 });
        inst.destroy();
      }
    });
  });

  describe('restoreOnUpdate for asynchronous content', () => {
    test('retries restoration on subsequent updates until target scroll is reached', () => {
      OverlayScrollbars.plugin(createScrollPersistencePlugin({ debounce: false }));
      sessionStorage.setItem('os-scroll:/:#scroll-target', JSON.stringify({ x: 0, y: 800 }));

      const viewport = document.createElement('div');
      container.append(viewport);
      const maxScroll = createClampedScrollMock(viewport, { x: 0, y: 200 });

      const inst = OverlayScrollbars(
        {
          target: container,
          elements: { viewport },
        },
        {}
      );

      expect(viewport.scrollTop).toBe(200);

      viewport.dispatchEvent(new Event('scroll'));
      expect(inst.plugin(ScrollPersistencePlugin)?.get()).toEqual({ x: 0, y: 800 });

      maxScroll.y = 1000;
      inst.update(true);

      expect(viewport.scrollTop).toBe(800);
      inst.destroy();
    });

    test('cancels pending async restoration on user interaction', () => {
      OverlayScrollbars.plugin(createScrollPersistencePlugin({ debounce: false }));
      sessionStorage.setItem('os-scroll:/:#scroll-target', JSON.stringify({ x: 0, y: 800 }));

      const viewport = document.createElement('div');
      container.append(viewport);
      const maxScroll = createClampedScrollMock(viewport, { x: 0, y: 200 });

      const inst = OverlayScrollbars(
        {
          target: container,
          elements: { viewport },
        },
        {}
      );

      expect(viewport.scrollTop).toBe(200);

      viewport.dispatchEvent(new Event('wheel'));

      maxScroll.y = 1000;
      inst.update(true);

      expect(viewport.scrollTop).toBe(200);
      inst.destroy();
    });

    test('cancels pending async restoration when scrolled to a different position', () => {
      OverlayScrollbars.plugin(createScrollPersistencePlugin({ debounce: false }));
      sessionStorage.setItem('os-scroll:/:#scroll-target', JSON.stringify({ x: 0, y: 800 }));

      const viewport = document.createElement('div');
      container.append(viewport);
      const maxScroll = createClampedScrollMock(viewport, { x: 0, y: 200 });

      const inst = OverlayScrollbars(
        {
          target: container,
          elements: { viewport },
        },
        {}
      );

      expect(viewport.scrollTop).toBe(200);

      viewport.scrollTop = 50;
      viewport.dispatchEvent(new Event('scroll'));

      expect(inst.plugin(ScrollPersistencePlugin)?.get()).toEqual({ x: 0, y: 50 });

      maxScroll.y = 1000;
      inst.update(true);

      expect(viewport.scrollTop).toBe(50);
      inst.destroy();
    });

    test('does not retry on subsequent updates when restoreOnUpdate is false', () => {
      OverlayScrollbars.plugin(
        createScrollPersistencePlugin({
          debounce: false,
          restoreOnUpdate: false,
        })
      );
      sessionStorage.setItem('os-scroll:/:#scroll-target', JSON.stringify({ x: 0, y: 800 }));

      const viewport = document.createElement('div');
      container.append(viewport);
      const maxScroll = createClampedScrollMock(viewport, { x: 0, y: 200 });

      const inst = OverlayScrollbars(
        {
          target: container,
          elements: { viewport },
        },
        {}
      );

      expect(viewport.scrollTop).toBe(200);

      maxScroll.y = 1000;
      inst.update(true);

      expect(viewport.scrollTop).toBe(200);
      inst.destroy();
    });
  });

  describe('imperative plugin instance methods and cleanup', () => {
    test('save, get, restore, clear work imperatively and handle destroyed instances safely', () => {
      const customPlugin = createScrollPersistencePlugin({ debounce: 500 });
      OverlayScrollbars.plugin(customPlugin);

      const inst = OverlayScrollbars(container, {});
      const pluginByDefault = inst.plugin(ScrollPersistencePlugin)!;
      const pluginByCustom = inst.plugin(customPlugin)!;

      expect(pluginByDefault).toBe(pluginByCustom);
      expect(pluginByDefault.get()).toBeNull();
      expect(pluginByDefault.restore()).toBe(false);

      const { scrollOffsetElement } = inst.elements();
      scrollOffsetElement.scrollLeft = 25;
      scrollOffsetElement.scrollTop = 175;
      pluginByDefault.save();

      expect(pluginByDefault.get()).toEqual({ x: 25, y: 175 });

      scrollOffsetElement.scrollLeft = 0;
      scrollOffsetElement.scrollTop = 0;
      expect(pluginByDefault.restore()).toBe(true);
      expect(scrollOffsetElement.scrollLeft).toBe(25);
      expect(scrollOffsetElement.scrollTop).toBe(175);

      pluginByDefault.clear();
      expect(pluginByDefault.get()).toBeNull();
      expect(pluginByDefault.restore()).toBe(false);

      inst.destroy();

      scrollOffsetElement.scrollTop = 500;
      pluginByDefault.save();
      expect(pluginByDefault.get()).toBeNull();
      expect(pluginByDefault.restore()).toBe(false);
    });

    test('cleans up window unload listeners on destroy', () => {
      OverlayScrollbars.plugin(ScrollPersistencePlugin);

      const counts: Record<string, number> = {};
      const origAdd = window.addEventListener.bind(window);
      const origRemove = window.removeEventListener.bind(window);
      const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation((...args) => {
        counts[args[0]] = (counts[args[0]] || 0) + 1;
        return origAdd(...args);
      });
      const removeSpy = vi.spyOn(window, 'removeEventListener').mockImplementation((...args) => {
        counts[args[0]] = (counts[args[0]] || 0) - 1;
        return origRemove(...args);
      });

      const inst = OverlayScrollbars(container, {});
      expect(counts.pagehide).toBe(1);
      expect(counts.beforeunload).toBe(1);

      inst.destroy();
      expect(counts.pagehide).toBe(0);
      expect(counts.beforeunload).toBe(0);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });
  });
});
