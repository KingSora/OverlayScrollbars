import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import logo from './logo.svg';

const App = () => {
  return (
    <div className="App">
      <OverlayScrollbarsComponent
        style={{ width: '222px', height: '222px' }}
        options={{ scrollbars: { theme: 'os-theme-light' } }}
        defer
      >
        <img src={logo} className="App-logo" alt="React logo" width="333" height="333" />
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default App;
