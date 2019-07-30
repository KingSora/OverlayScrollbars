(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('overlayscrollbars')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vue', 'overlayscrollbars'], factory) :
    (global = global || self, factory(global.OverlayScrollbarsVue = {}, global.Vue, global.OverlayScrollbars));
}(this, function (exports, Vue, OverlayScrollbars) { 'use strict';

    Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
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

    var OverlayScrollbarsComponent = (function (_super) {
        __extends(OverlayScrollbarsComponent, _super);
        function OverlayScrollbarsComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._osInstace = null;
            return _this;
        }
        return OverlayScrollbarsComponent;
    }(Vue.extend({
        name: 'overlay-scrollbars',
        props: {
            options: {
                type: Object
            },
            extensions: {
                type: [String, Array, Object]
            }
        },
        methods: {
            osInstance: function () {
                return this._osInstace;
            },
            osTarget: function () {
                return this.$el || null;
            }
        },
        watch: {
            options: function (currOptions, oldOptions) {
                var osInstance = this._osInstace;
                if (OverlayScrollbars.valid(osInstance)) {
                    osInstance.options(currOptions);
                }
            }
        },
        data: function () {
            return {};
        },
        mounted: function () {
            this._osInstace = OverlayScrollbars(this.osTarget(), this.options || {}, this.extensions);
        },
        beforeDestroy: function () {
            var osInstance = this._osInstace;
            if (OverlayScrollbars.valid(osInstance)) {
                osInstance.destroy();
                this._osInstace = null;
            }
        },
        render: function (createElement) {
            return (createElement("div", null, this.$slots.default));
        }
    })));

    var OverlayScrollbarsPlugin = {
        install: function (vue, options) {
            if (options) {
                OverlayScrollbars.defaultOptions(options);
            }
            vue.component('overlay-scrollbars', OverlayScrollbarsComponent);
        }
    };

    exports.OverlayScrollbarsComponent = OverlayScrollbarsComponent;
    exports.OverlayScrollbarsPlugin = OverlayScrollbarsPlugin;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=overlayscrollbars-vue.js.map
