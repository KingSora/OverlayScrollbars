<script lang="ts">
  import type { OverlayScrollbars } from 'overlayscrollbars';
  import {
    useOverlayScrollbars,
    type UseOverlayScrollbarsInitialization,
    type UseOverlayScrollbarsInstance,
  } from '../../src/useOverlayScrollbars.svelte';

  const instanceRef: { current: OverlayScrollbars | null } = { current: null };
  const {
    click,
  }: {
    click: (
      initialize: UseOverlayScrollbarsInitialization,
      instance: UseOverlayScrollbarsInstance,
      instanceRef: { current: OverlayScrollbars | null },
      target: HTMLElement
    ) => void;
  } = $props();
  const [initialize, instance] = useOverlayScrollbars();
</script>

<button
  onclick={(event) => {
    click(initialize, instance, instanceRef, event.target as HTMLElement);
  }}
>
  initialize
</button>
