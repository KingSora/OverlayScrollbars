import 'overlayscrollbars/overlayscrollbars.css';
import { createApp } from 'vue';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import App from './App.vue';

import './main.css';

OverlayScrollbars.plugin(ClickScrollPlugin);

const app = createApp(App);
app.mount('#app');
