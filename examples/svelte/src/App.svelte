<script lang="ts">
  import { OverlayScrollbarsComponent, useOverlayScrollbars } from 'overlayscrollbars-svelte';
  import { onMount } from 'svelte';
  import { useEventObserver } from './useEventObserver.svelte';

  let osRef: OverlayScrollbarsComponent | undefined = $state();
  let contentHidden = $state(false);
  let elementHidden = $state(false);
  let overlayScrollbarsApplied = $state(true);
  let bodyOverlayScrollbarsApplied: boolean | null = $state(null);
  const [activeEvents, activateEvent] = useEventObserver();
  const [initBodyOverlayScrollbars, getBodyOverlayScrollbarsInstance] = useOverlayScrollbars({
    defer: true,
    events: {
      initialized: () => {
        bodyOverlayScrollbarsApplied = true;
      },
      destroyed: () => {
        bodyOverlayScrollbarsApplied = false;
      },
    },
    options: {
      scrollbars: {
        theme: 'os-theme-light',
        clickScroll: true,
      },
    },
  });

  const scrollContent = () => {
    const osInstance = osRef?.osInstance();

    if (!osInstance) {
      return;
    }

    const { overflowAmount } = osInstance.state();
    const { scrollOffsetElement } = osInstance.elements();
    const { scrollLeft, scrollTop } = scrollOffsetElement;

    scrollOffsetElement.scrollTo({
      behavior: 'smooth',
      left: Math.round((overflowAmount.x - scrollLeft) / overflowAmount.x) * overflowAmount.x,
      top: Math.round((overflowAmount.y - scrollTop) / overflowAmount.y) * overflowAmount.y,
    });
  };
  const toggleContent = () => {
    contentHidden = !contentHidden;
  };
  const toggleElement = () => {
    elementHidden = !elementHidden;
  };
  const toggleBodyOverlayScrollbars = () => {
    const bodyOsInstance = getBodyOverlayScrollbarsInstance();

    if (bodyOsInstance && !bodyOsInstance.state().destroyed) {
      bodyOsInstance.destroy();
    } else {
      initBodyOverlayScrollbars({
        target: document.body,
        cancel: {
          body: false,
        },
      });
    }
  };

  onMount(() => {
    initBodyOverlayScrollbars(document.body);
  });
</script>

<main>
  <h1>
    <a href="https://www.npmjs.com/package/overlayscrollbars-svelte" target="_blank">
      OverlayScrollbars Svelte
    </a>
  </h1>
  <section>
    {#if overlayScrollbarsApplied}
      <OverlayScrollbarsComponent
        bind:this={osRef}
        class="overlayscrollbars-svelte"
        style={elementHidden ? 'display: none' : undefined}
        options={{ scrollbars: { theme: 'os-theme-light' } }}
        events={{
          initialized: () => activateEvent('initialized'),
          destroyed: () => activateEvent('destroyed'),
          updated: () => activateEvent('updated'),
          scroll: () => activateEvent('scroll'),
        }}
        defer
      >
        {#if !contentHidden}
          <div class="logo">
            <img alt="Svelte logo" src="logo.svg" />
          </div>
        {/if}
      </OverlayScrollbarsComponent>
    {:else}
      <div class="overlayscrollbars-svelte">
        <div class="logo">
          <img alt="Svelte logo" src="logo.svg" />
        </div>
      </div>
    {/if}
  </section>
  <section>
    <p class="title">Actions:</p>
    <div class="items">
      {#if overlayScrollbarsApplied}
        <button onclick={scrollContent}>Scroll</button>
        <button onclick={toggleContent}>{contentHidden ? 'Show' : 'Hide'} Content</button>
        <button onclick={toggleElement}>{elementHidden ? 'Show' : 'Hide'} Element</button>
      {/if}
      <button
        onclick={() => {
          overlayScrollbarsApplied = !overlayScrollbarsApplied;
        }}
      >
        {overlayScrollbarsApplied ? 'Destroy' : 'Initialize'} OverlayScrollbars
      </button>
    </div>
  </section>
  <section>
    <p class="title">Events:</p>
    <div class="items">
      {#each Object.entries(activeEvents()) as [eventName, event]}
        <div class={`event ${event.active ? 'active' : ''}`}>
          {eventName} ({event.count})
        </div>
      {/each}
    </div>
  </section>
</main>
<footer>
  {#if bodyOverlayScrollbarsApplied !== null}
    <section>
      <div class="items">
        <button onclick={toggleBodyOverlayScrollbars}>
          {bodyOverlayScrollbarsApplied ? 'Destroy' : 'Initialize'} Body OverlayScrollbars
        </button>
      </div>
    </section>
  {/if}
  <a
    href="https://github.com/KingSora/OverlayScrollbars/tree/master/examples/svelte"
    target="_blank"
  >
    Open source code of this example.
  </a>
</footer>
