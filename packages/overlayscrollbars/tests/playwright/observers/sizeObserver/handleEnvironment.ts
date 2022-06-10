{
  const url = new URL(window.location.toString());
  const params = url.searchParams;
  const useResizeObserverPolyfill = Boolean(params.get('roPolyfill'));

  if (useResizeObserverPolyfill) {
    // @ts-ignore
    window.ResizeObserver = undefined;
  } else {
    document.getElementById('roPolyfill')?.addEventListener('click', () => {
      params.set('roPolyfill', 'true');
      window.location.assign(url.toString());
    });
  }
}
