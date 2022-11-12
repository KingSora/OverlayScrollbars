import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid';
import styles from './App.module.css';
import type { Component } from 'solid-js';
import logo from './logo.svg';

const App: Component = () => {
  return (
    <OverlayScrollbarsComponent
      style={{ width: '222px', height: '222px' }}
      options={{ scrollbars: { theme: 'os-theme-light' } }}
    >
      <img src={logo} class={styles.logo} alt="logo" width="333" height="333" />
    </OverlayScrollbarsComponent>
  );
};

export default App;
