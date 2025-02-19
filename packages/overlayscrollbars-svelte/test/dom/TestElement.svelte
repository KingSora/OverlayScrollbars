<script lang="ts">
  const { children, ...other }: any = $props();
  let elementRef: HTMLElement | undefined = $state();

  export const getElement = () => elementRef;
</script>

<section bind:this={elementRef} {...other}>
  {@render children?.()}
</section>
