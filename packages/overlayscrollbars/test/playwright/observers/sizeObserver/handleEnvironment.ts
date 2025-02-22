{
  const { body } = document;
  const url = new URL(window.location.toString());
  const params = url.searchParams;

  /**
   * roPolyfill: no ResizeObserver supported, use polyfill
   * roNoBox: ResizeObserver supported but no options.box support in the `observe` function
   */
  ['roPolyfill', 'roNoBox'].forEach((param) => {
    const paramValue = Boolean(params.get(param));

    if (paramValue) {
      body.classList.add(param);

      switch (param) {
        case 'roPolyfill': {
          // @ts-ignore
          window.ResizeObserver = undefined;
          break;
        }
        case 'roNoBox': {
          const originalProtoType = window.ResizeObserver.prototype;
          const originalObserve = originalProtoType.observe;

          originalProtoType.observe = function (target) {
            originalObserve.apply(this, [target]);
          };
          break;
        }
      }
    } else {
      document.getElementById(param)?.addEventListener('click', () => {
        params.set(param, 'true');
        window.location.assign(url.toString());
      });
    }
  });
}
