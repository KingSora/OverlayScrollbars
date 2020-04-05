import OverlayScrollbars from 'overlayscrollbars';
import Vue from 'vue';

class OverlayScrollbarsComponent extends Vue.extend({
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
        osInstance() {
            return this._osInstace;
        },
        osTarget() {
            return this.$el || null;
        }
    },
    watch: {
        options(currOptions, oldOptions) {
            let osInstance = this._osInstace;
            if (OverlayScrollbars.valid(osInstance)) {
                osInstance.options(currOptions);
            }
        }
    },
    data() {
        return {};
    },
    mounted() {
        this._osInstace = OverlayScrollbars(this.osTarget(), this.options || {}, this.extensions);
    },
    beforeDestroy() {
        const osInstance = this._osInstace;
        if (OverlayScrollbars.valid(osInstance)) {
            osInstance.destroy();
            this._osInstace = null;
        }
    }
}) {
    constructor() {
        super(...arguments);
        this._osInstace = null;
    }
}

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

const OverlayScrollbarsPlugin = {
    install(vue, options) {
        if (options) {
            OverlayScrollbars.defaultOptions(options);
        }
        vue.component('overlay-scrollbars', __vue_component__);
    }
};

export { __vue_component__ as OverlayScrollbarsComponent, OverlayScrollbarsPlugin };
//# sourceMappingURL=overlayscrollbars-vue.esm.js.map
