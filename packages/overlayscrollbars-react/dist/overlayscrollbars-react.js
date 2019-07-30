(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('overlayscrollbars')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'overlayscrollbars'], factory) :
    (global = global || self, factory(global.OverlayScrollbarsReact = {}, global.React, global.OverlayScrollbars));
}(this, function (exports, React, OverlayScrollbars) { 'use strict';

    var React__default = 'default' in React ? React['default'] : React;
    OverlayScrollbars = OverlayScrollbars && OverlayScrollbars.hasOwnProperty('default') ? OverlayScrollbars['default'] : OverlayScrollbars;

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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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

    var OverlayScrollbarsComponent = (function (_super) {
        __extends(OverlayScrollbarsComponent, _super);
        function OverlayScrollbarsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this._osInstance = null;
            _this._osTargetRef = React__default.createRef();
            return _this;
        }
        OverlayScrollbarsComponent.prototype.osInstance = function () {
            return this._osInstance;
        };
        OverlayScrollbarsComponent.prototype.osTarget = function () {
            return this._osTargetRef.current || null;
        };
        OverlayScrollbarsComponent.prototype.componentDidMount = function () {
            this._osInstance = OverlayScrollbars(this.osTarget(), this.props.options || {}, this.props.extensions);
        };
        OverlayScrollbarsComponent.prototype.componentWillUnmount = function () {
            if (OverlayScrollbars.valid(this._osInstance)) {
                this._osInstance.destroy();
                this._osInstance = null;
            }
        };
        OverlayScrollbarsComponent.prototype.componentDidUpdate = function (prevProps) {
            if (OverlayScrollbars.valid(this._osInstance)) {
                this._osInstance.options(this.props.options);
            }
        };
        OverlayScrollbarsComponent.prototype.render = function () {
            var _a = this.props, options = _a.options, extensions = _a.extensions, children = _a.children, divProps = __rest(_a, ["options", "extensions", "children"]);
            return (React__default.createElement("div", __assign({}, divProps, { ref: this._osTargetRef }), this.props.children));
        };
        return OverlayScrollbarsComponent;
    }(React.Component));

    exports.OverlayScrollbarsComponent = OverlayScrollbarsComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=overlayscrollbars-react.js.map
