<script lang="ts">
  import { type ComponentProps } from 'svelte';
  import { OverlayScrollbarsComponent } from '../../src/overlayscrollbars-svelte';
  let ref: any = $state();
  let childrenCount = $state(1);

  let {
    element,
    options,
    events,
    defer,
    getRef,
    initialized,
    updated,
    destroyed,
    scroll,
    className,
    style,
  }: ComponentProps<OverlayScrollbarsComponent> & {
    getRef?: (...args: any[]) => void;
    initialized?: Exclude<
      ComponentProps<OverlayScrollbarsComponent>['events'],
      false | null | undefined
    >['initialized'];
    updated?: Exclude<
      ComponentProps<OverlayScrollbarsComponent>['events'],
      false | null | undefined
    >['updated'];
    destroyed?: Exclude<
      ComponentProps<OverlayScrollbarsComponent>['events'],
      false | null | undefined
    >['destroyed'];
    scroll?: Exclude<
      ComponentProps<OverlayScrollbarsComponent>['events'],
      false | null | undefined
    >['scroll'];
    className?: string;
  } = $props();

  const propsChange = (e: any) => {
    const optionsChanged = Object.prototype.hasOwnProperty.call(e.detail, 'options');
    const eventsChanged = Object.prototype.hasOwnProperty.call(e.detail, 'events');
    const deferChanged = Object.prototype.hasOwnProperty.call(e.detail, 'defer');
    const elementChanged = Object.prototype.hasOwnProperty.call(e.detail, 'element');
    const classChanged = Object.prototype.hasOwnProperty.call(e.detail, 'className');
    const styleChanged = Object.prototype.hasOwnProperty.call(e.detail, 'style');
    if (optionsChanged) {
      options = e.detail.options;
    }
    if (eventsChanged) {
      events = e.detail.events;
    }
    if (deferChanged) {
      events = e.detail.events;
    }
    if (elementChanged) {
      element = e.detail.element;
    }
    if (classChanged) {
      className = e.detail.className;
    }
    if (styleChanged) {
      style = e.detail.style;
    }
  };

  $effect(() => {
    getRef?.(ref);
  });
</script>

<OverlayScrollbarsComponent
  bind:this={ref}
  {element}
  {options}
  {defer}
  {events}
  class={className}
  {style}
  on:osInitialized={initialized as any}
  on:osUpdated={updated as any}
  on:osDestroyed={destroyed as any}
  on:osScroll={scroll as any}
>
  hello <span>svelte</span>
  {#if childrenCount === 0}<div>empty</div>{/if}
  {#each [...Array(childrenCount).keys()] as child}
    <section>{child}</section>
  {/each}
</OverlayScrollbarsComponent>
<button id="add" onclick={() => childrenCount++}>add</button>
<button id="remove" onclick={() => childrenCount--}>remove</button>
<optionsChange onosProps={propsChange}> props </optionsChange>
