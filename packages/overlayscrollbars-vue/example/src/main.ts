import "overlayscrollbars/css/OverlayScrollbars.css";
import { createApp } from "vue";
import OverlayScrollbars from "overlayscrollbars";
import App from "./App.vue";

const app = createApp(App);

app.mount("#app");

OverlayScrollbars(document.body, {
  nativeScrollbarsOverlaid: {
    initialize: false,
  },
});
