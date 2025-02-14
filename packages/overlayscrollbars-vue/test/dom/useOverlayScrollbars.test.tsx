import { reactive, onMounted, ref, toRaw } from 'vue';
import { describe, test, afterEach, expect, vitest } from 'vitest';
import { render, screen, cleanup } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { PartialOptions, EventListeners } from 'overlayscrollbars';
import { useOverlayScrollbars } from '../../src/overlayscrollbars-vue';

describe('useOverlayScrollbars', () => {
  afterEach(() => {
    try {
      cleanup();
    } catch {}
  });

  test('re-initialization', async () => {
    const { unmount } = render({
      setup() {
        const instanceRef = ref<OverlayScrollbars | null>(null);
        const [initialize, instance] = useOverlayScrollbars();

        return () => (
          <>
            <button
              onClick={(event) => {
                initialize(event.target as HTMLElement);
                if (instanceRef.value) {
                  expect(toRaw(instanceRef.value)).toBe(instance());
                }
                instanceRef.value = instance();
                expect(toRaw(instanceRef.value)).toBe(instance());
              }}
            >
              initialize
            </button>
          </>
        );
      },
    });

    const initializeBtn = screen.getByRole('button');
    await userEvent.click(initializeBtn);
    // taking snapshot here wouldn't be equal because of "tabindex" attribute of the viewport element
    await userEvent.click(initializeBtn);
    const snapshot = initializeBtn.innerHTML;
    await userEvent.click(initializeBtn);

    expect(snapshot).toBe(initializeBtn.innerHTML);

    expect(OverlayScrollbars(initializeBtn)).toBeDefined();

    unmount();

    expect(OverlayScrollbars(initializeBtn)).toBeUndefined();
  });

  test('reactive params', async () => {
    let osInstance: OverlayScrollbars | null;
    const onUpdated = vitest.fn();
    const { unmount } = render({
      setup() {
        const div = ref<HTMLElement | null>(null);
        const params = reactive<{ options?: PartialOptions; events?: EventListeners }>({});
        const [initialize, instance] = useOverlayScrollbars(params);

        onMounted(() => {
          initialize({ target: div.value! });
          osInstance = instance();
        });

        return () => (
          <>
            <div ref={div} />
            <button
              onClick={() => {
                params.events = {};
                params.events!.updated = onUpdated;
                params.options = {};
                params.options!.paddingAbsolute = true;
              }}
            >
              trigger
            </button>
          </>
        );
      },
    });

    expect(onUpdated).not.toHaveBeenCalled();

    const triggerBtn = screen.getByRole('button');
    await userEvent.click(triggerBtn);

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(osInstance!.options().paddingAbsolute).toBe(true);

    unmount();
  });

  test('ref params', async () => {
    let osInstance: OverlayScrollbars | null;
    const onUpdated = vitest.fn();
    const { unmount } = render({
      setup() {
        const div = ref<HTMLElement | null>(null);
        const params = ref<{ options?: PartialOptions; events?: EventListeners } | undefined>();
        const [initialize, instance] = useOverlayScrollbars(params);

        onMounted(() => {
          initialize({ target: div.value! });
          osInstance = instance();
        });

        return () => (
          <>
            <div ref={div} />
            <button
              onClick={() => {
                params.value = {};
                params.value.options = {};
                params.value.events = {};
                params.value.options.paddingAbsolute = true;
                params.value.events.updated = onUpdated;
              }}
            >
              trigger
            </button>
          </>
        );
      },
    });

    expect(onUpdated).not.toHaveBeenCalled();

    const triggerBtn = screen.getByRole('button');
    await userEvent.click(triggerBtn);

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(osInstance!.options().paddingAbsolute).toBe(true);

    unmount();
  });

  test('ref params fields', async () => {
    let osInstance: OverlayScrollbars | null;
    const onUpdated = vitest.fn();
    const { unmount } = render({
      setup() {
        const div = ref<HTMLElement | null>(null);
        const options = ref<PartialOptions | undefined>();
        const events = ref<EventListeners | undefined>();
        const defer = ref<boolean | undefined>();
        const [initialize, instance] = useOverlayScrollbars({
          options,
          events,
          defer,
        });

        onMounted(() => {
          initialize({ target: div.value! });
          osInstance = instance();
        });

        return () => (
          <>
            <div ref={div} />
            <button
              onClick={() => {
                events.value = {};
                events.value.updated = onUpdated;
                options.value = {};
                options.value.paddingAbsolute = true;
              }}
            >
              trigger
            </button>
          </>
        );
      },
    });

    expect(onUpdated).not.toHaveBeenCalled();

    const triggerBtn = screen.getByRole('button');
    await userEvent.click(triggerBtn);

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(osInstance!.options().paddingAbsolute).toBe(true);

    unmount();
  });
});
