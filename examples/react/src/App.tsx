import { useEffect, useRef, useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { OverlayScrollbars } from 'overlayscrollbars';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import { useEventObserver } from './useEventObserver';

const content = (
  <div className="logo">
    <img alt="React logo" src="logo.svg" />
  </div>
);

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
      },
    }
  ).state().destroyed;

const App = () => {
  const [contentHidden, setContentHidden] = useState(false);
  const [elementHidden, setElementHidden] = useState(false);
  const [useOverlayScrollbars, setUseOverlayScrollbars] = useState(true);
  const [useBodyOverlayScrollbars, setUseBodyOverlayScrollbars] = useState<boolean | null>(null);
  const [activeEvents, activateEvent] = useEventObserver();
  const osRef = useRef<OverlayScrollbarsComponentRef>(null);

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
    const bodyOsInstance = OverlayScrollbars(document.body);
    if (bodyOsInstance) {
      bodyOsInstance.destroy();
    } else {
      initBodyOverlayScrollbars(true);
    }
    setUseBodyOverlayScrollbars((curr) => !curr);
  };

  useEffect(() => setUseBodyOverlayScrollbars(!initBodyOverlayScrollbars()), []);

  return (
    <>
      <main>
        <h1>
          <a href="https://www.npmjs.com/package/overlayscrollbars-react" target="_blank">
            OverlayScrollbars React
          </a>
        </h1>
        <section className="slot">
          {useOverlayScrollbars ? (
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
            {useOverlayScrollbars && (
              <>
                <button onClick={scrollContent}>Scroll</button>
                <button onClick={toggleContent}>{contentHidden ? 'Show' : 'Hide'} Content</button>
                <button onClick={toggleElement}>{elementHidden ? 'Show' : 'Hide'} Element</button>
              </>
            )}
            <button onClick={() => setUseOverlayScrollbars((curr) => !curr)}>
              {useOverlayScrollbars ? 'Destroy' : 'Initialize'} OverlayScrollbars
            </button>
          </div>
        </section>
        <section>
          <p className="title">Events:</p>
          <div className="items">
            {Object.entries(activeEvents).map(([eventName, event]) => (
              <div className={`event ${event.active ? 'active' : ''}`}>
                {eventName} ({event.count})
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer>
        {useBodyOverlayScrollbars !== null && (
          <section>
            <div className="items">
              <button onClick={toggleBodyOverlayScrollbars}>
                {useBodyOverlayScrollbars ? 'Destroy' : 'Initialize'} Body OverlayScrollbars
              </button>
            </div>
          </section>
        )}
        <a
          href="https://github.com/KingSora/OverlayScrollbars/tree/master/examples/react"
          target="_blank"
        >
          Open source code of this example.
        </a>
      </footer>
    </>
  );
};

export default App;
