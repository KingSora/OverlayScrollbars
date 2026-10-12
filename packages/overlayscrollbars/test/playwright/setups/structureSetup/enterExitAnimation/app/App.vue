<script setup lang="ts">
import { OverlayScrollbarsComponent } from './../../../../../../../overlayscrollbars-vue/src/overlayscrollbars-vue';
import { ref } from 'vue';

const nonDefaultScrollDirection = document.body.classList.contains('ndsd');
const ignoreFlowDirection = document.body.classList.contains('ifd');
const getInitialItems = () => [1, 2, 3, 4, 5];
const items = ref(getInitialItems());
let id = items.value.length + 1;

function insert() {
  const i = Math.round(Math.random() * items.value.length);
  items.value.splice(i, 0, id++);
}

function reset() {
  items.value = getInitialItems();
  id = items.value.length + 1;
}

function shuffle() {
  items.value = items.value
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function remove() {
  const i = Math.round(Math.random() * items.value.length);
  if (i > -1) {
    items.value.splice(i, 1);
  }
}
</script>

<template>
  <div style="display: flex; column-gap: 5px">
    <button id="insert" @click="insert">Insert at random index</button>
    <button id="remove" @click="remove">Remove at random index</button>
    <button id="reset" @click="reset">Reset</button>
    <button id="shuffle" @click="shuffle">Shuffle</button>
  </div>

  <OverlayScrollbarsComponent
    id="target"
    class="app-scroll-bar"
    :style="{
      direction: nonDefaultScrollDirection ? 'rtl' : 'ltr',
    }"
    :options="{
      update: {
        flowDirectionStyles: ignoreFlowDirection ? () => ({}) : null,
      },
    }"
  >
    <TransitionGroup tag="ul" name="app-fade" class="app-container">
      <li v-for="item in items" class="app-item" :key="item">
        {{ item }}
      </li>
    </TransitionGroup>
  </OverlayScrollbarsComponent>
</template>

<style>
.app-scroll-bar {
  max-height: 200px;
}

.app-container {
  position: relative;
  padding: 0;
  list-style-type: none;
}

.app-item {
  width: 100%;
  height: 30px;
  background-color: #f3f3f3;
  border: 1px solid #666;
  box-sizing: border-box;
}

.app-fade-move,
.app-fade-enter-active,
.app-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.app-fade-enter-from,
.app-fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01);
}

.app-fade-leave-active {
  position: absolute;
}
</style>
