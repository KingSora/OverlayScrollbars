import { onMounted, ref, toRefs, nextTick } from 'vue';
import { describe, test, beforeEach, afterEach, expect, vi } from 'vitest';
import { OverlayScrollbars } from 'overlayscrollbars';
import { fireEvent, render, screen, cleanup } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { OverlayScrollbarsComponent } from '../../src/overlayscrollbars-vue';

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
      let osInstance;
      const { container, rerender } = render(OverlayScrollbarsComponent);
      await nextTick();

      expect(container).not.toBeEmptyDOMElement();
      expect(container.querySelector('div')).toBe(container.firstElementChild); // default is div

      expect(OverlayScrollbars.valid(osInstance)).toBe(false);
      osInstance = OverlayScrollbars(container.firstElementChild as HTMLElement);
      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);

      await rerender({ element: elementA });
      expect(container.querySelector(elementA)).toBe(container.firstElementChild);

      expect(OverlayScrollbars.valid(osInstance)).toBe(false); // prev instance is destroyed
      osInstance = OverlayScrollbars(container.firstElementChild as HTMLElement);
      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);

      await rerender({ element: elementB });
      expect(container.querySelector(elementB)).toBe(container.firstElementChild);

      expect(OverlayScrollbars.valid(osInstance)).toBe(false); // prev instance is destroyed
      osInstance = OverlayScrollbars(container.firstElementChild as HTMLElement);
      expect(osInstance).toBeDefined();
      expect(OverlayScrollbars.valid(osInstance)).toBe(true);
    });

    test('data-overlayscrollbars-initialize', async () => {
      const { container } = render(OverlayScrollbarsComponent);

      expect(container.querySelector('[data-overlayscrollbars-initialize]')).toBeTruthy();
    });

    test('children', async () => {
      const { container } = render(OverlayScrollbarsComponent, {
        slots: { default: 'hello <span>vue</span>' },
      });
      expect(screen.getByText(/hello/)).toBeInTheDocument();
      expect(screen.getByText(/vue/)).toBeInTheDocument();

      await nextTick();
      expect(screen.getByText(/vue/).parentElement).not.toBe(container.firstElementChild);
    });

    test('dynamic children', async () => {
      render(() => {
        const elements = ref(1);

        return (
          <>
            <OverlayScrollbarsComponent>
              {elements.value === 0 ? 'empty' : null}
              {[...Array(elements.value).keys()].map((i) => (
                <span key={i}>{i}</span>
              ))}
            </OverlayScrollbarsComponent>
            <button onClick={() => (elements.value += 1)}>add</button>
            <button onClick={() => (elements.value -= 1)}>remove</button>
          </>
        );
      });
      await nextTick();

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
      expect(await screen.findByText('empty')).toBe(initialElementParent);
    });

    test('className', async () => {
      const { container, rerender } = render(OverlayScrollbarsComponent, {
        props: {
          class: 'overlay scrollbars',
        },
      });

      expect(container.firstElementChild).toHaveClass('overlay', 'scrollbars');

      await rerender({ class: 'overlay scrollbars vue' });

      expect(container.firstElementChild).toHaveClass('overlay', 'scrollbars', 'vue');
    });

    test('style', async () => {
      const { container, rerender } = render(OverlayScrollbarsComponent, {
        props: {
          style: { width: '22px' },
        },
      });

      expect(container.firstElementChild).toHaveStyle({ width: '22px' });

      await rerender({ style: { height: '33px' } });

      expect(container.firstElementChild).toHaveStyle({ height: '33px' });
    });
  });

  describe('deferred initialization', () => {
    test('basic defer', async () => {
      const { container } = render(<OverlayScrollbarsComponent defer />);
      await nextTick();

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeDefined();
    });

    test('options defer', async () => {
      const { container } = render(<OverlayScrollbarsComponent defer={{ timeout: 0 }} />);
      await nextTick();

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeDefined();
    });

    test('defer with unsupported Idle', async () => {
      const original = window.requestIdleCallback;
      // @ts-ignore
      window.requestIdleCallback = undefined;

      const { container } = render(<OverlayScrollbarsComponent defer />);
      await nextTick();

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeUndefined();

      vi.advanceTimersByTime(2000);

      expect(OverlayScrollbars(container.firstElementChild! as HTMLElement)).toBeDefined();

      window.requestIdleCallback = original;
    });
  });

  test('body', async () => {
    const htmlElement = document.documentElement;
    document.body.remove();

    const { unmount } = render(OverlayScrollbarsComponent, {
      props: {
        element: 'body',
      },
      slots: {
        default: '<section id="body"></section>',
      },
      baseElement: htmlElement,
      container: htmlElement,
    });

    expect(htmlElement).toHaveAttribute('data-overlayscrollbars');
    expect(htmlElement.querySelector('body')).toHaveAttribute('data-overlayscrollbars-initialize');
    expect(htmlElement.querySelector('body')).not.toBeEmptyDOMElement();
    expect(htmlElement.querySelector('body')?.firstElementChild!.tagName).toBe('SECTION');
    expect(htmlElement.querySelector('body')?.firstElementChild).toHaveAttribute('id', 'body');

    unmount();
  });

  test('ref', async () => {
    const osRef = ref();
    const { container } = render({
      setup() {
        const componentRef = ref(null);

        onMounted(() => {
          osRef.value = componentRef.value;
        });

        return () => <OverlayScrollbarsComponent ref={componentRef} />;
      },
    });
    await nextTick();

    const { osInstance, getElement } = osRef.value!;
    expect(osInstance).toBeTypeOf('function');
    expect(getElement).toBeTypeOf('function');
    expect(OverlayScrollbars.valid(osInstance())).toBe(true);
    expect(getElement()).toBe(container.firstElementChild);
  });

  test('options', async () => {
    const osRef = ref();
    const { rerender } = render(
      {
        setup(props: any) {
          const { options } = toRefs(props);
          const componentRef = ref(null);

          onMounted(() => {
            osRef.value = componentRef.value;
          });

          return () => <OverlayScrollbarsComponent options={options} ref={componentRef} />;
        },
      },
      {
        props: {
          options: { paddingAbsolute: true, overflow: { y: 'hidden' } },
        },
      }
    );
    await nextTick();

    const instance = osRef.value!.osInstance()!;

    const opts = instance.options();
    expect(opts.paddingAbsolute).toBe(true);
    expect(opts.overflow.y).toBe('hidden');

    await rerender({ options: { overflow: { x: 'hidden' } } });

    const newOpts = instance.options();
    expect(newOpts.paddingAbsolute).toBe(false); //switches back to default because its not specified in the new options
    expect(newOpts.overflow.x).toBe('hidden');
    expect(newOpts.overflow.y).toBe('scroll'); //switches back to default because its not specified in the new options

    // instance didn't change
    expect(instance).toBe(osRef.value!.osInstance());

    await rerender({ element: 'span', options: { overflow: { x: 'hidden', y: 'hidden' } } });

    const newElementInstance = osRef.value!.osInstance()!;
    const newElementNewOpts = newElementInstance.options();
    expect(newElementInstance).not.toBe(instance);
    expect(newElementNewOpts.paddingAbsolute).toBe(false);
    expect(newElementNewOpts.overflow.x).toBe('hidden');
    expect(newElementNewOpts.overflow.y).toBe('hidden');

    // reset options with `undefined`, `null`, `false` or `{}`
    await rerender({ options: undefined });

    const clearedOpts = newElementInstance.options();
    expect(osRef.value!.osInstance()).toBe(newElementInstance);
    expect(clearedOpts.paddingAbsolute).toBe(false);
    expect(clearedOpts.overflow.x).toBe('scroll');
    expect(clearedOpts.overflow.y).toBe('scroll');
  });

  test('events', async () => {
    const onInitialized = vi.fn();
    const onUpdated = vi.fn();
    const onUpdated2 = vi.fn();
    const osRef = ref();
    const { rerender } = render(
      {
        setup(props: any) {
          const { events } = toRefs(props);
          const componentRef = ref(null);

          onMounted(() => {
            osRef.value = componentRef.value;
          });

          return () => <OverlayScrollbarsComponent options={events} ref={componentRef} />;
        },
      },
      {
        props: {
          events: { initialized: onInitialized },
        },
      }
    );
    await nextTick();

    const instance = osRef.value!.osInstance()!;

    expect(onInitialized).toHaveBeenCalledTimes(1);

    await rerender({ events: { updated: onUpdated } });

    expect(onUpdated).not.toHaveBeenCalled();

    instance.update(true);
    expect(onInitialized).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated2).toHaveBeenCalledTimes(0);

    await rerender({ events: { updated: [onUpdated, onUpdated2] } });

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(2);
    expect(onUpdated2).toHaveBeenCalledTimes(1);

    // unregister with `[]`, `null` or `undefined`
    await rerender({ events: { updated: null } });

    instance.update(true);
    expect(onUpdated).toHaveBeenCalledTimes(2);
    expect(onUpdated2).toHaveBeenCalledTimes(1);

    // instance didn't change
    expect(instance).toBe(osRef.value!.osInstance());

    await rerender({ element: 'span', events: { updated: [onUpdated, onUpdated2] } });

    const newElementInstance = osRef.value!.osInstance()!;
    expect(newElementInstance).not.toBe(instance);
    expect(onUpdated).toHaveBeenCalledTimes(3);
    expect(onUpdated2).toHaveBeenCalledTimes(2);

    // reset events with `undefined`, `null`, `false` or `{}`
    await rerender({ events: undefined });

    newElementInstance.update(true);
    expect(newElementInstance).toBe(osRef.value!.osInstance());
    expect(onInitialized).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(3);
    expect(onUpdated2).toHaveBeenCalledTimes(2);
  });

  test('destroy', async () => {
    const osRef = ref();
    const { unmount } = render({
      setup() {
        const componentRef = ref(null);

        onMounted(() => {
          osRef.value = componentRef.value;
        });

        return () => <OverlayScrollbarsComponent ref={componentRef} />;
      },
    });
    await nextTick();

    const { osInstance } = osRef.value!;

    expect(OverlayScrollbars.valid(osInstance())).toBe(true);

    unmount();

    expect(osInstance()).toBeDefined();
    expect(OverlayScrollbars.valid(osInstance())).toBe(false);
  });

  test('emits', async () => {
    const { emitted, rerender, unmount, container } = render(OverlayScrollbarsComponent);
    await nextTick();

    expect(emitted('osInitialized')).toEqual([[expect.any(Object)]]);
    expect(emitted('osUpdated')).toEqual([[expect.any(Object), expect.any(Object)]]);
    expect(emitted('osDestroyed')).toBeUndefined();
    expect(emitted('osScroll')).toBeUndefined();

    container.querySelectorAll('*').forEach((e) => {
      fireEvent.scroll(e);
    });

    await Promise.resolve();

    expect(emitted('osDestroyed')).toBeUndefined();
    expect(emitted('osScroll')).toEqual([[expect.any(Object), expect.any(Event)]]);

    const initializedCount = emitted('osInitialized').length;
    const updatedCount = emitted('osUpdated').length;

    await rerender({ element: 'span' });

    expect(emitted('osInitialized').length).toBe(initializedCount + 1);
    expect(emitted('osUpdated').length).toBe(updatedCount + 1);

    unmount();

    expect(emitted('osDestroyed')).toEqual([[expect.any(Object), false]]);
  });
});
