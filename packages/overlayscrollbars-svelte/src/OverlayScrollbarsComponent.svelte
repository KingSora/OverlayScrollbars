<script lang="ts">
  import { onMount, afterUpdate, createEventDispatcher, onDestroy } from 'svelte';
  import { OverlayScrollbars } from 'overlayscrollbars';
  import { createDefer } from './createDefer';
  import type { EventListeners, EventListenerArgs } from 'overlayscrollbars';
  import type { OverlayScrollbarsComponentProps$, OverlayScrollbarsComponentRef$ } from './OverlayScrollbarsComponent.types';

  type EmitEventsMap = {
    [N in keyof EventListenerArgs]: `os${Capitalize<N>}`;
  };

  export let element: OverlayScrollbarsComponentProps$["element"] = 'div';
  export let options: OverlayScrollbarsComponentProps$["options"] = undefined;
  export let events: OverlayScrollbarsComponentProps$["events"] = undefined;
  export let defer: OverlayScrollbarsComponentProps$["defer"] = undefined;

  let instance: OverlayScrollbars | null = null;
  let elementRef: HTMLElement | null = null;
  let slotRef: HTMLElement | null = null;
  let combinedEvents: OverlayScrollbarsComponentProps$["events"] = undefined;
  let prevElement: string | undefined;

  const [requestDefer, cancelDefer] = createDefer();

  const initialize = () => {
    const init = () => {
      instance?.destroy();
      instance = OverlayScrollbars(
        { 
          target: elementRef!, 
          elements: {
            viewport: slotRef,
            content: slotRef
          } 
        }, 
        options || {}, 
        combinedEvents || {}
      );
    };
    
    if (defer) {
      requestDefer(init, defer);
    }
    else {
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
    osInitialized: EventListenerArgs["initialized"];
    osUpdated: EventListenerArgs["updated"];
    osDestroyed: EventListenerArgs["destroyed"];
    osScroll: EventListenerArgs["scroll"];
  }>();

  export const osInstance: OverlayScrollbarsComponentRef$["osInstance"] = () => instance;
  export const getElement: OverlayScrollbarsComponentRef$["getElement"] = () => elementRef;

  onMount(initialize);

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

<svelte:element data-overlayscrollbars-initialize="" this={element} bind:this={elementRef} {...$$restProps}>
  <div bind:this={slotRef}>
    <slot></slot>
  </div>
</svelte:element>