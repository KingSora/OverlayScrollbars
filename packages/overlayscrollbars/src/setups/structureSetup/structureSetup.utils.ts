import { getStyles, strOverflowX, strOverflowY, strVisible } from '~/support';
import type { Env } from '~/environment';
import type { XY } from '~/support';
import type { Options, OptionsCheckFn, OverflowBehavior } from '~/options';
import type { OverflowStyle, StyleObject, StyleObjectKey } from '~/typings';
import type { StructureSetupElementsObj } from './structureSetup.elements';

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
 * Gets the current overflow state of the viewport.
 * @param showNativeOverlaidScrollbars Whether native overlaid scrollbars are shown instead of hidden.
 * @param viewportStyleObj The viewport style object where the overflow scroll property can be read of, or undefined if shall be determined.
 * @returns A object which contains informations about the current overflow state.
 */
export const getViewportOverflowState = (
  structureSetupElements: StructureSetupElementsObj,
  viewportStyleObj?: StyleObject
): ViewportOverflowState => {
  const { _viewport } = structureSetupElements;
  const getStatePerAxis = (styleKey: StyleObjectKey) => {
    const overflowStyle = getStyles(_viewport, styleKey);
    // can't do something like "viewportStyleObj && viewportStyleObj[styleKey] || overflowStyle" here!
    const objectPrefferedOverflowStyle = viewportStyleObj
      ? viewportStyleObj[styleKey]
      : overflowStyle;
    const overflowScroll = objectPrefferedOverflowStyle === 'scroll';

    return [overflowStyle, overflowScroll] as [
      overflowStyle: OverflowStyle,
      overflowScroll: boolean
    ];
  };

  const [xOverflowStyle, xOverflowScroll] = getStatePerAxis(strOverflowX);
  const [yOverflowStyle, yOverflowScroll] = getStatePerAxis(strOverflowY);

  return {
    _overflowStyle: {
      x: xOverflowStyle,
      y: yOverflowStyle,
    },
    _overflowScroll: {
      x: xOverflowScroll,
      y: yOverflowScroll,
    },
  };
};

/**
 * Sets the overflow property of the viewport and calculates the a overflow state according to the new parameters.
 * @param showNativeOverlaidScrollbars Whether to show natively overlaid scrollbars.
 * @param overflowAmount The overflow amount.
 * @param overflow The overflow behavior according to the options.
 * @param viewportStyleObj The viewport style object to which the overflow style shall be applied.
 * @returns A object which represents the newly set overflow state.
 */
export const setViewportOverflowState = (
  structureSetupElements: StructureSetupElementsObj,
  hasOverflow: XY<boolean>,
  overflowOption: XY<OverflowBehavior>,
  viewportStyleObj: StyleObject
): ViewportOverflowState => {
  const hasAnyOverflow = hasOverflow.x || hasOverflow.y;

  const setAxisOverflowStyle = (behavior: OverflowBehavior, hasOverflowAxis: boolean) => {
    const overflowVisible = overflowIsVisible(behavior);
    const fallbackVisibilityBehavior = overflowVisible && hasAnyOverflow ? 'hidden' : '';
    const overflowVisibleBehavior =
      (hasOverflowAxis && overflowVisible && behavior.replace(`${strVisible}-`, '')) ||
      fallbackVisibilityBehavior;

    return [
      hasOverflowAxis && !overflowVisible ? behavior : '',
      overflowIsVisible(overflowVisibleBehavior) ? 'hidden' : overflowVisibleBehavior,
    ];
  };

  const [overflowX, visibleBehaviorX] = setAxisOverflowStyle(overflowOption.x, hasOverflow.x);
  const [overflowY, visibleBehaviorY] = setAxisOverflowStyle(overflowOption.y, hasOverflow.y);

  viewportStyleObj[strOverflowX] = visibleBehaviorX && overflowY ? visibleBehaviorX : overflowX;
  viewportStyleObj[strOverflowY] = visibleBehaviorY && overflowX ? visibleBehaviorY : overflowY;

  return getViewportOverflowState(structureSetupElements, viewportStyleObj);
};
