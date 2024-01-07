import {
  getStyles,
  strMarginBottom,
  strMarginLeft,
  strMarginRight,
  strOverflowX,
  strOverflowY,
  strPaddingBottom,
  strPaddingLeft,
  strPaddingRight,
  strVisible,
  strWidth,
} from '~/support';
import type { InternalEnvironment } from '~/environment';
import type { StructureSetupState } from '.';
import type { XY } from '~/support';
import type { Options, OptionsCheckFn, OverflowBehavior } from '~/options';
import type { OverflowStyle, StyleObject, StyleObjectKey } from '~/typings';
import type { StructureSetupElementsObj } from './structureSetup.elements';

export interface ViewportOverflowState {
  _scrollbarsHideOffset: XY<number>;
  _scrollbarsHideOffsetArrange: XY<boolean>;
  _overflowScroll: XY<boolean>;
  _overflowStyle: XY<OverflowStyle>;
}

const overlaidScrollbarsHideOffset = 42;

export const getShowNativeOverlaidScrollbars = (
  checkOption: OptionsCheckFn<Options>,
  env: InternalEnvironment
) => {
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
  env: InternalEnvironment,
  showNativeOverlaidScrollbars: boolean,
  viewportStyleObj?: StyleObject
): ViewportOverflowState => {
  const { _viewport } = structureSetupElements;
  const { _nativeScrollbarsOverlaid, _nativeScrollbarsSize, _nativeScrollbarsHiding } = env;
  const arrangeHideOffset =
    !_nativeScrollbarsHiding && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
  const getStatePerAxis = (
    styleKey: StyleObjectKey,
    isOverlaid: boolean,
    nativeScrollbarSize: number
  ) => {
    const overflowStyle = getStyles(_viewport, styleKey);
    // can't do something like "viewportStyleObj && viewportStyleObj[styleKey] || overflowStyle" here!
    const objectPrefferedOverflowStyle = viewportStyleObj
      ? viewportStyleObj[styleKey]
      : overflowStyle;
    const overflowScroll = objectPrefferedOverflowStyle === 'scroll';
    const nonScrollbarStylingHideOffset = isOverlaid ? arrangeHideOffset : nativeScrollbarSize;
    const scrollbarsHideOffset =
      overflowScroll && !_nativeScrollbarsHiding ? nonScrollbarStylingHideOffset : 0;
    const scrollbarsHideOffsetArrange = isOverlaid && !!arrangeHideOffset;

    return [overflowStyle, overflowScroll, scrollbarsHideOffset, scrollbarsHideOffsetArrange] as [
      overflowStyle: OverflowStyle,
      overflowScroll: boolean,
      scrollbarsHideOffset: number,
      scrollbarsHideOffsetArrange: boolean
    ];
  };

  const [xOverflowStyle, xOverflowScroll, xScrollbarsHideOffset, xScrollbarsHideOffsetArrange] =
    getStatePerAxis(strOverflowX, _nativeScrollbarsOverlaid.x, _nativeScrollbarsSize.x);
  const [yOverflowStyle, yOverflowScroll, yScrollbarsHideOffset, yScrollbarsHideOffsetArrange] =
    getStatePerAxis(strOverflowY, _nativeScrollbarsOverlaid.y, _nativeScrollbarsSize.y);

  return {
    _overflowStyle: {
      x: xOverflowStyle,
      y: yOverflowStyle,
    },
    _overflowScroll: {
      x: xOverflowScroll,
      y: yOverflowScroll,
    },
    _scrollbarsHideOffset: {
      x: xScrollbarsHideOffset,
      y: yScrollbarsHideOffset,
    },
    _scrollbarsHideOffsetArrange: {
      x: xScrollbarsHideOffsetArrange,
      y: yScrollbarsHideOffsetArrange,
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
  env: InternalEnvironment,
  showNativeOverlaidScrollbars: boolean,
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

  return getViewportOverflowState(
    structureSetupElements,
    env,
    showNativeOverlaidScrollbars,
    viewportStyleObj
  );
};

/**
 * Hides the native scrollbars according to the passed parameters.
 * @param viewportOverflowState The viewport overflow state.
 * @param directionIsRTL Whether the direction is RTL or not.
 * @param viewportArrange Whether special styles related to the viewport arrange strategy shall be applied.
 * @param viewportStyleObj The viewport style object to which the needed styles shall be applied.
 */
export const hideNativeScrollbars = (
  structureSetupState: StructureSetupState,
  viewportOverflowState: ViewportOverflowState,
  directionIsRTL: boolean,
  viewportArrange: boolean,
  viewportStyleObj: StyleObject
): void => {
  const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
  const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
  const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
  const { _viewportPaddingStyle } = structureSetupState;
  const horizontalMarginKey: keyof StyleObject = directionIsRTL ? strMarginLeft : strMarginRight;
  const viewportHorizontalPaddingKey: keyof StyleObject = directionIsRTL
    ? strPaddingLeft
    : strPaddingRight;
  const horizontalMarginValue = _viewportPaddingStyle[horizontalMarginKey] as number;
  const verticalMarginValue = _viewportPaddingStyle[strMarginBottom] as number;
  const horizontalPaddingValue = _viewportPaddingStyle[viewportHorizontalPaddingKey] as number;
  const verticalPaddingValue = _viewportPaddingStyle[strPaddingBottom] as number;

  // horizontal
  viewportStyleObj[strWidth] = `calc(100% + ${hideOffsetY + horizontalMarginValue * -1}px)`;
  viewportStyleObj[horizontalMarginKey] = -hideOffsetY + horizontalMarginValue;

  // vertical
  viewportStyleObj[strMarginBottom] = -hideOffsetX + verticalMarginValue;

  // viewport arrange additional styles
  if (viewportArrange) {
    viewportStyleObj[viewportHorizontalPaddingKey] =
      horizontalPaddingValue + (arrangeY ? hideOffsetY : 0);
    viewportStyleObj[strPaddingBottom] = verticalPaddingValue + (arrangeX ? hideOffsetX : 0);
  }
};
