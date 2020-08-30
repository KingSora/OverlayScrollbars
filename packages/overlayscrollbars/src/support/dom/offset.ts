import { XY, getBoundingClientRect } from 'support/dom';

const zeroObj: XY = {
  x: 0,
  y: 0,
};

export const offset = (elm: HTMLElement | null): XY => {
  const rect = elm ? getBoundingClientRect(elm) : 0;
  return rect
    ? {
        x: rect.left + window.pageYOffset,
        y: rect.top + window.pageXOffset,
      }
    : zeroObj;
};

export const position = (elm: HTMLElement | null): XY =>
  elm
    ? {
        x: elm.offsetLeft,
        y: elm.offsetTop,
      }
    : zeroObj;
