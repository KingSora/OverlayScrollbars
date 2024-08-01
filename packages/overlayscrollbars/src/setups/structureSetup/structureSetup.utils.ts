import type { Env } from '../../environment';
import type { XY } from '../../support';
import type { Options, OptionsCheckFn, OverflowBehavior } from '../../options';
import type { OverflowStyle } from '../../typings';
import { strHidden, strScroll, strVisible } from '../../support';

export interface ViewportOverflowState {
  _overflowScroll: XY<boolean>;
  _overflowStyle: XY<OverflowStyle>;
}

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

export const overflowIsVisible = (overflowBehavior: string) =>
  overflowBehavior.indexOf(strVisible) === 0;

/**
 * Creates a viewport overflow state object.
 * @param hasOverflow The information whether an axis has overflow.
 * @param overflowBehavior The overflow behavior according to the options.
 * @returns A object which represents the newly set overflow state.
 */
export const createViewportOverflowState = (
  hasOverflow: Partial<XY<boolean>>,
  overflowBehavior: XY<OverflowBehavior>
): ViewportOverflowState => {
  const getAxisOverflowStyle = (
    axisBehavior: OverflowBehavior,
    axisHasOverflow: boolean | undefined,
    perpendicularBehavior: OverflowBehavior,
    perpendicularOverflow: boolean | undefined
  ): OverflowStyle => {
    // convert behavior to style:
    // 'visible'        -> 'hidden'
    // 'hidden'         -> 'hidden'
    // 'scroll'         -> 'scroll'
    // 'visible-hidden' -> 'hidden'
    // 'visible-scroll' -> 'scroll'
    const behaviorStyle =
      axisBehavior === strVisible
        ? strHidden
        : (axisBehavior.replace(`${strVisible}-`, '') as OverflowStyle);
    const axisOverflowVisible = overflowIsVisible(axisBehavior);
    const perpendicularOverflowVisible = overflowIsVisible(perpendicularBehavior);

    // if no axis has overflow set 'hidden'
    if (!axisHasOverflow && !perpendicularOverflow) {
      return strHidden;
    }

    // if both axis have a visible behavior ('visible', 'visible-hidden', 'visible-scroll') set 'visible'
    if (axisOverflowVisible && perpendicularOverflowVisible) {
      return strVisible;
    }

    // this this axis has a visible behavior
    if (axisOverflowVisible) {
      const nonPerpendicularOverflow = axisHasOverflow ? strVisible : strHidden;
      return axisHasOverflow && perpendicularOverflow
        ? behaviorStyle // if both axis have an overflow set ('hidden' or 'scroll')
        : nonPerpendicularOverflow; // if only this axis has an overflow set 'visible', if no axis has an overflow set 'hidden'
    }

    const nonOverflow =
      perpendicularOverflowVisible && perpendicularOverflow ? strVisible : strHidden;
    return axisHasOverflow
      ? behaviorStyle // if this axis has an overflow
      : nonOverflow; // if the perp. axis has a visible behavior and has an overflow set 'visible', otherwise set 'hidden'
  };

  const _overflowStyle = {
    x: getAxisOverflowStyle(overflowBehavior.x, hasOverflow.x, overflowBehavior.y, hasOverflow.y),
    y: getAxisOverflowStyle(overflowBehavior.y, hasOverflow.y, overflowBehavior.x, hasOverflow.x),
  };

  return {
    _overflowStyle,
    _overflowScroll: {
      x: _overflowStyle.x === strScroll,
      y: _overflowStyle.y === strScroll,
    },
  };
};
