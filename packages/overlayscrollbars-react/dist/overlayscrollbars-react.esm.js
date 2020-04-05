import React, { Component } from 'react';
import OverlayScrollbars from 'overlayscrollbars';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

class OverlayScrollbarsComponent extends Component {
    constructor(props) {
        super(props);
        this._osInstance = null;
        this._osTargetRef = React.createRef();
    }
    osInstance() {
        return this._osInstance;
    }
    osTarget() {
        return this._osTargetRef.current || null;
    }
    componentDidMount() {
        this._osInstance = OverlayScrollbars(this.osTarget(), this.props.options || {}, this.props.extensions);
        mergeHostClassNames(this._osInstance, this.props.className);
    }
    componentWillUnmount() {
        if (OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.destroy();
            this._osInstance = null;
        }
    }
    componentDidUpdate(prevProps) {
        if (OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.options(this.props.options);
            if (prevProps.className !== this.props.className) {
                mergeHostClassNames(this._osInstance, this.props.className);
            }
        }
    }
    render() {
        const _a = this.props, divProps = __rest(_a, ["options", "extensions", "children", "className"]);
        return (React.createElement("div", Object.assign({ className: "os-host" }, divProps, { ref: this._osTargetRef }),
            React.createElement("div", { className: "os-resize-observer-host" }),
            React.createElement("div", { className: "os-padding" },
                React.createElement("div", { className: "os-viewport" },
                    React.createElement("div", { className: "os-content" }, this.props.children))),
            React.createElement("div", { className: "os-scrollbar os-scrollbar-horizontal " },
                React.createElement("div", { className: "os-scrollbar-track" },
                    React.createElement("div", { className: "os-scrollbar-handle" }))),
            React.createElement("div", { className: "os-scrollbar os-scrollbar-vertical" },
                React.createElement("div", { className: "os-scrollbar-track" },
                    React.createElement("div", { className: "os-scrollbar-handle" }))),
            React.createElement("div", { className: "os-scrollbar-corner" })));
    }
}
function mergeHostClassNames(osInstance, className) {
    if (OverlayScrollbars.valid(osInstance)) {
        const { host } = osInstance.getElements();
        const regex = new RegExp(`(^os-host([-_].+|)$)|${osInstance.options().className.replace(/\s/g, "$|")}$`, 'g');
        const osClassNames = host.className.split(' ')
            .filter(name => name.match(regex))
            .join(' ');
        host.className = `${osClassNames} ${className || ''}`;
    }
}

export { OverlayScrollbarsComponent };
//# sourceMappingURL=overlayscrollbars-react.esm.js.map
