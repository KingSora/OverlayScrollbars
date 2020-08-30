import { WH } from 'support/dom';

const zeroDomRect = new DOMRect();
const zeroObj: WH = {
  w: 0,
  h: 0,
};

export const windowSize = (): WH => ({
  w: window.innerWidth,
  h: window.innerHeight,
});

export const offsetSize = (elm: HTMLElement | null): WH =>
  elm
    ? {
        w: elm.offsetWidth,
        h: elm.offsetHeight,
      }
    : zeroObj;

export const clientSize = (elm: HTMLElement | null): WH =>
  elm
    ? {
        w: elm.clientWidth,
        h: elm.clientHeight,
      }
    : zeroObj;

export const getBoundingClientRect = (elm: HTMLElement | null): DOMRect => (elm ? elm.getBoundingClientRect() : zeroDomRect);
