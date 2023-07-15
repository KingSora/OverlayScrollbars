import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid';
import type { Component } from 'solid-js';

const App: Component = () => {
  return (
    <>
      <a href="https://www.npmjs.com/package/overlayscrollbars-solid" target="_blank">
        <h1>OverlayScrollbars Solid</h1>
      </a>
      <OverlayScrollbarsComponent
        class="overlayscrollbars-solid"
        style={{ width: '222px', height: '222px' }}
        options={{ scrollbars: { theme: 'os-theme-light' } }}
        defer
      >
        <div class="logo">
          <img alt="Solid logo" src="logo.svg" width="333" height="333" />
        </div>
      </OverlayScrollbarsComponent>
    </>
  );
};

export default App;
