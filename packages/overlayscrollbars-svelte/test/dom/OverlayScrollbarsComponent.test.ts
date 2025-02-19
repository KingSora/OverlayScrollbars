import { describe, test, beforeEach, afterEach, expect, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { OverlayScrollbarsComponentRef } from '../../src/OverlayScrollbarsComponent.types';
import { OverlayScrollbarsComponent } from '../../src/overlayscrollbars-svelte';
import TestComponent from './TestComponent.svelte';
import TestElement from './TestElement.svelte';
import TestComponentBody from './TestComponentBody.svelte';

const getComputedStyleOriginal = window.getComputedStyle;
vi.stubGlobal(
  'getComputedStyle',
  vi.fn(function (...args: Parameters<typeof getComputedStyleOriginal>) {
    const result: CSSStyleDeclaration = getComputedStyleOriginal.apply(
      // @ts-ignore
      this,
      args
    );
    const getPropertyValueOriginal = result.getPropertyValue;
    result.getPropertyValue = function (prop: string) {
      if (prop === 'scrollbar-width' || prop === 'scrollbarWidth') {
        return 'none';
      }
      return getPropertyValueOriginal.call(this, prop);
    };
    return result;
  })
);
vi.useFakeTimers({
  toFake: [
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'requestIdleCallback',
    'cancelIdleCallback',
  ],
});

/**
 * rerender would unmount and re-mount component... so I am faking it with custom event...
 */
describe('OverlayScrollbarsComponent', () => {
  const originalDocumentBody = document.body;

  beforeEach(() => {
    document.body = originalDocumentBody;
  });

  afterEach(() => cleanup());

  describe('correct rendering', () => {
    test('correct root element with instance', async () => {
      const elementA = 'code';
      const elementB = 'span';
      const elementC = TestElement;

      let osInstance;
      const { container } = render(TestComponent);

      expect(container).not.toBeEmptyDOMElement();
      expect(container.querySelector('div')).toBe(container.firstElementChild); // default is div

      expect(OverlayScrollbars.valid(osInstance)).toBe(false);
      osInstance = OverlayScrollbars(container.firstElementChild as HTMLElement);

      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { element: elementA },
        })
      );
      expect(container.querySelector(elementA)).toBe(container.firstElementChild);

      expect(OverlayScrollbars.valid(osInstance)).toBe(false); // prev instance is destroyed
      osInstance = OverlayScrollbars(container.firstElementChild as HTMLElement);
      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { element: elementB },
        })
      );
      expect(container.querySelector(elementB)).toBe(container.firstElementChild);

      expect(OverlayScrollbars.valid(osInstance)).toBe(false); // prev instance is destroyed
      osInstance = OverlayScrollbars(container.firstElementChild as HTMLElement);
      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { element: elementC },
        })
      );
      expect(container.querySelector('section')).toBe(container.firstElementChild);

      expect(OverlayScrollbars.valid(osInstance)).toBe(false); // prev instance is destroyed
      osInstance = OverlayScrollbars(container.firstElementChild as HTMLElement);
      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);
    });

    test('data-overlayscrollbars-initialize', async () => {
      const { container } = render(OverlayScrollbarsComponent);

      expect(container.querySelector('[data-overlayscrollbars-initialize]')).toBeTruthy();
    });

    test('children', () => {
      const { container } = render(TestComponent);
      expect(screen.getByText(/hello/)).toBeInTheDocument();
      expect(screen.getByText(/svelte/)).toBeInTheDocument();
      expect(screen.getByText(/svelte/).parentElement).not.toBe(container.firstElementChild);
    });

    test('dynamic children', async () => {
      render(TestComponent);
      const addBtn = screen.getByText('add');
      const removeBtn = screen.getByText('remove');
      const initialElement = screen.getByText('0');
      expect(initialElement).toBeInTheDocument();

      const initialElementParent = initialElement.parentElement;
      expect(initialElementParent).toBeInTheDocument();

      await userEvent.click(addBtn);
      expect((await screen.findByText('1')).parentElement).toBe(initialElementParent);

      await userEvent.click(removeBtn);
      await userEvent.click(removeBtn);
      expect((await screen.findByText('empty')).parentElement).toBe(initialElementParent);
    });

    test('className', async () => {
      const { container } = render(TestComponent, {
        props: {
          className: 'overlay scrollbars',
        },
      });

      expect(container.firstElementChild).toHaveClass('overlay', 'scrollbars');

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { className: 'overlay scrollbars svelte' },
        })
      );

      expect(container.firstElementChild).toHaveClass('overlay', 'scrollbars', 'svelte');
    });

    test('style', async () => {
      const { container } = render(TestComponent, {
        props: {
          style: 'width: 22px',
        },
      });

      expect(container.firstElementChild).toHaveStyle({ width: '22px' });

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { style: 'height: 33px' },
        })
      );

      expect(container.firstElementChild).toHaveStyle({ height: '33px' });
    });
  });

  describe('deferred initialization', () => {
    test('basic defer', () => {
      const { container } = render(TestComponent, {
        props: {
          defer: true,
        },
      });

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeDefined();
    });

    test('options defer', () => {
      const { container } = render(TestComponent, {
        props: {
          defer: { timeout: 0 },
        },
      });

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeDefined();
    });

    test('defer with unsupported Idle', () => {
      const original = window.requestIdleCallback;
      // @ts-ignore
      window.requestIdleCallback = undefined;

      const { container } = render(TestComponent, {
        props: {
          defer: true,
        },
      });

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeDefined();

      window.requestIdleCallback = original;
    });
  });

  test('body', async () => {
    const htmlElement = document.documentElement;

    document.body.remove();

    const { unmount } = render(TestComponentBody, {
      target: htmlElement,
      props: {
        element: 'body',
      },
    });

    expect(htmlElement).toHaveAttribute('data-overlayscrollbars');
    expect(htmlElement.querySelector('body')).toHaveAttribute('data-overlayscrollbars-initialize');
    expect(htmlElement.querySelector('body')).not.toBeEmptyDOMElement();
    expect(htmlElement.querySelector('body')?.firstElementChild!.tagName).toBe('SECTION');
    expect(htmlElement.querySelector('body')?.firstElementChild).toHaveAttribute('id', 'body');

    unmount();
  });

  test('ref', () => {
    let osRef: OverlayScrollbarsComponentRef | undefined;
    const { container } = render(TestComponent, {
      props: {
        getRef: (ref: any) => {
          osRef = ref;
        },
      },
    });

    expect(osRef).toBeTruthy();

    const { osInstance, getElement } = osRef!;
    expect(osInstance).toBeTypeOf('function');
    expect(getElement).toBeTypeOf('function');
    expect(OverlayScrollbars.valid(osInstance())).toBe(true);
    expect(getElement()).toBe(container.firstElementChild);
  });

  test('options', async () => {
    let osRef: OverlayScrollbarsComponentRef | undefined;
    render(TestComponent, {
      props: {
        options: { paddingAbsolute: true, overflow: { y: 'hidden' } },
        getRef: (ref: any) => {
          osRef = ref;
        },
      },
    });

    const instance = osRef!.osInstance()!;

    const opts = instance.options();
    expect(opts.paddingAbsolute).toBe(true);
    expect(opts.overflow.y).toBe('hidden');

    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: {
          options: { overflow: { x: 'hidden' } },
        },
      })
    );

    const newOpts = instance.options();
    expect(newOpts.paddingAbsolute).toBe(false); //switches back to default because its not specified in the new options
    expect(newOpts.overflow.x).toBe('hidden');
    expect(newOpts.overflow.y).toBe('scroll'); //switches back to default because its not specified in the new options

    // instance didn't change
    expect(instance).toBe(osRef!.osInstance());

    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: {
          element: 'span',
          options: { overflow: { x: 'hidden', y: 'hidden' } },
        },
      })
    );

    const newElementInstance = osRef!.osInstance()!;
    const newElementNewOpts = newElementInstance.options();
    expect(newElementInstance).not.toBe(instance);
    expect(newElementNewOpts.paddingAbsolute).toBe(false);
    expect(newElementNewOpts.overflow.x).toBe('hidden');
    expect(newElementNewOpts.overflow.y).toBe('hidden');

    // reset options with `undefined`, `null`, `false` or `{}`
    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: {
          options: undefined,
        },
      })
    );

    const clearedOpts = newElementInstance.options();
    expect(osRef!.osInstance()).toBe(newElementInstance);
    expect(clearedOpts.paddingAbsolute).toBe(false);
    expect(clearedOpts.overflow.x).toBe('scroll');
    expect(clearedOpts.overflow.y).toBe('scroll');
  });

  test('events', async () => {
    const onInitialized = vi.fn();
    const onUpdated = vi.fn();
    const onUpdated2 = vi.fn();
    let osRef: OverlayScrollbarsComponentRef | undefined;
    render(TestComponent, {
      props: {
        events: { initialized: onInitialized },
        getRef: (ref: any) => {
          osRef = ref;
        },
      },
    });

    const instance = osRef!.osInstance()!;

    expect(onInitialized).toHaveBeenCalledTimes(1);

    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: {
          events: { updated: onUpdated },
        },
      })
    );
    expect(onUpdated).not.toHaveBeenCalled();

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated2).toHaveBeenCalledTimes(0);

    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: {
          events: { updated: [onUpdated, onUpdated2] },
        },
      })
    );

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(2);
    expect(onUpdated2).toHaveBeenCalledTimes(1);

    // unregister with `[]`, `null` or `undefined`
    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: {
          events: { updated: null },
        },
      })
    );

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(2);
    expect(onUpdated2).toHaveBeenCalledTimes(1);

    // instance didn't change
    expect(instance).toBe(osRef!.osInstance());

    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: { element: 'span', events: { updated: [onUpdated, onUpdated2] } },
      })
    );

    const newElementInstance = osRef!.osInstance()!;
    expect(newElementInstance).not.toBe(instance);
    expect(onUpdated).toHaveBeenCalledTimes(3);
    expect(onUpdated2).toHaveBeenCalledTimes(2);

    // reset events with `undefined`, `null`, `false` or `{}`
    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: { element: 'span', events: undefined },
      })
    );

    newElementInstance.update(true);
    expect(newElementInstance).toBe(osRef!.osInstance());
    expect(onInitialized).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(3);
    expect(onUpdated2).toHaveBeenCalledTimes(2);
  });

  test('destroy', () => {
    let osRef: OverlayScrollbarsComponentRef | undefined;
    const { unmount } = render(TestComponent, {
      props: {
        getRef(ref: any) {
          osRef = ref;
        },
      },
    });

    const { osInstance } = osRef!;

    expect(OverlayScrollbars.valid(osInstance())).toBe(true);

    unmount();

    expect(osInstance()).toBeDefined();
    expect(OverlayScrollbars.valid(osInstance())).toBe(false);
  });

  test('dispatch events', async () => {
    const initialized = vi.fn((e: any) => {
      const args = e.detail;
      expect(args).toEqual([expect.any(Object)]);
    });
    const updated = vi.fn((e: any) => {
      const args = e.detail;
      expect(args).toEqual([expect.any(Object), expect.any(Object)]);
    });
    const destroyed = vi.fn((e: any) => {
      const args = e.detail;
      expect(args).toEqual([expect.any(Object), expect.any(Boolean)]);
    });
    const scroll = vi.fn((e: any) => {
      const args = e.detail;
      expect(args).toEqual([expect.any(Object), expect.any(Event)]);
    });
    const { container, unmount } = render(TestComponent, {
      props: {
        initialized,
        updated,
        destroyed,
        scroll,
      },
    });

    expect(initialized).toHaveBeenCalledTimes(1);
    expect(updated).toHaveBeenCalledTimes(1);
    expect(destroyed).not.toHaveBeenCalled();
    expect(scroll).not.toHaveBeenCalled();

    container.querySelectorAll('*').forEach((e) => {
      fireEvent.scroll(e);
    });

    expect(destroyed).not.toHaveBeenCalled();
    expect(scroll).toHaveBeenCalledTimes(1);

    unmount();

    expect(destroyed).toHaveBeenCalledTimes(1);
  });
});
