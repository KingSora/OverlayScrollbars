import "overlayscrollbars/css/OverlayScrollbars.css";
import './styles.css';
import Vue from 'vue';
import App from './App.vue';
import OverlayScrollbars from 'overlayscrollbars';
import { OverlayScrollbarsPlugin } from "overlayscrollbars-vue";

Vue.config.productionTip = false

Vue.use(OverlayScrollbarsPlugin);

new Vue({
    render: h => h(App),
}).$mount('#app')

OverlayScrollbars(document.body, {
    nativeScrollbarsOverlaid: {
        initialize: false
    }
});