import {
  onMounted,
  onBeforeUnmount,
  watch,
  defineComponent,
  ref,
  PropType,
} from "vue";
import OverlayScrollbars from "overlayscrollbars";

export default defineComponent({
  name: "OverlayScrollbars",

  props: {
    options: {
      type: Object as PropType<OverlayScrollbars.Options>,
    },
    extensions: {
      type: [String, Array, Object] as PropType<OverlayScrollbars.Extensions>,
    },
  },

  data() {
    return {};
  },

  setup(props, { slots, expose }) {
    const osInstance = ref<OverlayScrollbars | null>(null);
    const osTargetRef = ref<HTMLDivElement>();

    expose({
      osInstance(): OverlayScrollbars | null {
        return osInstance.value;
      },
      osTarget(): HTMLDivElement | null {
        return (this.$el as HTMLDivElement) || null;
      },
    });

    watch(
      () => props.options,
      (
        currOptions: OverlayScrollbars.Options,
        oldOptions: OverlayScrollbars.Options
      ) => {
        if (OverlayScrollbars.valid(osInstance.value)) {
          osInstance.value.options(currOptions);
        }
      }
    );

    onMounted(() => {
      osInstance.value = OverlayScrollbars(
        osTargetRef.value,
        props.options || {},
        props.extensions
      );
    });

    onBeforeUnmount(() => {
      if (OverlayScrollbars.valid(osInstance.value)) {
        osInstance.value.destroy();
        osInstance.value = null;
      }
    });

    return () => (
      <div ref={osTargetRef} class="os-host">
        <div class="os-resize-observer-host"></div>
        <div class="os-padding">
          <div class="os-viewport">
            <div class="os-content">{slots.default?.()}</div>
          </div>
        </div>
        <div class="os-scrollbar os-scrollbar-horizontal">
          <div class="os-scrollbar-track">
            <div class="os-scrollbar-handle"></div>
          </div>
        </div>
        <div class="os-scrollbar os-scrollbar-vertical">
          <div class="os-scrollbar-track">
            <div class="os-scrollbar-handle"></div>
          </div>
        </div>
        <div class="os-scrollbar-corner"></div>
      </div>
    );
  },
});
