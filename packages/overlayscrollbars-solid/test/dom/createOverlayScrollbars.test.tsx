import { describe, test, afterEach, expect, vitest } from 'vitest';
import { createSignal, createEffect, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render, screen, cleanup } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { PartialOptions, EventListeners } from 'overlayscrollbars';
import { createOverlayScrollbars } from '../../src/overlayscrollbars-solid';

describe('OverlayScrollbarsComponent', () => {
  afterEach(() => cleanup());

  test('re-initialization', async () => {
    const Test = () => {
      let instanceRef: OverlayScrollbars | null = null;
      const [initialize, instance] = createOverlayScrollbars();
      return (
        <>
          <button
            onClick={(event) => {
              initialize(event.target as HTMLElement);
              if (instanceRef) {
                expect(instanceRef).toBe(instance());
              }
              instanceRef = instance();
              expect(instanceRef).toBe(instance());
            }}
          >
            initialize
          </button>
        </>
      );
    };

    const { unmount } = render(Test);

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

  test('params store', async () => {
    let osInstance: OverlayScrollbars | null;
    const onUpdated = vitest.fn();
    render(() => {
      let div: HTMLDivElement | undefined;
      const [params, setParams] = createStore<{
        options?: PartialOptions;
        events?: EventListeners;
      }>({});
      const [initialize, instance] = createOverlayScrollbars(params);

      onMount(() => {
        initialize({ target: div! });
        osInstance = instance();
      });

      createEffect(() => {
        if (params.events?.updated) {
          instance()?.update(true);
        }
      });

      return (
        <>
          <div ref={div} />
          <button
            onClick={() => {
              setParams({
                options: { paddingAbsolute: true },
                events: { updated: onUpdated },
              });
            }}
          >
            trigger
          </button>
        </>
      );
    });

    expect(onUpdated).not.toHaveBeenCalled();

    const triggerBtn = screen.getByRole('button');
    await userEvent.click(triggerBtn);

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(osInstance!.options().paddingAbsolute).toBe(true);
  });

  test('params signal', async () => {
    let osInstance: OverlayScrollbars | null;
    const onUpdated = vitest.fn();
    render(() => {
      let div: HTMLDivElement | undefined;
      const [params, setParams] = createSignal<{
        options?: PartialOptions;
        events?: EventListeners;
      }>({});
      const [initialize, instance] = createOverlayScrollbars(params);

      onMount(() => {
        initialize({ target: div! });
        osInstance = instance();
      });

      createEffect(() => {
        if (params().events?.updated) {
          instance()?.update(true);
        }
      });

      return (
        <>
          <div ref={div} />
          <button
            onClick={() => {
              setParams({
                options: { paddingAbsolute: true },
                events: { updated: onUpdated },
              });
            }}
          >
            trigger
          </button>
        </>
      );
    });

    expect(onUpdated).not.toHaveBeenCalled();

    const triggerBtn = screen.getByRole('button');
    await userEvent.click(triggerBtn);

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(osInstance!.options().paddingAbsolute).toBe(true);
  });

  test('params fields signal', async () => {
    let osInstance: OverlayScrollbars | null;
    const onUpdated = vitest.fn();
    render(() => {
      let div: HTMLDivElement | undefined;
      const [options, setOptions] = createSignal<PartialOptions | undefined>();
      const [events, setEvents] = createSignal<EventListeners | undefined>();
      const [initialize, instance] = createOverlayScrollbars({
        options,
        events,
      });

      onMount(() => {
        initialize({ target: div! });
        osInstance = instance();
      });

      createEffect(() => {
        if (events()?.updated) {
          instance()?.update(true);
        }
      });

      return (
        <>
          <div ref={div} />
          <button
            onClick={() => {
              setOptions({ paddingAbsolute: true });
              setEvents({ updated: onUpdated });
            }}
          >
            trigger
          </button>
        </>
      );
    });

    expect(onUpdated).not.toHaveBeenCalled();

    const triggerBtn = screen.getByRole('button');
    await userEvent.click(triggerBtn);

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(osInstance!.options().paddingAbsolute).toBe(true);
  });
});
