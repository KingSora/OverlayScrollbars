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
  <OverlayScrollbarsComponent style="height: 222px; width: 222px" :options="options" defer>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="333" height="333" />
  </OverlayScrollbarsComponent>
</template>
