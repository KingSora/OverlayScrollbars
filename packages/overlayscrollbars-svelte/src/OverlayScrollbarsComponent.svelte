<script lang="ts" generics="T extends ValidSvelteElement = 'div'">
  import { createEventDispatcher } from 'svelte';
  import type { EventListeners, EventListenerArgs } from 'overlayscrollbars';
  import type {
    OverlayScrollbarsComponentProps,
    OverlayScrollbarsComponentRef,
    ValidSvelteHTMLElement,
    ValidSvelteElement,
    ValidSvelteComponent,
  } from './OverlayScrollbarsComponent.types';
  import { useOverlayScrollbars } from './useOverlayScrollbars.svelte';

  const {
    // @ts-ignore
    element = 'div',
    options,
    events,
    defer,
    children,
    ...other
  }: OverlayScrollbarsComponentProps<T> = $props();

  let elementRef:
    | (T extends ValidSvelteComponent ? ReturnType<ValidSvelteComponent> : HTMLElement)
    | undefined = $state();
  let slotRef: HTMLElement | undefined = $state();

  const elementRefHtmlElement = $derived.by(() => {
    if (!elementRef) {
      return;
    }
    if (elementRef instanceof HTMLElement) {
      return elementRef;
    }
    try {
      // if component doesn't export `getElement` function an error is thrown
      return elementRef.getElement() as HTMLElement | undefined;
    } catch {}
  });
  const dispatchEvents: {
    [N in keyof EventListenerArgs]: `os${Capitalize<N>}`;
  } = {
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
  const eventsWithDispatch = $derived(
    (Object.keys(dispatchEvents) as (keyof EventListeners)[]).reduce<EventListeners>(
      <N extends keyof EventListeners>(obj: EventListeners, name: N) => {
        const eventListener = (events || {})[name];
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
      },
      {}
    )
  );

  const [initialize, instance] = useOverlayScrollbars({
    options: () => options,
    events: () => eventsWithDispatch,
    defer: () => defer,
  });

  $effect(() => {
    /* c8 ignore start */
    if (!elementRefHtmlElement) {
      return;
    }
    /* c8 ignore end */

    initialize(
      element === 'body'
        ? {
            target: elementRefHtmlElement,
            cancel: {
              body: null,
            },
          }
        : {
            target: elementRefHtmlElement,
            elements: {
              viewport: slotRef,
              content: slotRef,
            },
          }
    );

    return () => {
      instance()?.destroy();
    };
  });

  export const osInstance: OverlayScrollbarsComponentRef<T>['osInstance'] = instance;
  export const getElement: OverlayScrollbarsComponentRef<T>['getElement'] = () =>
    (elementRefHtmlElement as ValidSvelteHTMLElement<T> | undefined) || null;
</script>

{#snippet content()}
  {#if element === 'body'}
    {@render children?.()}
  {:else}
    <div data-overlayscrollbars-contents="" bind:this={slotRef}>
      {@render children?.()}
    </div>
  {/if}
{/snippet}

{#if typeof element === 'string'}
  <svelte:element
    this={element}
    data-overlayscrollbars-initialize=""
    bind:this={elementRef}
    {...other}
  >
    {@render content()}
  </svelte:element>
{:else}
  {@const Tag = element as ValidSvelteComponent}
  <Tag data-overlayscrollbars-initialize="" bind:this={elementRef as any} {...other}>
    {@render content()}
  </Tag>
{/if}
