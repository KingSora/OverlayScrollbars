import 'overlayscrollbars/overlayscrollbars.css';
import './app.css';
import App from './App.svelte';

const app = new App({
  target: document.getElementById('app') as HTMLElement,
});

export default app;
