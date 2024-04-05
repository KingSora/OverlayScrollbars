import type { HTMLElementTarget } from './types';
import { getBoundingClientRect } from './dimensions';
import { wnd } from '../utils/alias';

export interface XY<T = number> {
  x: T;
  y: T;
}

const zeroObj: XY = {
  x: 0,
  y: 0,
};

/**
 * Returns the offset- left and top coordinates of the passed element relative to the document. If the element is null the top and left values are 0.
 * @param elm The element of which the offset- top and left coordinates shall be returned.
 */
export const absoluteCoordinates = (elm: HTMLElementTarget): Readonly<XY> => {
  const rect = elm && getBoundingClientRect(elm);
  return rect
    ? {
        x: rect.left + wnd.scrollX,
        y: rect.top + wnd.scrollY,
      }
    : zeroObj;
};

/**
 * Returns the offset- left and top coordinates of the passed element. If the element is null the top and left values are 0.
 * @param elm The element of which the offset- top and left coordinates shall be returned.
 */
export const offsetCoordinates = (elm: HTMLElementTarget): Readonly<XY> =>
  elm
    ? {
        x: elm.offsetLeft,
        y: elm.offsetTop,
      }
    : zeroObj;
