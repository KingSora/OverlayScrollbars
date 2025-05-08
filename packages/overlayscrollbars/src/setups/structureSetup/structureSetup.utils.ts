import type { Env } from '../../environment';
import type { Options, OptionsCheckFn, OverflowBehavior } from '../../options';
import type { OverflowStyle } from '../../typings';
import {
  getStyles,
  strHidden,
  strOverflowX,
  strOverflowY,
  strScroll,
  strVisible,
  XY,
} from '../../support';

export const getShowNativeOverlaidScrollbars = (checkOption: OptionsCheckFn<Options>, env: Env) => {
  const { _nativeScrollbarsOverlaid } = env;
  const [showNativeOverlaidScrollbarsOption, showNativeOverlaidScrollbarsChanged] = checkOption(
    'showNativeOverlaidScrollbars'
  );

  return [
    showNativeOverlaidScrollbarsOption &&
      _nativeScrollbarsOverlaid.x &&
      _nativeScrollbarsOverlaid.y,
    showNativeOverlaidScrollbarsChanged,
  ] as const;
};

export const overflowIsVisible = (overflow: string) => overflow.indexOf(strVisible) === 0;

export const overflowBehaviorToOverflowStyle = (
  overflowBehavior: OverflowBehavior
): OverflowStyle => overflowBehavior.replace(`${strVisible}-`, '') as OverflowStyle;

export const overflowCssValueToOverflowStyle = (
  cssValue: string | undefined,
  hasOverflow?: boolean
): OverflowStyle => {
  if (cssValue === 'auto') {
    return hasOverflow ? strScroll : strHidden;
  }

  const finalCssValue = cssValue || strHidden;
  return [strHidden, strScroll, strVisible].includes(finalCssValue)
    ? (finalCssValue as OverflowStyle)
    : strHidden;
};

export const getElementOverflowStyle = (
  element: HTMLElement,
  hasOverflow: Partial<XY<boolean>>
): XY<OverflowStyle> => {
  const { overflowX, overflowY } = getStyles(element, [strOverflowX, strOverflowY]);

  return {
    x: overflowCssValueToOverflowStyle(overflowX, hasOverflow.x),
    y: overflowCssValueToOverflowStyle(overflowY, hasOverflow.y),
  };
};
