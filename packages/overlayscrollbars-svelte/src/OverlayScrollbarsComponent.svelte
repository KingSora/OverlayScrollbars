<script lang="ts">
  import { afterUpdate, createEventDispatcher, onDestroy } from 'svelte';
  import { OverlayScrollbars } from 'overlayscrollbars';
  import { createDefer } from './createDefer';
  import type { EventListeners, EventListenerArgs } from 'overlayscrollbars';
  import type { Props, Ref } from './OverlayScrollbarsComponent.types';

  type EmitEventsMap = {
    [N in keyof EventListenerArgs]: `os${Capitalize<N>}`;
  };

  export let element: Props['element'] = 'div';
  export let options: Props['options'] = undefined;
  export let events: Props['events'] = undefined;
  export let defer: Props['defer'] = undefined;

  let instance: OverlayScrollbars | null = null;
  let elementRef: HTMLElement | null = null;
  let slotRef: HTMLElement | null = null;
  let combinedEvents: Props['events'] = undefined;
  let prevElement: string | undefined;

  const [requestDefer, cancelDefer] = createDefer();

  const initialize = () => {
    const init = () => {
      const target = elementRef;

      if (!target) {
        return;
      }

      instance?.destroy();
      instance = OverlayScrollbars(
        element === 'body'
          ? {
              target,
              cancel: {
                body: null,
              },
            }
          : {
              target,
              elements: {
                viewport: slotRef,
                content: slotRef,
              },
            },
        options || {},
        combinedEvents || {}
      );
    };

    if (defer) {
      requestDefer(init, defer);
    } else {
      init();
    }

    prevElement = element;
  };
  const dispatchEvents: EmitEventsMap = {
    initialized: 'osInitialized',
    updated: 'osUpdated',
    destroyed: 'osDestroyed',
    scroll: 'osScroll',
  };
  const dispatchEvent = createEventDispatcher<{
    osInitialized: EventListenerArgs['initialized'];
    osUpdated: EventListenerArgs['updated'];
    osDestroyed: EventListenerArgs['destroyed'];
    osScroll: EventListenerArgs['scroll'];
  }>();

  export const osInstance: Ref['osInstance'] = () => instance;
  export const getElement: Ref['getElement'] = () => elementRef;

  onDestroy(() => {
    cancelDefer();
    instance?.destroy();
  });

  afterUpdate(() => {
    if (prevElement !== element) {
      initialize();
    }
  });

  $: {
    const currEvents = events || {};
    combinedEvents = (
      Object.keys(dispatchEvents) as (keyof EventListeners)[]
    ).reduce<EventListeners>(<N extends keyof EventListeners>(obj: EventListeners, name: N) => {
      const eventListener = currEvents[name];
      obj[name] = [
        (...args: EventListenerArgs[N]) =>
          dispatchEvent(
            // @ts-ignore
            dispatchEvents[name],
            // @ts-ignore
            args
          ),
        ...(Array.isArray(eventListener) ? eventListener : [eventListener]).filter(Boolean),
      ];
      return obj;
    }, {});
  }

  $: {
    if (OverlayScrollbars.valid(instance)) {
      instance.options(options || {}, true);
    }
  }

  $: {
    if (OverlayScrollbars.valid(instance)) {
      instance.on(
        /* c8 ignore next */
        combinedEvents || {},
        true
      );
    }
  }
</script>

<svelte:element
  this={element}
  data-overlayscrollbars-initialize=""
  bind:this={elementRef}
  {...$$restProps}
>
  {#if element === 'body'}
    <slot />
  {:else}
    <div data-overlayscrollbars-contents="" bind:this={slotRef}>
      <slot />
    </div>
  {/if}
</svelte:element>
