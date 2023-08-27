<script setup lang="ts">
import { ref, unref, shallowRef, toRefs, watch, watchPostEffect, onMounted } from 'vue';
import { useOverlayScrollbars } from './useOverlayScrollbars';
import type {
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from './OverlayScrollbarsComponent.types';
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
const props = withDefaults(
  defineProps<{
    element: OverlayScrollbarsComponentProps['element'];
    options: OverlayScrollbarsComponentProps['options'];
    events: OverlayScrollbarsComponentProps['events'];
    defer: OverlayScrollbarsComponentProps['defer'];
  }>(),
  {
    element: 'div',
    options: undefined,
    events: undefined,
    defer: undefined,
  }
);
const emits = defineEmits<{
  (name: 'osInitialized', ...args: EventListenerArgs['initialized']): void;
  (name: 'osUpdated', ...args: EventListenerArgs['updated']): void;
  (name: 'osDestroyed', ...args: EventListenerArgs['destroyed']): void;
  (name: 'osScroll', ...args: EventListenerArgs['scroll']): void;
}>();

const { element, options, events, defer } = toRefs(props);
const elementRef = shallowRef<HTMLElement | null>(null);
const slotRef = shallowRef<HTMLElement | null>(null);
const combinedEvents = ref<EventListeners>();
const hydrated = ref(false);
const [initialize, osInstance] = useOverlayScrollbars({ options, events: combinedEvents, defer });

const exposed: OverlayScrollbarsComponentRef = {
  osInstance,
  getElement: () => elementRef.value,
};

defineExpose(exposed);

onMounted(() => {
  hydrated.value = true;
});

watchPostEffect((onCleanup) => {
  const { value: elm } = elementRef;
  const { value: slotElm } = slotRef;

  if (hydrated.value && elm && slotElm) {
    initialize({
      target: elm,
      elements: {
        viewport: slotElm,
        content: slotElm,
      },
    });

    onCleanup(() => osInstance()?.destroy());
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
    <div v-if="hydrated" ref="slotRef" data-overlayscrollbars-contents="">
      <slot></slot>
    </div>
    <slot v-else></slot>
  </component>
</template>
