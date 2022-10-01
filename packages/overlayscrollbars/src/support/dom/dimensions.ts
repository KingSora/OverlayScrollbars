import { style } from '~/support/dom/style';

export interface WH<T = number> {
  w: T;
  h: T;
}

const { round } = Math;
const elementHasDimensions = (elm: HTMLElement): boolean =>
  !!(elm.offsetWidth || elm.offsetHeight || elm.getClientRects().length);
const zeroObj: WH = {
  w: 0,
  h: 0,
};

/**
 * Returns the window inner- width and height.
 */
export const windowSize = (): WH => ({
  w: window.innerWidth,
  h: window.innerHeight,
});

/**
 * Returns the scroll- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the scroll- width and height shall be returned.
 */
export const offsetSize = (elm: HTMLElement | null | undefined): WH =>
  elm
    ? {
        w: elm.offsetWidth,
        h: elm.offsetHeight,
      }
    : zeroObj;

/**
 * Returns the client- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the client- width and height shall be returned.
 */
export const clientSize = (elm: HTMLElement | false | null | undefined): WH =>
  elm
    ? {
        w: elm.clientWidth,
        h: elm.clientHeight,
      }
    : zeroObj;

/**
 * Returns the client- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the client- width and height shall be returned.
 */
export const scrollSize = (elm: HTMLElement | false | null | undefined): WH =>
  elm
    ? {
        w: elm.scrollWidth,
        h: elm.scrollHeight,
      }
    : zeroObj;

/**
 * Returns the fractional- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the fractional- width and height shall be returned.
 */
export const fractionalSize = (elm: HTMLElement | false | null | undefined): WH => {
  const cssHeight = parseFloat(style(elm, 'height')) || 0;
  const cssWidth = parseFloat(style(elm, 'width')) || 0;
  return {
    w: cssWidth - round(cssWidth),
    h: cssHeight - round(cssHeight),
  };
};

/**
 * Returns the BoundingClientRect of the passed element.
 * @param elm The element of which the BoundingClientRect shall be returned.
 */
export const getBoundingClientRect = (elm: HTMLElement): DOMRect => elm.getBoundingClientRect();

/**
 * Determines whether the passed element has any dimensions.
 * @param elm The element.
 */
export const hasDimensions = (elm: HTMLElement | false | null | undefined): boolean =>
  elm ? elementHasDimensions(elm as HTMLElement) : false;
