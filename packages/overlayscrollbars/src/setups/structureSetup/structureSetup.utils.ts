import type { Env } from '../../environment';
import type { Options, OptionsCheckFn, OverflowBehavior } from '../../options';
import type { OverflowStyle } from '../../typings';
import { strHidden, strScroll, strVisible } from '../../support';

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

export const overflowCssValueToOverflowStyle = (cssValue: string | undefined): OverflowStyle =>
  cssValue
    ? [strHidden, strScroll, strVisible].includes(cssValue)
      ? (cssValue as OverflowStyle)
      : strHidden
    : strHidden;
