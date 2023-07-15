import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const App = () => {
  return (
    <>
      <a href="https://www.npmjs.com/package/overlayscrollbars-react" target="_blank">
        <h1>OverlayScrollbars React</h1>
      </a>
      <OverlayScrollbarsComponent
        className="overlayscrollbars-react"
        style={{ width: '222px', height: '222px' }}
        options={{ scrollbars: { theme: 'os-theme-light' } }}
        defer
      >
        <div className="logo">
          <img alt="React logo" src="logo.svg" width="333" height="333" />
        </div>
      </OverlayScrollbarsComponent>
    </>
  );
};

export default App;
