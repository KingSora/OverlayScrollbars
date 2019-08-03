<template>
    <div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue, { VueConstructor, VNode, CreateElement, PropType } from 'vue';
import OverlayScrollbars from 'overlayscrollbars';
import {
    OverlayScrollbarsComponentData,
    OverlayScrollbarsComponentMethods,
    OverlayScrollbarsComponentComputed,
    OverlayScrollbarsComponentProps
} from './OverlayScrollbarsComponent';

// https://github.com/vuejs/vue/issues/7060
export default class OverlayScrollbarsComponent extends Vue.extend<
    OverlayScrollbarsComponentData,
    OverlayScrollbarsComponentMethods,
    OverlayScrollbarsComponentComputed,
    OverlayScrollbarsComponentProps
    >({
        name: 'overlay-scrollbars', // https://vuejs.org/v2/guide/components-registration.html#Component-Names
        props: {
            options: {
                type: Object as PropType<OverlayScrollbars.Options>
            },
            extensions: {
                type: [String, Array, Object] as PropType<OverlayScrollbars.Extensions>
            }
        },
        methods: {
            osInstance(): OverlayScrollbars | null {
                return (this as OverlayScrollbarsComponent)._osInstace;
            },
            osTarget(): HTMLDivElement | null {
                return (this.$el as HTMLDivElement) || null;
            }
        },
        watch: {
            options(
                currOptions: OverlayScrollbars.Options,
                oldOptions: OverlayScrollbars.Options
            ) {
                let osInstance = (this as OverlayScrollbarsComponent)._osInstace;
                if (OverlayScrollbars.valid(osInstance)) {
                    osInstance.options(currOptions);
                }
            }
        },

        data() {
            return {};
        },

        mounted() {
            (this as OverlayScrollbarsComponent)._osInstace = OverlayScrollbars(
                this.osTarget(),
                this.options || {},
                this.extensions
            );
        },

        beforeDestroy() {
            let osInstance = (this as OverlayScrollbarsComponent)._osInstace;
            if (OverlayScrollbars.valid(osInstance)) {
                osInstance.destroy();
                (this as OverlayScrollbarsComponent)._osInstace = null;
            }
        }
    }) {
    private _osInstace: OverlayScrollbars | null = null;
}
</script>