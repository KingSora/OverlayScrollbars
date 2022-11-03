import { onMounted, ref, toRefs } from 'vue';
import { describe, test, expect, vitest } from 'vitest';
import { OverlayScrollbars } from 'overlayscrollbars';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { OverlayScrollbarsComponent } from '~/overlayscrollbars-vue';

describe('OverlayScrollbarsComponent', () => {
  describe('correct rendering', () => {
    test('correct root element with instance', async () => {
      const elementA = 'code';
      const elementB = 'span';
      let osInstance;
      const { container, rerender } = render(OverlayScrollbarsComponent);

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

    test('children', () => {
      const { container } = render(OverlayScrollbarsComponent, {
        slots: { default: 'hello <span>vue</span>' },
      });
      expect(screen.getByText(/hello/)).toBeInTheDocument();
      expect(screen.getByText(/vue/)).toBeInTheDocument();
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

  test('ref', () => {
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

    const { instance, element } = osRef.value!;
    expect(instance).toBeTypeOf('function');
    expect(element).toBeTypeOf('function');
    expect(OverlayScrollbars.valid(instance())).toBe(true);
    expect(element()).toBe(container.firstElementChild);
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

    const instance = osRef.value!.instance()!;

    const opts = instance.options();
    expect(opts.paddingAbsolute).toBe(true);
    expect(opts.overflow.y).toBe('hidden');

    await rerender({ options: { overflow: { x: 'hidden' } } });

    const newOpts = instance.options();
    expect(newOpts.paddingAbsolute).toBe(false); //switches back to default because its not specified in the new options
    expect(newOpts.overflow.x).toBe('hidden');
    expect(newOpts.overflow.y).toBe('scroll'); //switches back to default because its not specified in the new options

    // instance didn't change
    expect(instance).toBe(osRef.value!.instance());

    await rerender({ element: 'span', options: { overflow: { x: 'hidden', y: 'hidden' } } });

    const newElementInstance = osRef.value!.instance()!;
    const newElementNewOpts = newElementInstance.options();
    expect(newElementInstance).not.toBe(instance);
    expect(newElementNewOpts.paddingAbsolute).toBe(false);
    expect(newElementNewOpts.overflow.x).toBe('hidden');
    expect(newElementNewOpts.overflow.y).toBe('hidden');

    // reset options with `undefined`, `null`, `false` or `{}`
    await rerender({ options: undefined });

    const clearedOpts = newElementInstance.options();
    expect(osRef.value!.instance()).toBe(newElementInstance);
    expect(clearedOpts.paddingAbsolute).toBe(false);
    expect(clearedOpts.overflow.x).toBe('scroll');
    expect(clearedOpts.overflow.y).toBe('scroll');
  });

  test('events', async () => {
    const onUpdatedInitial = vitest.fn();
    const onUpdated = vitest.fn();
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
          events: { updated: onUpdatedInitial },
        },
      }
    );

    const instance = osRef.value!.instance()!;

    expect(onUpdatedInitial).toHaveBeenCalledTimes(1);

    await rerender({ events: { updated: onUpdated } });

    expect(onUpdated).not.toHaveBeenCalled();

    instance.update(true);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(1);

    await rerender({ events: { updated: [onUpdated, onUpdatedInitial] } });

    instance.update(true);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(2);
    expect(onUpdated).toHaveBeenCalledTimes(2);

    // unregister works with `[]`, `null` or `undefined`
    await rerender({ events: { updated: null } });

    instance.update(true);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(2);
    expect(onUpdated).toHaveBeenCalledTimes(2);

    // instance didn't change
    expect(instance).toBe(osRef.value!.instance());

    await rerender({ element: 'span', events: { updated: [onUpdated, onUpdatedInitial] } });

    const newElementInstance = osRef.value!.instance()!;
    expect(newElementInstance).not.toBe(instance);
    expect(onUpdatedInitial).toHaveBeenCalledTimes(3);
    expect(onUpdated).toHaveBeenCalledTimes(3);

    // reset events with `undefined`, `null`, `false` or `{}`
    await rerender({ events: undefined });

    newElementInstance.update(true);
    expect(newElementInstance).toBe(osRef.value!.instance());
    expect(onUpdatedInitial).toHaveBeenCalledTimes(3);
    expect(onUpdated).toHaveBeenCalledTimes(3);
  });
});
