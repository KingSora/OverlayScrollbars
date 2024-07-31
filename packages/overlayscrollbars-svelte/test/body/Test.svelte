<script lang="ts">
  import { OverlayScrollbarsComponent } from '../../src/overlayscrollbars-svelte';
  export let element: any = 'div';
</script>

<OverlayScrollbarsComponent {element}>
  <section id="body"></section>
</OverlayScrollbarsComponent>
