import React, { Component, RefObject } from 'react';
import OverlayScrollbars from "overlayscrollbars";

export interface OverlayScrollbarsComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: any;
    options?: OverlayScrollbars.Options;
    extensions?: OverlayScrollbars.Extensions;
}
export interface OverlayScrollbarsComponentState { }

export class OverlayScrollbarsComponent extends Component<OverlayScrollbarsComponentProps, OverlayScrollbarsComponentState> {
    private _osInstance: OverlayScrollbars | null = null;
    private _osTargetRef: RefObject<HTMLDivElement>;

    constructor(props: OverlayScrollbarsComponentProps) {
        super(props);
        this._osTargetRef = React.createRef();
    }

    osInstance(): OverlayScrollbars | null {
        return this._osInstance;
    }

    osTarget(): HTMLDivElement | null {
        return this._osTargetRef.current || null;
    }

    componentDidMount() {
        this._osInstance = OverlayScrollbars(this.osTarget(), this.props.options || {}, this.props.extensions);
    }

    componentWillUnmount() {
        if (OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.destroy();
            this._osInstance = null;
        }
    }

    componentDidUpdate(prevProps: OverlayScrollbarsComponentProps) {
        if (OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.options(this.props.options);
        }
    }

    render() {
        let {
            options,
            extensions,
            children,
            className,
            ...divProps
        } = this.props;

        return (
            <div className={`${className} os-host`} {...divProps} ref={this._osTargetRef}>
                <div className="os-resize-observer-host"></div>
                <div className="os-padding">
                    <div className="os-viewport">
                        <div className="os-content">
                            {...this.props.children}
                        </div>
                    </div>
                </div>
                <div className="os-scrollbar os-scrollbar-horizontal ">
                    <div className="os-scrollbar-track">
                        <div className="os-scrollbar-handle"></div>
                    </div>
                </div>
                <div className="os-scrollbar os-scrollbar-vertical">
                    <div className="os-scrollbar-track">
                        <div className="os-scrollbar-handle"></div>
                    </div>
                </div>
                <div className="os-scrollbar-corner"></div>
            </div>
        );
    }
}