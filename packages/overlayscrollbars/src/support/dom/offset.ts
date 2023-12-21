import type { AttributeTarget } from './types';
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
export const absoluteCoordinates = (elm: AttributeTarget): Readonly<XY> => {
  const rect = elm && getBoundingClientRect(elm);
  return rect
    ? {
        x: rect.left + wnd.pageYOffset, //IE11 compat
        y: rect.top + wnd.pageXOffset, //IE11 compat
      }
    : zeroObj;
};

/**
 * Returns the offset- left and top coordinates of the passed element. If the element is null the top and left values are 0.
 * @param elm The element of which the offset- top and left coordinates shall be returned.
 */
export const offsetCoordinates = (elm: AttributeTarget): Readonly<XY> =>
  elm
    ? {
        x: elm.offsetLeft,
        y: elm.offsetTop,
      }
    : zeroObj;
