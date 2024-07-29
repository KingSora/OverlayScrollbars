import { useEffect, useRef, useState } from 'react';
import { OverlayScrollbarsComponent, useOverlayScrollbars } from 'overlayscrollbars-react';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import { useEventObserver } from './useEventObserver';

const content = (
  <div className="logo">
    <img alt="React logo" src="logo.svg" />
  </div>
);

const App = () => {
  const [contentHidden, setContentHidden] = useState(false);
  const [elementHidden, setElementHidden] = useState(false);
  const [overlayScrollbarsApplied, setOverlayScrollbarsApplied] = useState(true);
  const [bodyOverlayScrollbarsApplied, setBodyOverlayScrollbarsApplied] = useState<boolean | null>(
    null
  );
  const osRef = useRef<OverlayScrollbarsComponentRef>(null);
  const [activeEvents, activateEvent] = useEventObserver();
  const [initBodyOverlayScrollbars, getBodyOverlayScrollbarsInstance] = useOverlayScrollbars({
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

  const scrollContent = () => {
    const { current } = osRef;
    const osInstance = current?.osInstance();

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

  useEffect(() => {
    initBodyOverlayScrollbars(document.body);
  }, [initBodyOverlayScrollbars]);

  return (
    <>
      <main>
        <h1>
          <a
            href="https://www.npmjs.com/package/overlayscrollbars-react"
            target="_blank"
            rel="noreferrer"
          >
            OverlayScrollbars React
          </a>
        </h1>
        <section>
          {overlayScrollbarsApplied ? (
            <OverlayScrollbarsComponent
              className="overlayscrollbars-react"
              style={{ display: elementHidden ? 'none' : undefined }}
              ref={osRef}
              options={{ scrollbars: { theme: 'os-theme-light' } }}
              events={{
                initialized: () => activateEvent('initialized'),
                destroyed: () => activateEvent('destroyed'),
                updated: () => activateEvent('updated'),
                scroll: () => activateEvent('scroll'),
              }}
              defer
            >
              {!contentHidden && content}
            </OverlayScrollbarsComponent>
          ) : (
            <div className="overlayscrollbars-react">{content}</div>
          )}
        </section>
        <section>
          <p className="title">Actions:</p>
          <div className="items">
            {overlayScrollbarsApplied && (
              <>
                <button onClick={scrollContent}>Scroll</button>
                <button onClick={toggleContent}>{contentHidden ? 'Show' : 'Hide'} Content</button>
                <button onClick={toggleElement}>{elementHidden ? 'Show' : 'Hide'} Element</button>
              </>
            )}
            <button onClick={() => setOverlayScrollbarsApplied((curr) => !curr)}>
              {overlayScrollbarsApplied ? 'Destroy' : 'Initialize'} OverlayScrollbars
            </button>
          </div>
        </section>
        <section>
          <p className="title">Events:</p>
          <div className="items">
            {Object.entries(activeEvents).map(([eventName, event]) => (
              <div key={eventName} className={`event ${event.active ? 'active' : ''}`}>
                {eventName} ({event.count})
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer>
        {bodyOverlayScrollbarsApplied !== null && (
          <section>
            <div className="items">
              <button onClick={toggleBodyOverlayScrollbars}>
                {bodyOverlayScrollbarsApplied ? 'Destroy' : 'Initialize'} Body OverlayScrollbars
              </button>
            </div>
          </section>
        )}
        <a
          href="https://github.com/KingSora/OverlayScrollbars/tree/master/examples/react"
          target="_blank"
          rel="noreferrer"
        >
          Open source code of this example.
        </a>
      </footer>
    </>
  );
};

export default App;
