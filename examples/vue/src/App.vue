<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';
import type { PartialOptions } from 'overlayscrollbars';

const options: PartialOptions = {
  scrollbars: {
    theme: 'os-theme-light',
  },
};
</script>

<template>
  <a href="https://www.npmjs.com/package/overlayscrollbars-vue" target="_blank">
    <h1>OverlayScrollbars Vue</h1>
  </a>
  <OverlayScrollbarsComponent
    class="overlayscrollbars-vue"
    style="height: 222px; width: 222px"
    :options="options"
    defer
  >
    <div class="logo">
      <img alt="Vue logo" src="logo.svg" width="333" height="333" />
    </div>
  </OverlayScrollbarsComponent>
</template>
