<script setup lang="ts">
import { OverlayScrollbarsComponent, useOverlayScrollbars } from 'overlayscrollbars-vue';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue';
import { onMounted, ref } from 'vue';
import { useEventObserver } from './useEventObserver';

const contentHidden = ref(false);
const elementHidden = ref(false);
const overlayScrollbarsApplied = ref(true);
const bodyOverlayScrollbarsApplied = ref<boolean | null>(null);
const osRef = ref<OverlayScrollbarsComponentRef | null>(null);
const [activeEvents, activateEvent] = useEventObserver();
const [initBodyOverlayScrollbars, getBodyOverlayScrollbarsInstance] = useOverlayScrollbars({
  defer: true,
  events: {
    initialized: () => {
      bodyOverlayScrollbarsApplied.value = true;
    },
    destroyed: () => {
      bodyOverlayScrollbarsApplied.value = false;
    },
  },
  options: {
    scrollbars: {
      theme: 'os-theme-light',
      clickScroll: true,
    },
  },
});

const scrollContent = () => {
  const osInstance = osRef?.value?.osInstance();

  if (!osInstance) {
    return;
  }

  const { overflowAmount } = osInstance.state();
  const { scrollOffsetElement } = osInstance.elements();
  const { scrollLeft, scrollTop } = scrollOffsetElement;

  scrollOffsetElement.scrollTo({
    behavior: 'smooth',
    left: Math.round((overflowAmount.x - scrollLeft) / overflowAmount.x) * overflowAmount.x,
    top: Math.round((overflowAmount.y - scrollTop) / overflowAmount.y) * overflowAmount.y,
  });
};
const toggleContent = () => (contentHidden.value = !contentHidden.value);
const toggleElement = () => (elementHidden.value = !elementHidden.value);
const toggleBodyOverlayScrollbars = () => {
  const bodyOsInstance = getBodyOverlayScrollbarsInstance();

  if (bodyOsInstance && !bodyOsInstance.state().destroyed) {
    bodyOsInstance.destroy();
  } else {
    initBodyOverlayScrollbars({
      target: document.body,
      cancel: {
        body: false,
      },
    });
  }
};

onMounted(() => initBodyOverlayScrollbars(document.body));
</script>

<template>
  <main>
    <h1>
      <a href="https://www.npmjs.com/package/overlayscrollbars-vue" target="_blank">
        OverlayScrollbars Vue
      </a>
    </h1>
    <section>
      <OverlayScrollbarsComponent
        v-if="overlayScrollbarsApplied"
        class="overlayscrollbars-vue"
        ref="osRef"
        :style="{ display: elementHidden ? 'none' : undefined }"
        :options="{
          scrollbars: {
            theme: 'os-theme-light',
          },
        }"
        :events="{
          initialized: () => activateEvent('initialized'),
          destroyed: () => activateEvent('destroyed'),
          updated: () => activateEvent('updated'),
          scroll: () => activateEvent('scroll'),
        }"
        defer
      >
        <div v-if="!contentHidden" class="logo">
          <img alt="Vue logo" src="logo.svg" />
        </div>
      </OverlayScrollbarsComponent>
      <div v-else class="overlayscrollbars-vue">
        <div class="logo">
          <img alt="Vue logo" src="logo.svg" />
        </div>
      </div>
    </section>
    <section>
      <p class="title">Actions:</p>
      <div class="items">
        <template v-if="overlayScrollbarsApplied">
          <button @click="scrollContent">Scroll</button>
          <button @click="toggleContent">
            <template v-if="contentHidden"> Show </template>
            <template v-else> Hide </template>
            Content
          </button>
          <button @click="toggleElement">
            <template v-if="elementHidden"> Show </template>
            <template v-else> Hide </template>
            Element
          </button>
        </template>
        <button @click="overlayScrollbarsApplied = !overlayScrollbarsApplied">
          <template v-if="overlayScrollbarsApplied"> Destroy </template>
          <template v-else> Initialize </template>
          OverlayScrollbars
        </button>
      </div>
    </section>
    <section>
      <p class="title">Events:</p>
      <div class="items">
        <div
          v-for="[eventName, event] in Object.entries(activeEvents)"
          :class="`event ${event.active ? 'active' : ''}`"
        >
          {{ eventName }} ({{ event.count }})
        </div>
      </div>
    </section>
  </main>
  <footer>
    <section v-if="bodyOverlayScrollbarsApplied !== null">
      <div class="items">
        <button @click="toggleBodyOverlayScrollbars">
          <template v-if="bodyOverlayScrollbarsApplied"> Destroy </template>
          <template v-else> Initialize </template>
          Body OverlayScrollbars
        </button>
      </div>
    </section>
    <a
      href="https://github.com/KingSora/OverlayScrollbars/tree/master/examples/vue"
      target="_blank"
    >
      Open source code of this example.
    </a>
  </footer>
</template>
