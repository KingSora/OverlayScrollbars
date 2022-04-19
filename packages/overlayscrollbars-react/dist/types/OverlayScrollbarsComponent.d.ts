import React, { Component } from 'react';
import OverlayScrollbars from "overlayscrollbars";
export interface OverlayScrollbarsComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: any;
    options?: OverlayScrollbars.Options;
    extensions?: OverlayScrollbars.Extensions;
}
export interface OverlayScrollbarsComponentState {
}
export declare class OverlayScrollbarsComponent extends Component<OverlayScrollbarsComponentProps, OverlayScrollbarsComponentState> {
    private _osInstance;
    private _osTargetRef;
    constructor(props: OverlayScrollbarsComponentProps);
    osInstance(): OverlayScrollbars | null;
    osTarget(): HTMLDivElement | null;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: OverlayScrollbarsComponentProps): void;
    render(): JSX.Element;
}
