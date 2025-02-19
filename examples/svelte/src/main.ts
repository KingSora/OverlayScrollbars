import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

OverlayScrollbars.plugin(ClickScrollPlugin);

const app = mount(App, { target: document.getElementById('app') as HTMLElement });

export default app;
