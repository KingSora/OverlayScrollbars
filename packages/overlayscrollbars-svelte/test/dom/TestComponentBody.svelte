<script lang="ts">
  import { OverlayScrollbarsComponent } from '../../src/overlayscrollbars-svelte';

  let { element }: { element: any } = $props();
</script>

<OverlayScrollbarsComponent {element}>
  <section id="body"></section>
</OverlayScrollbarsComponent>
