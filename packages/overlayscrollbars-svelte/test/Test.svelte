<script lang="ts">
  import { OverlayScrollbarsComponent } from '~/index';
  let children = 1;
  let ref: any;
  
  export let element: any = 'div'; 
  export let options: any = undefined; 
  export let events: any = undefined; 
  export let getRef: any = undefined;
  export let initialized: any = undefined;
  export let updated: any = undefined;
  export let destroyed: any = undefined;
  export let scroll: any = undefined;
  export let className: any = undefined;
  export let style: any = undefined;

  const propsChange = (e: any) => {
    const optionsChanged = Object.prototype.hasOwnProperty.call(e.detail, 'options');
    const eventsChanged = Object.prototype.hasOwnProperty.call(e.detail, 'events');
    const elementChanged = Object.prototype.hasOwnProperty.call(e.detail, 'element');
    const classChanged = Object.prototype.hasOwnProperty.call(e.detail, 'className');
    const styleChanged = Object.prototype.hasOwnProperty.call(e.detail, 'style');
    if (optionsChanged) {
      options = e.detail.options;
    }
    if (eventsChanged) {
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

  $: {
    getRef?.(ref);
  }
</script>

<OverlayScrollbarsComponent 
  bind:this={ref} 
  element={element} 
  options={options} 
  events={events}
  class={className}
  style={style}
  on:osInitialized={initialized}
  on:osUpdated={updated}
  on:osDestroyed={destroyed}
  on:osScroll={scroll}>
  hello <span>svelte</span>
  {#if children === 0}<div>empty</div>{/if}
  {#each [...Array(children).keys()] as child}
		<section>{child}</section>
	{/each}
</OverlayScrollbarsComponent>
<button id="add" on:click={() => children++}>add</button>
<button id="remove" on:click={() => children--}>remove</button>
<optionsChange on:osProps={propsChange}>
  props
</optionsChange>