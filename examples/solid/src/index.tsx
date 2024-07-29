/* @refresh reload */
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { render } from 'solid-js/web';

import './index.css';
import App from './App';

OverlayScrollbars.plugin(ClickScrollPlugin);

render(() => <App />, document.getElementById('root') as HTMLElement);
