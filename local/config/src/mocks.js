const noop = function () {};

export const mockAnimationApi = () => {
  Object.defineProperties(Element.prototype, {
    animate: {
      writable: true,
      configurable: true,
      value: () => ({
        currentTime: null,
        effect: null,
        id: '',
        pending: false,
        playState: 'idle',
        playbackRate: 0,
        replaceState: 'active',
        startTime: null,
        timeline: null,
        cancel: noop,
        commitStyles: noop,
        finish: noop,
        pause: noop,
        persist: noop,
        play: noop,
        reverse: noop,
        updatePlaybackRate: noop,
        addEventListener: noop,
        removeEventListener: noop,
      }),
    },
    getAnimations: {
      writable: true,
      configurable: true,
      value: () => [],
    },
  });

  Object.defineProperty(Document.prototype, 'getAnimations', {
    writable: true,
    configurable: true,
    value: () => [],
  });
};

export const mockComputedStyles = () => {
  try {
    const cmptdStyle = window.getComputedStyle;
    window.getComputedStyle = (a) => cmptdStyle(a);
    // eslint-disable-next-line no-empty
  } catch {}
};

export const mockDimensions = () => {
  Object.defineProperties(HTMLElement.prototype, {
    offsetWidth: {
      writable: false,
      configurable: true,
      value: 1,
    },
    offsetHeight: {
      writable: false,
      configurable: true,
      value: 1,
    },
  });
};
