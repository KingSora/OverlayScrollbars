(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('overlayscrollbars')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue', 'overlayscrollbars'], factory) :
  (global = global || self, factory(global.OverlayScrollbarsVue = {}, global.Vue, global.OverlayScrollbars));
}(this, (function (exports, vue, OverlayScrollbars) { 'use strict';

  OverlayScrollbars = OverlayScrollbars && Object.prototype.hasOwnProperty.call(OverlayScrollbars, 'default') ? OverlayScrollbars['default'] : OverlayScrollbars;

  var OverlayScrollbarsComponent = vue.defineComponent({
    name: "OverlayScrollbars",
    props: {
      options: {
        type: Object
      },
      extensions: {
        type: [String, Array, Object]
      }
    },
    data: function () {
      return {};
    },
    setup: function (props, _a) {
      var slots = _a.slots,
          expose = _a.expose;
      var osInstance = vue.ref(null);
      var osTargetRef = vue.ref();
      expose({
        osInstance: function () {
          return osInstance.value;
        },
        osTarget: function () {
          return this.$el || null;
        }
      });
      vue.watch(function () {
        return props.options;
      }, function (currOptions, oldOptions) {
        if (OverlayScrollbars.valid(osInstance.value)) {
          osInstance.value.options(currOptions);
        }
      });
      vue.onMounted(function () {
        osInstance.value = OverlayScrollbars(osTargetRef.value, props.options || {}, props.extensions);
      });
      vue.onBeforeUnmount(function () {
        if (OverlayScrollbars.valid(osInstance.value)) {
          osInstance.value.destroy();
          osInstance.value = null;
        }
      });
      return function () {
        var _a;

        return vue.createVNode("div", {
          "ref": osTargetRef,
          "class": "os-host"
        }, [vue.createVNode("div", {
          "class": "os-resize-observer-host"
        }, null), vue.createVNode("div", {
          "class": "os-padding"
        }, [vue.createVNode("div", {
          "class": "os-viewport"
        }, [vue.createVNode("div", {
          "class": "os-content"
        }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])])]), vue.createVNode("div", {
          "class": "os-scrollbar os-scrollbar-horizontal"
        }, [vue.createVNode("div", {
          "class": "os-scrollbar-track"
        }, [vue.createVNode("div", {
          "class": "os-scrollbar-handle"
        }, null)])]), vue.createVNode("div", {
          "class": "os-scrollbar os-scrollbar-vertical"
        }, [vue.createVNode("div", {
          "class": "os-scrollbar-track"
        }, [vue.createVNode("div", {
          "class": "os-scrollbar-handle"
        }, null)])]), vue.createVNode("div", {
          "class": "os-scrollbar-corner"
        }, null)]);
      };
    }
  });

  exports.OverlayScrollbarsComponent = OverlayScrollbarsComponent;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=overlayscrollbars-vue.js.map
