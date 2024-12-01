<script lang="ts">
  import { OverlayScrollbars, type EventListenerArgs } from 'overlayscrollbars';
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
  import { onMount } from 'svelte';

  type OverlayScrollbarsEvents = keyof EventListenerArgs;

  interface EventObserverEvent {
    active: boolean;
    count: number;
  }

  let osRef: OverlayScrollbarsComponent | undefined;
  let contentHidden = false;
  let elementHidden = false;
  let useOverlayScrollbars = true;
  let useBodyOverlayScrollbars: boolean | null = null;

  let activeEventsArray: OverlayScrollbarsEvents[] = [];
  const eventCount: Partial<Record<OverlayScrollbarsEvents, number>> = {};
  const timeoutIds: Partial<Record<OverlayScrollbarsEvents, ReturnType<typeof setTimeout>>> = {};

  const activateEvent = (event: OverlayScrollbarsEvents) => {
    const currAmount = eventCount[event];
    eventCount[event] = typeof currAmount === 'number' ? currAmount + 1 : 1;

    activeEventsArray = Array.from(new Set([...activeEventsArray, event]));

    clearTimeout(timeoutIds[event]);
    timeoutIds[event] = setTimeout(() => {
      const currActiveEventsSet = new Set(activeEventsArray);
      currActiveEventsSet.delete(event);

      activeEventsArray = Array.from(currActiveEventsSet);
    }, 500);
  };

  const getEventObj = (
    activeEventsArr: OverlayScrollbarsEvents[],
    event: OverlayScrollbarsEvents
  ): EventObserverEvent => ({
    active: activeEventsArr.includes(event),
    count: eventCount[event] || 0,
  });

  $: activeEvents = {
    initialized: getEventObj(activeEventsArray, 'initialized'),
    destroyed: getEventObj(activeEventsArray, 'destroyed'),
    updated: getEventObj(activeEventsArray, 'updated'),
    scroll: getEventObj(activeEventsArray, 'scroll'),
  };

  const initBodyOverlayScrollbars = (force?: boolean) =>
    OverlayScrollbars(
      {
        target: document.body,
        cancel: {
          body: force ? false : null,
        },
      },
      {
        scrollbars: {
          theme: 'os-theme-light',
          clickScroll: true,
        },
      }
    ).state().destroyed;

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
    const bodyOsInstance = OverlayScrollbars(document.body);
    if (bodyOsInstance) {
      bodyOsInstance.destroy();
      useBodyOverlayScrollbars = false;
    } else {
      useBodyOverlayScrollbars = !initBodyOverlayScrollbars(true);
    }
  };

  onMount(async () => {
    useBodyOverlayScrollbars = !initBodyOverlayScrollbars();
  });
</script>

<main>
  <h1>
    <a href="https://www.npmjs.com/package/overlayscrollbars-svelte" target="_blank">
      OverlayScrollbars Svelte
    </a>
  </h1>
  <section>
    {#if useOverlayScrollbars}
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
      {#if useOverlayScrollbars}
        <button on:click={scrollContent}>Scroll</button>
        <button on:click={toggleContent}>{contentHidden ? 'Show' : 'Hide'} Content</button>
        <button on:click={toggleElement}>{elementHidden ? 'Show' : 'Hide'} Element</button>
      {/if}
      <button
        on:click={() => {
          useOverlayScrollbars = !useOverlayScrollbars;
        }}
      >
        {useOverlayScrollbars ? 'Destroy' : 'Initialize'} OverlayScrollbars
      </button>
    </div>
  </section>
  <section>
    <p class="title">Events:</p>
    <div class="items">
      {#each Object.entries(activeEvents) as [eventName, event]}
        <div class={`event ${event.active ? 'active' : ''}`}>
          {eventName} ({event.count})
        </div>
      {/each}
    </div>
  </section>
</main>
<footer>
  {#if useBodyOverlayScrollbars !== null}
    <section>
      <div class="items">
        <button on:click={toggleBodyOverlayScrollbars}>
          {useBodyOverlayScrollbars ? 'Destroy' : 'Initialize'} Body OverlayScrollbars
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
