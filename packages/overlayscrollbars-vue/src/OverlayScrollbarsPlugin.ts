import { VueConstructor, PluginObject } from 'vue';
import { OverlayScrollbarsComponent } from './OverlayScrollbarsComponent';
import OverlayScrollbars from 'overlayscrollbars';


export const OverlayScrollbarsPlugin: PluginObject<OverlayScrollbars.Options> = {
    install(vue: VueConstructor, options?: OverlayScrollbars.Options) {
        if (options) {
            OverlayScrollbars.defaultOptions(options);
        }

        vue.component('overlay-scrollbars', OverlayScrollbarsComponent);
    }
}