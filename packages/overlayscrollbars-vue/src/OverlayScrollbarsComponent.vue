<template>
    <div class="os-host">
        <div class="os-resize-observer-host"></div>
        <div class="os-padding">
            <div class="os-viewport">
                <div class="os-content">
                    <slot></slot>
                </div>
            </div>
        </div>
        <div class="os-scrollbar os-scrollbar-horizontal ">
            <div class="os-scrollbar-track">
                <div class="os-scrollbar-handle"></div>
            </div>
        </div>
        <div class="os-scrollbar os-scrollbar-vertical">
            <div class="os-scrollbar-track">
                <div class="os-scrollbar-handle"></div>
            </div>
        </div>
        <div class="os-scrollbar-corner"></div>
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

// https://github.com/vuejs/rfcs/blob/attr-fallthrough/active-rfcs/0000-attr-fallthrough.md
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
                return (this as OverlayScrollbarsComponent)._osInstance;
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
                let osInstance = (this as OverlayScrollbarsComponent)._osInstance;
                if (OverlayScrollbars.valid(osInstance)) {
                    osInstance.options(currOptions);
                }
            }
        },

        data() {
            return {};
        },

        mounted() {
            (this as OverlayScrollbarsComponent)._osInstance = OverlayScrollbars(
                this.osTarget(),
                this.options || {},
                this.extensions
            );
        },

        beforeDestroy() {
            const osInstance = (this as OverlayScrollbarsComponent)._osInstance;
            if (OverlayScrollbars.valid(osInstance)) {
                osInstance.destroy();
                (this as OverlayScrollbarsComponent)._osInstance = null;
            }
        }
    }) {
    private _osInstance: OverlayScrollbars | null = null;
}
</script>
