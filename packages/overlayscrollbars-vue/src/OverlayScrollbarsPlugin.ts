import { VueConstructor, PluginObject } from 'vue';
import OverlayScrollbars from 'overlayscrollbars';
import OverlayScrollbarsComponent from './OverlayScrollbarsComponent.vue';

export const OverlayScrollbarsPlugin: PluginObject<OverlayScrollbars.Options> = {
    install(vue: VueConstructor, options?: OverlayScrollbars.Options) {
        if (options) {
            OverlayScrollbars.defaultOptions(options);
        }

        vue.component('overlay-scrollbars', OverlayScrollbarsComponent);
    }
}