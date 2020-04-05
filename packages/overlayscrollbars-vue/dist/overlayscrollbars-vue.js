(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('overlayscrollbars'), require('vue')) :
    typeof define === 'function' && define.amd ? define(['exports', 'overlayscrollbars', 'vue'], factory) :
    (global = global || self, factory(global.OverlayScrollbarsVue = {}, global.OverlayScrollbars, global.Vue));
}(this, (function (exports, OverlayScrollbars, Vue) { 'use strict';

    OverlayScrollbars = OverlayScrollbars && Object.prototype.hasOwnProperty.call(OverlayScrollbars, 'default') ? OverlayScrollbars['default'] : OverlayScrollbars;
    Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;

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
        }
    })));

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        if (typeof shadowMode !== 'boolean') {
            createInjectorSSR = createInjector;
            createInjector = shadowMode;
            shadowMode = false;
        }
        // Vue.extend constructor export interop.
        const options = typeof script === 'function' ? script.options : script;
        // render functions
        if (template && template.render) {
            options.render = template.render;
            options.staticRenderFns = template.staticRenderFns;
            options._compiled = true;
            // functional template
            if (isFunctionalTemplate) {
                options.functional = true;
            }
        }
        // scopedId
        if (scopeId) {
            options._scopeId = scopeId;
        }
        let hook;
        if (moduleIdentifier) {
            // server build
            hook = function (context) {
                // 2.3 injection
                context =
                    context || // cached call
                        (this.$vnode && this.$vnode.ssrContext) || // stateful
                        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                // 2.2 with runInNewContext: true
                if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                    context = __VUE_SSR_CONTEXT__;
                }
                // inject component styles
                if (style) {
                    style.call(this, createInjectorSSR(context));
                }
                // register component module identifier for async chunk inference
                if (context && context._registeredComponents) {
                    context._registeredComponents.add(moduleIdentifier);
                }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
        }
        else if (style) {
            hook = shadowMode
                ? function (context) {
                    style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
                }
                : function (context) {
                    style.call(this, createInjector(context));
                };
        }
        if (hook) {
            if (options.functional) {
                // register for functional component in vue file
                const originalRender = options.render;
                options.render = function renderWithStyleInjection(h, context) {
                    hook.call(context);
                    return originalRender(h, context);
                };
            }
            else {
                // inject component registration as beforeCreate hook
                const existing = options.beforeCreate;
                options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
        }
        return script;
    }

    /* script */
    const __vue_script__ = OverlayScrollbarsComponent;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "os-host" }, [
        _c("div", { staticClass: "os-resize-observer-host" }),
        _vm._v(" "),
        _c("div", { staticClass: "os-padding" }, [
          _c("div", { staticClass: "os-viewport" }, [
            _c("div", { staticClass: "os-content" }, [_vm._t("default")], 2)
          ])
        ]),
        _vm._v(" "),
        _vm._m(0),
        _vm._v(" "),
        _vm._m(1),
        _vm._v(" "),
        _c("div", { staticClass: "os-scrollbar-corner" })
      ])
    };
    var __vue_staticRenderFns__ = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "os-scrollbar os-scrollbar-horizontal " }, [
          _c("div", { staticClass: "os-scrollbar-track" }, [
            _c("div", { staticClass: "os-scrollbar-handle" })
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "os-scrollbar os-scrollbar-vertical" }, [
          _c("div", { staticClass: "os-scrollbar-track" }, [
            _c("div", { staticClass: "os-scrollbar-handle" })
          ])
        ])
      }
    ];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = undefined;
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__ = normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        false,
        undefined,
        undefined,
        undefined
      );

    var OverlayScrollbarsPlugin = {
        install: function (vue, options) {
            if (options) {
                OverlayScrollbars.defaultOptions(options);
            }
            vue.component('overlay-scrollbars', __vue_component__);
        }
    };

    exports.OverlayScrollbarsComponent = __vue_component__;
    exports.OverlayScrollbarsPlugin = OverlayScrollbarsPlugin;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=overlayscrollbars-vue.js.map
