import { style } from './style';
import { mathRound, wnd } from '../utils/alias';
import { bind } from '../utils/function';

export interface WH<T = number> {
  w: T;
  h: T;
}

const elementHasDimensions = (elm: HTMLElement): boolean =>
  !!(elm.offsetWidth || elm.offsetHeight || elm.getClientRects().length);
const zeroObj: WH = {
  w: 0,
  h: 0,
};

const getElmWidthHeightProperty = <E extends HTMLElement | Window>(
  property: E extends HTMLElement ? 'client' | 'offset' | 'scroll' : 'inner',
  elm: E | false | null | undefined
): Readonly<WH> =>
  elm
    ? {
        w: (elm as any)[`${property}Width`],
        h: (elm as any)[`${property}Height`],
      }
    : zeroObj;

/**
 * Returns the window inner- width and height.
 */
export const windowSize = bind(
  getElmWidthHeightProperty<Window>,
  'inner',
  wnd
) satisfies () => Readonly<WH>;

/**
 * Returns the scroll- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the scroll- width and height shall be returned.
 */
export const offsetSize = bind(getElmWidthHeightProperty<HTMLElement>, 'offset') satisfies (
  elm: HTMLElement | false | null | undefined
) => Readonly<WH>;

/**
 * Returns the client- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the client- width and height shall be returned.
 */
export const clientSize = bind(getElmWidthHeightProperty<HTMLElement>, 'client') satisfies (
  elm: HTMLElement | false | null | undefined
) => Readonly<WH>;

/**
 * Returns the client- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the client- width and height shall be returned.
 */
export const scrollSize = bind(getElmWidthHeightProperty<HTMLElement>, 'scroll') satisfies (
  elm: HTMLElement | false | null | undefined
) => Readonly<WH>;

/**
 * Returns the fractional- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the fractional- width and height shall be returned.
 */
export const fractionalSize = (elm: HTMLElement | false | null | undefined): Readonly<WH> => {
  const cssWidth = parseFloat(style(elm, 'width')) || 0;
  const cssHeight = parseFloat(style(elm, 'height')) || 0;
  return {
    w: cssWidth - mathRound(cssWidth),
    h: cssHeight - mathRound(cssHeight),
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
  !!elm && elementHasDimensions(elm);

/**
 * Determines whether the passed DOM Rect has any dimensions.
 */
export const domRectHasDimensions = (rect?: DOMRectReadOnly | false | null) =>
  !!(rect && (rect.height || rect.width));
