const url = new URL(window.location.toString());
const params = url.searchParams;
const useResizeObserverPolyfill = Boolean(params.get('resizeobserverpolyfill'));

if (useResizeObserverPolyfill) {
  // @ts-ignore
  window.ResizeObserver = undefined;
} else {
  document.getElementById('resizeobserver-polyfill')?.addEventListener('click', () => {
    params.set('resizeobserverpolyfill', 'true');
    window.location.assign(url.toString());
  });
}
