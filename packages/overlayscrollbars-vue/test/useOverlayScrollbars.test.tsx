import { reactive, onMounted, ref, watch, toRaw, watchPostEffect } from 'vue';
import { describe, test, expect, vitest } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { useOverlayScrollbars } from '~/overlayscrollbars-vue';
import type { PartialOptions, EventListeners, OverlayScrollbars } from 'overlayscrollbars';

describe('useOverlayScrollbars', () => {
  test('re-initialization', () => {
    const { unmount } = render({
      setup() {
        const instanceRef = ref<OverlayScrollbars | null>(null);
        const [initialize, instance] = useOverlayScrollbars();

        return () => (
          <>
            <button
              onClick={(event) => {
                const osInstance = initialize(event.target as HTMLElement);
                if (instanceRef.value) {
                  expect(toRaw(instanceRef.value)).toBe(osInstance);
                  expect(toRaw(instanceRef.value)).toBe(instance());
                }
                instanceRef.value = osInstance;
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
    userEvent.click(initializeBtn);
    // taking snapshot here wouldn't be equal because of "tabindex" attribute of the viewport element
    userEvent.click(initializeBtn);
    const snapshot = initializeBtn.innerHTML;
    userEvent.click(initializeBtn);

    expect(snapshot).toBe(initializeBtn.innerHTML);
    unmount();
  });

  test('reactive params', async () => {
    let osInstance: OverlayScrollbars;
    const onUpdated = vitest.fn();
    const { unmount } = render({
      setup() {
        const div = ref<HTMLElement | null>(null);
        const params = reactive<{ options?: PartialOptions; events?: EventListeners }>({});
        const [initialize, instance] = useOverlayScrollbars(params);

        onMounted(() => {
          osInstance = initialize({ target: div.value! });
        });

        watch(
          () => params,
          () => {
            if (params.events!.updated) {
              instance()?.update(true);
            }
          },
          { deep: true }
        );

        return () => (
          <>
            <div ref={div} />
            <button
              onClick={() => {
                params.options = {};
                params.events = {};
                params.options!.paddingAbsolute = true;
                params.events!.updated = onUpdated;
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
    let osInstance: OverlayScrollbars;
    const onUpdated = vitest.fn();
    const { unmount } = render({
      setup() {
        const div = ref<HTMLElement | null>(null);
        const params = ref<{ options?: PartialOptions; events?: EventListeners }>({});
        const [initialize, instance] = useOverlayScrollbars(params);

        onMounted(() => {
          osInstance = initialize({ target: div.value! });
        });

        watchPostEffect(() => {
          if (params.value.events?.updated) {
            instance()?.update(true);
          }
        });

        return () => (
          <>
            <div ref={div} />
            <button
              onClick={() => {
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
    let osInstance: OverlayScrollbars;
    const onUpdated = vitest.fn();
    const { unmount } = render({
      setup() {
        const div = ref<HTMLElement | null>(null);
        const options = ref<PartialOptions | undefined>();
        const events = ref<EventListeners | undefined>();
        const [initialize, instance] = useOverlayScrollbars({
          options,
          events,
        });

        onMounted(() => {
          osInstance = initialize({ target: div.value! });
        });

        watchPostEffect(() => {
          if (events.value?.updated) {
            instance()?.update(true);
          }
        });

        return () => (
          <>
            <div ref={div} />
            <button
              onClick={() => {
                options.value = {};
                events.value = {};
                options.value.paddingAbsolute = true;
                events.value.updated = onUpdated;
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
