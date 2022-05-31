import { defineComponent, ref, watch, onMounted, onBeforeUnmount, createVNode } from 'vue';
import OverlayScrollbars from 'overlayscrollbars';

var OverlayScrollbarsComponent = defineComponent({
  name: "OverlayScrollbars",
  props: {
    options: {
      type: Object
    },
    extensions: {
      type: [String, Array, Object]
    }
  },

  data() {
    return {};
  },

  setup(props, {
    slots,
    expose
  }) {
    const osInstance = ref(null);
    const osTargetRef = ref();
    expose({
      osInstance() {
        return osInstance.value;
      },

      osTarget() {
        return this.$el || null;
      }

    });
    watch(() => props.options, (currOptions, oldOptions) => {
      if (OverlayScrollbars.valid(osInstance.value)) {
        osInstance.value.options(currOptions);
      }
    });
    onMounted(() => {
      osInstance.value = OverlayScrollbars(osTargetRef.value, props.options || {}, props.extensions);
    });
    onBeforeUnmount(() => {
      if (OverlayScrollbars.valid(osInstance.value)) {
        osInstance.value.destroy();
        osInstance.value = null;
      }
    });
    return () => {
      var _a;

      return createVNode("div", {
        "ref": osTargetRef,
        "class": "os-host"
      }, [createVNode("div", {
        "class": "os-resize-observer-host"
      }, null), createVNode("div", {
        "class": "os-padding"
      }, [createVNode("div", {
        "class": "os-viewport"
      }, [createVNode("div", {
        "class": "os-content"
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])])]), createVNode("div", {
        "class": "os-scrollbar os-scrollbar-horizontal"
      }, [createVNode("div", {
        "class": "os-scrollbar-track"
      }, [createVNode("div", {
        "class": "os-scrollbar-handle"
      }, null)])]), createVNode("div", {
        "class": "os-scrollbar os-scrollbar-vertical"
      }, [createVNode("div", {
        "class": "os-scrollbar-track"
      }, [createVNode("div", {
        "class": "os-scrollbar-handle"
      }, null)])]), createVNode("div", {
        "class": "os-scrollbar-corner"
      }, null)]);
    };
  }

});

export { OverlayScrollbarsComponent };
//# sourceMappingURL=overlayscrollbars-vue.esm.js.map
