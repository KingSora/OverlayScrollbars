import { OverlayScrollbarsComponent, createOverlayScrollbars } from 'overlayscrollbars-solid';
import { createSignal, type Component, onMount } from 'solid-js';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-solid';
import { createEventObserver } from './createEventObserver';

const content = (
  <div class="logo">
    <img alt="Solid logo" src="logo.svg" />
  </div>
);

const App: Component = () => {
  let osRef: OverlayScrollbarsComponentRef;
  const [contentHidden, setContentHidden] = createSignal(false);
  const [elementHidden, setElementHidden] = createSignal(false);
  const [overlayScrollbarsApplied, setOverlayScrollbarsApplied] = createSignal(true);
  const [bodyOverlayScrollbarsApplied, setBodyOverlayScrollbarsApplied] = createSignal<
    boolean | null
  >(null);
  const [initBodyOverlayScrollbars, getBodyOverlayScrollbarsInstance] = createOverlayScrollbars({
    defer: true,
    events: {
      initialized: () => {
        setBodyOverlayScrollbarsApplied(true);
      },
      destroyed: () => {
        setBodyOverlayScrollbarsApplied(false);
      },
    },
    options: {
      scrollbars: {
        theme: 'os-theme-light',
        clickScroll: true,
      },
    },
  });
  const [activeEvents, activateEvent] = createEventObserver();

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
  const toggleContent = () => setContentHidden((curr) => !curr);
  const toggleElement = () => setElementHidden((curr) => !curr);
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

  return (
    <>
      <main>
        <h1>
          <a href="https://www.npmjs.com/package/overlayscrollbars-solid" target="_blank">
            OverlayScrollbars Solid
          </a>
        </h1>
        <section>
          {overlayScrollbarsApplied() ? (
            <OverlayScrollbarsComponent
              class="overlayscrollbars-solid"
              style={{ display: elementHidden() ? 'none' : undefined }}
              ref={(value) => {
                osRef = value;
              }}
              options={{ scrollbars: { theme: 'os-theme-light' } }}
              events={{
                initialized: () => activateEvent('initialized'),
                destroyed: () => activateEvent('destroyed'),
                updated: () => activateEvent('updated'),
                scroll: () => activateEvent('scroll'),
              }}
              defer
            >
              {!contentHidden() && content}
            </OverlayScrollbarsComponent>
          ) : (
            <div class="overlayscrollbars-solid">{content}</div>
          )}
        </section>
        <section>
          <p class="title">Actions:</p>
          <div class="items">
            {overlayScrollbarsApplied() && (
              <>
                <button onClick={scrollContent}>Scroll</button>
                <button onClick={toggleContent}>{contentHidden() ? 'Show' : 'Hide'} Content</button>
                <button onClick={toggleElement}>{elementHidden() ? 'Show' : 'Hide'} Element</button>
              </>
            )}
            <button onClick={() => setOverlayScrollbarsApplied((curr) => !curr)}>
              {overlayScrollbarsApplied() ? 'Destroy' : 'Initialize'} OverlayScrollbars
            </button>
          </div>
        </section>
        <section>
          <p class="title">Events:</p>
          <div class="items">
            {Object.entries(activeEvents()).map(([eventName, event]) => (
              <div class={`event ${event.active ? 'active' : ''}`}>
                {eventName} ({event.count})
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer>
        {bodyOverlayScrollbarsApplied() !== null && (
          <section>
            <div class="items">
              <button onClick={toggleBodyOverlayScrollbars}>
                {bodyOverlayScrollbarsApplied() ? 'Destroy' : 'Initialize'} Body OverlayScrollbars
              </button>
            </div>
          </section>
        )}
        <a
          href="https://github.com/KingSora/OverlayScrollbars/tree/master/examples/solid"
          target="_blank"
        >
          Open source code of this example.
        </a>
      </footer>
    </>
  );
};

export default App;
