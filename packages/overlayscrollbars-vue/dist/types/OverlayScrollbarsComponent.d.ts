import Vue, { VueConstructor } from 'vue';
import OverlayScrollbars from 'overlayscrollbars';
export interface OverlayScrollbarsComponentData {
}
export interface OverlayScrollbarsComponentMethods {
    osInstance(): OverlayScrollbars | null;
    osTarget(): HTMLDivElement | null;
}
export interface OverlayScrollbarsComponentComputed {
}
export interface OverlayScrollbarsComponentProps {
    options: OverlayScrollbars.Options;
    extensions: OverlayScrollbars.Extensions;
}
declare const OverlayScrollbarsComponent_base: VueConstructor<OverlayScrollbarsComponentData & OverlayScrollbarsComponentMethods & OverlayScrollbarsComponentComputed & OverlayScrollbarsComponentProps & Vue>;
export declare class OverlayScrollbarsComponent extends OverlayScrollbarsComponent_base {
    private _osInstace;
}
export {};
