<script setup lang="ts">
import { ref, unref, shallowRef, toRefs, watch, watchPostEffect, onUnmounted } from 'vue';
import { useOverlayScrollbars } from './useOverlayScrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent.types';
import type { PropType } from 'vue';
import type { EventListeners, EventListenerArgs } from 'overlayscrollbars';

type EmitEventsMap = {
  [N in keyof EventListenerArgs]: `os${Capitalize<N>}`;
};

const emitEvents: EmitEventsMap = {
  initialized: 'osInitialized',
  updated: 'osUpdated',
  destroyed: 'osDestroyed',
  scroll: 'osScroll',
};
const props = defineProps({
  element: {
    type: String as PropType<OverlayScrollbarsComponentProps['element']>,
    default: 'div',
  },
  options: { type: Object as PropType<OverlayScrollbarsComponentProps['options']> },
  events: { type: Object as PropType<OverlayScrollbarsComponentProps['events']> },
});
const emits = defineEmits<{
  (name: 'osInitialized', ...args: EventListenerArgs['initialized']): void;
  (name: 'osUpdated', ...args: EventListenerArgs['updated']): void;
  (name: 'osDestroyed', ...args: EventListenerArgs['destroyed']): void;
  (name: 'osScroll', ...args: EventListenerArgs['scroll']): void;
}>();

const elementRef = shallowRef<HTMLElement | null>(null);
const slotRef = shallowRef<HTMLElement | null>(null);
const combinedEvents = ref<EventListeners>();
const { element, options, events } = toRefs(props);
const [initialize, osInstance] = useOverlayScrollbars({ options, events: combinedEvents });
const exposed: OverlayScrollbarsComponentRef = {
  osInstance,
  getElement: () => elementRef.value,
};

defineExpose(exposed);

onUnmounted(() => osInstance()?.destroy());

watchPostEffect((onCleanup) => {
  const { value: elm } = elementRef;
  const { value: slotElm } = slotRef;

  if (elm && slotElm) {
    const instance = initialize({
      target: elm,
      elements: {
        viewport: slotElm,
        content: slotElm,
      },
    });
    onCleanup(() => instance.destroy());
  }
});

watch(
  () => unref(events),
  (rawCurrEvents) => {
    const currEvents = rawCurrEvents || {};
    combinedEvents.value = (
      Object.keys(emitEvents) as (keyof EventListeners)[]
    ).reduce<EventListeners>(<N extends keyof EventListeners>(obj: EventListeners, name: N) => {
      const eventListener = currEvents[name];
      obj[name] = [
        (...args: EventListenerArgs[N]) =>
          emits(
            emitEvents[name],
            // @ts-ignore
            ...args
          ),
        ...(Array.isArray(eventListener) ? eventListener : [eventListener]).filter(Boolean),
      ];
      return obj;
    }, {});
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <component data-overlayscrollbars-initialize="" :is="element" ref="elementRef">
    <div ref="slotRef">
      <slot></slot>
    </div>
  </component>
</template>
