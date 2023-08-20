<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue';
import { OverlayScrollbars } from 'overlayscrollbars';
import { onMounted, ref } from 'vue';
import { useEventObserver } from './useEventObserver';
import type { EventObserverEvent } from './useEventObserver';

const initBodyOverlayScrollbars = (force?: boolean) =>
  OverlayScrollbars(
    {
      target: document.body,
      cancel: {
        body: force ? false : null,
      },
    },
    {
      scrollbars: {
        theme: 'os-theme-light',
      },
    }
  ).state().destroyed;

const contentHidden = ref(false);
const elementHidden = ref(false);
const useOverlayScrollbars = ref(true);
const useBodyOverlayScrollbars = ref<boolean | null>(null);
const [activeEvents, activateEvent] = useEventObserver();
const osRef = ref<OverlayScrollbarsComponentRef | null>(null);

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
  const bodyOsInstance = OverlayScrollbars(document.body);
  if (bodyOsInstance) {
    bodyOsInstance.destroy();
  } else {
    initBodyOverlayScrollbars(true);
  }
  useBodyOverlayScrollbars.value = !useBodyOverlayScrollbars.value;
};

onMounted(() => (useBodyOverlayScrollbars.value = !initBodyOverlayScrollbars()));
</script>

<template>
  <main>
    <h1>
      <a href="https://www.npmjs.com/package/overlayscrollbars-vue" target="_blank">
        OverlayScrollbars Vue
      </a>
    </h1>
    <section class="slot">
      <OverlayScrollbarsComponent
        v-if="useOverlayScrollbars"
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
        <template v-if="useOverlayScrollbars">
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
        <button @click="useOverlayScrollbars = !useOverlayScrollbars">
          <template v-if="useOverlayScrollbars"> Destroy </template>
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
    <section v-if="useBodyOverlayScrollbars !== null">
      <div class="items">
        <button @click="toggleBodyOverlayScrollbars">
          <template v-if="useBodyOverlayScrollbars"> Destroy </template>
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
