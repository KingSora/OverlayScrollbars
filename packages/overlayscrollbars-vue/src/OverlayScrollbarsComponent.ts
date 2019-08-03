import OverlayScrollbars from 'overlayscrollbars';

export interface OverlayScrollbarsComponentData { }

export interface OverlayScrollbarsComponentMethods {
    osInstance(): OverlayScrollbars | null;
    osTarget(): HTMLDivElement | null;
}

export interface OverlayScrollbarsComponentComputed { }

export interface OverlayScrollbarsComponentProps {
    options: OverlayScrollbars.Options;
    extensions: OverlayScrollbars.Extensions;
}