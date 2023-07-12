import { describe, test, expect, afterEach, vitest, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { OverlayScrollbars } from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from '~/overlayscrollbars-svelte';
import type { Ref } from '~/OverlayScrollbarsComponent.types';
import Test from './Test.svelte';

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
  afterEach(() => cleanup());

  describe('correct rendering', () => {
    test('correct root element with instance', async () => {
      const elementA = 'code';
      const elementB = 'span';
      let osInstance;
      const { container } = render(Test);
      const realContainer = container.firstElementChild!;

      expect(realContainer).not.toBeEmptyDOMElement();
      expect(realContainer.querySelector('div')).toBe(realContainer.firstElementChild); // default is div

      expect(OverlayScrollbars.valid(osInstance)).toBe(false);
      osInstance = OverlayScrollbars(realContainer.firstElementChild as HTMLElement);

      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { element: elementA },
        })
      );
      expect(realContainer.querySelector(elementA)).toBe(realContainer.firstElementChild);

      expect(OverlayScrollbars.valid(osInstance)).toBe(false); // prev instance is destroyed
      osInstance = OverlayScrollbars(realContainer.firstElementChild as HTMLElement);
      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { element: elementB },
        })
      );
      expect(realContainer.querySelector(elementB)).toBe(realContainer.firstElementChild);

      expect(OverlayScrollbars.valid(osInstance)).toBe(false); // prev instance is destroyed
      osInstance = OverlayScrollbars(realContainer.firstElementChild as HTMLElement);
      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);
    });

    test('data-overlayscrollbars-initialize', async () => {
      const { container } = render(OverlayScrollbarsComponent);

      expect(container.querySelector('[data-overlayscrollbars-initialize]')).toBeTruthy();
    });

    test('children', () => {
      const { container } = render(Test);
      expect(screen.getByText(/hello/)).toBeInTheDocument();
      expect(screen.getByText(/svelte/)).toBeInTheDocument();
      expect(screen.getByText(/svelte/).parentElement).not.toBe(container.firstElementChild);
    });

    test('dynamic children', async () => {
      render(Test);
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
      const { container } = render(Test, {
        props: {
          className: 'overlay scrollbars',
        },
      });
      const realContainer = container.firstElementChild!;

      expect(realContainer.firstElementChild).toHaveClass('overlay', 'scrollbars');

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { className: 'overlay scrollbars svelte' },
        })
      );

      expect(realContainer.firstElementChild).toHaveClass('overlay', 'scrollbars', 'svelte');
    });

    test('style', async () => {
      const { container } = render(Test, {
        props: {
          style: 'width: 22px',
        },
      });
      const realContainer = container.firstElementChild!;

      expect(realContainer.firstElementChild).toHaveStyle({ width: '22px' });

      await fireEvent(
        screen.getByText('props'),
        new CustomEvent('osProps', {
          detail: { style: 'height: 33px' },
        })
      );

      expect(realContainer.firstElementChild).toHaveStyle({ height: '33px' });
    });
  });

  describe('deferred initialization', () => {
    test('basic defer', () => {
      const { container } = render(Test, {
        props: {
          defer: true,
        },
      });
      const realContainer = container.firstElementChild!;

      expect(OverlayScrollbars(realContainer.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(realContainer.firstElementChild! as HTMLElement)).toBeDefined();
    });

    test('options defer', () => {
      const { container } = render(Test, {
        props: {
          defer: { timeout: 0 },
        },
      });
      const realContainer = container.firstElementChild!;

      expect(OverlayScrollbars(realContainer.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(realContainer.firstElementChild! as HTMLElement)).toBeDefined();
    });

    test('defer with unsupported Idle', () => {
      const original = window.requestIdleCallback;
      // @ts-ignore
      window.requestIdleCallback = undefined;

      const { container } = render(Test, {
        props: {
          defer: true,
        },
      });
      const realContainer = container.firstElementChild!;

      expect(OverlayScrollbars(realContainer.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(realContainer.firstElementChild! as HTMLElement)).toBeDefined();

      window.requestIdleCallback = original;
    });
  });

  test('ref', () => {
    let osRef: Ref | undefined;
    const { container } = render(Test, {
      props: {
        getRef: (ref: any) => {
          osRef = ref;
        },
      },
    });
    const realContainer = container.firstElementChild!;

    expect(osRef).toBeTruthy();

    const { osInstance, getElement } = osRef!;
    expect(osInstance).toBeTypeOf('function');
    expect(getElement).toBeTypeOf('function');
    expect(OverlayScrollbars.valid(osInstance())).toBe(true);
    expect(getElement()).toBe(realContainer.firstElementChild);
  });

  test('options', async () => {
    let osRef: Ref | undefined;
    render(Test, {
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
    const onUpdatedInitial = vitest.fn();
    const onUpdated = vitest.fn();
    let osRef: Ref | undefined;
    render(Test, {
      props: {
        events: { updated: onUpdatedInitial },
        getRef: (ref: any) => {
          osRef = ref;
        },
      },
    });

    const instance = osRef!.osInstance()!;

    expect(onUpdatedInitial).toHaveBeenCalledTimes(1);

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
    expect(onUpdatedInitial).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(1);

    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: {
          events: { updated: [onUpdated, onUpdatedInitial] },
        },
      })
    );

    instance.update(true);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(2);
    expect(onUpdated).toHaveBeenCalledTimes(2);

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
    expect(onUpdatedInitial).toHaveBeenCalledTimes(2);
    expect(onUpdated).toHaveBeenCalledTimes(2);

    // instance didn't change
    expect(instance).toBe(osRef!.osInstance());

    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: { element: 'span', events: { updated: [onUpdated, onUpdatedInitial] } },
      })
    );

    const newElementInstance = osRef!.osInstance()!;
    expect(newElementInstance).not.toBe(instance);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(3);
    expect(onUpdated).toHaveBeenCalledTimes(3);

    // reset events with `undefined`, `null`, `false` or `{}`
    await fireEvent(
      screen.getByText('props'),
      new CustomEvent('osProps', {
        detail: { element: 'span', events: undefined },
      })
    );

    newElementInstance.update(true);
    expect(newElementInstance).toBe(osRef!.osInstance());
    expect(onUpdatedInitial).toHaveBeenCalledTimes(3);
    expect(onUpdated).toHaveBeenCalledTimes(3);
  });

  test('destroy', () => {
    let osRef: Ref | undefined;
    const { unmount } = render(Test, {
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
    const initialized = vitest.fn((e: any) => {
      const args = e.detail;
      expect(args).toEqual([expect.any(Object)]);
    });
    const updated = vitest.fn((e: any) => {
      const args = e.detail;
      expect(args).toEqual([expect.any(Object), expect.any(Object)]);
    });
    const destroyed = vitest.fn((e: any) => {
      const args = e.detail;
      expect(args).toEqual([expect.any(Object), expect.any(Boolean)]);
    });
    const scroll = vitest.fn((e: any) => {
      const args = e.detail;
      expect(args).toEqual([expect.any(Object), expect.any(Event)]);
    });
    const { container, unmount } = render(Test, {
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
