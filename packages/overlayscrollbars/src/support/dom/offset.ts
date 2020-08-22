const zeroObj = {
  left: 0,
  top: 0,
};

export const offset = (elm: HTMLElement | null) => {
  const rect = elm ? elm.getBoundingClientRect() : 0;
  return rect
    ? {
        left: rect.left + window.pageYOffset,
        top: rect.top + window.pageXOffset,
      }
    : zeroObj;
};

export const position = (elm: HTMLElement | null) =>
  elm
    ? {
        left: elm.offsetLeft,
        top: elm.offsetTop,
      }
    : zeroObj;
