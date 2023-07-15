<script>
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
</script>

<svelte:head>
	<title>OverlayScrollbars & Svelte</title>
</svelte:head>

<a href="https://www.npmjs.com/package/overlayscrollbars-svelte" target="_blank">
  <h1>OverlayScrollbars Svelte</h1>
</a>
<OverlayScrollbarsComponent 
  class="overlayscrollbars-svelte" 
  style="height: 222px; width: 222px" 
  options={{ scrollbars: { theme: 'os-theme-light' } }}
  defer>
  <div class="logo">
    <img alt="Svelte Logo" src="logo.svg" width="333" height="333" />
  </div>
</OverlayScrollbarsComponent>

