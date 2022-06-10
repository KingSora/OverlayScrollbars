{
  const url = new URL(window.location.toString());
  const params = url.searchParams;
  const useIntersectionObserverPolyfill = Boolean(params.get('ioPolyfill'));
  const useResizeObserverPolyfill = Boolean(params.get('roPolyfill'));

  if (useIntersectionObserverPolyfill) {
    // @ts-ignore
    window.IntersectionObserver = undefined;
  } else {
    document.getElementById('ioPolyfill')?.addEventListener('click', () => {
      params.set('ioPolyfill', 'true');
      window.location.assign(url.toString());
    });
  }

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
