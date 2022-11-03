<script lang="ts">
import { defineComponent, watchPostEffect, onBeforeUnmount, shallowRef, toRef } from 'vue';
import { useOverlayScrollbars } from './useOverlayScrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent.types';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'OverlayScrollbars',
  props: {
    element: {
      type: String as PropType<OverlayScrollbarsComponentProps['element']>,
      default: 'div',
    },
    options: { type: Object as PropType<OverlayScrollbarsComponentProps['options']> },
    events: { type: Object as PropType<OverlayScrollbarsComponentProps['events']> },
  },
  setup(props, { expose }) {
    const elementRef = shallowRef<HTMLElement | null>(null);
    const slotRef = shallowRef<HTMLElement | null>(null);
    const [initialize, instance] = useOverlayScrollbars(props);

    const exposed: OverlayScrollbarsComponentRef = {
      instance,
      element: () => elementRef.value,
    };

    expose(exposed);

    watchPostEffect((onCleanup) => {
      const { value: elm } = elementRef;
      const { value: slotElm } = slotRef;

      if (elm && slotElm) {
        const osInstance = initialize({
          target: elm,
          elements: {
            viewport: slotElm,
            content: slotElm,
          },
        });
        onCleanup(() => osInstance.destroy());
      }
    });

    onBeforeUnmount(() => instance()?.destroy());

    return { elementRef, slotRef, element: toRef(props, 'element') };
  },
});
</script>

<template>
  <component :is="element" ref="elementRef" data-overlayscrollbars="">
    <div ref="slotRef">
      <slot></slot>
    </div>
  </component>
</template>
