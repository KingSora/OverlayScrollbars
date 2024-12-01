import React from 'react';
import ReactDOM from 'react-dom/client';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';
import './index.css';
import App from './App';

OverlayScrollbars.plugin(ClickScrollPlugin);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
