<script lang="ts">
  import { OverlayScrollbarsComponent } from '~/overlayscrollbars-svelte';
  export let element: any = 'div';
</script>

<OverlayScrollbarsComponent {element}>
  <section id="body"></section>
</OverlayScrollbarsComponent>
