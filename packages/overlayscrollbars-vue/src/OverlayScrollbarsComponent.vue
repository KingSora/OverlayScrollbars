<script lang="ts">
import { defineComponent, watch, watchPostEffect, ref, shallowRef, toRefs, onUnmounted } from 'vue';
import { useOverlayScrollbars } from './useOverlayScrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent.types';
import type { PropType } from 'vue';
import type { EventListeners, EventListenerMap } from 'overlayscrollbars';

const emitNames: (keyof EventListenerMap)[] = ['initialized', 'updated', 'destroyed', 'scroll'];

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
  emits: {
    initialized: (...args: EventListenerMap['initialized']) => true,
    updated: (...args: EventListenerMap['updated']) => true,
    destroyed: (...args: EventListenerMap['destroyed']) => true,
    scroll: (...args: EventListenerMap['scroll']) => true,
  },
  setup(props, { expose, emit }) {
    const elementRef = shallowRef<HTMLElement | null>(null);
    const slotRef = shallowRef<HTMLElement | null>(null);
    const combinedEvents = ref<EventListeners>();
    const { element, options, events } = toRefs(props);
    const [initialize, instance] = useOverlayScrollbars({ options, events: combinedEvents });
    const exposed: OverlayScrollbarsComponentRef = {
      instance,
      element: () => elementRef.value,
    };

    expose(exposed);

    watch(
      () => events.value,
      (rawCurrEvents) => {
        const currEvents = rawCurrEvents || {};
        combinedEvents.value = emitNames.reduce<EventListeners>(
          <N extends keyof EventListeners>(obj: EventListeners, name: N) => {
            const eventListener = currEvents[name];
            obj[name] = [
              // @ts-ignore
              (...args: EventListenerMap[N]) => emit(name, ...args),
              ...(Array.isArray(eventListener) ? eventListener : [eventListener]).filter(Boolean),
            ];
            return obj;
          },
          {}
        );
      },
      { deep: true, immediate: true }
    );

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

    onUnmounted(() => instance()?.destroy());

    return { elementRef, slotRef, element };
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
