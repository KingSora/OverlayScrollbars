import { getStyles, strHidden, strOverflowX, strOverflowY, strVisible } from '~/support';
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
  viewportStyleObj?: StyleObject | false | null | undefined
): ViewportOverflowState => {
  const { _viewport } = structureSetupElements;
  const getStatePerAxis = (styleKey: StyleObjectKey) => {
    const viewportStyleObjStyle = viewportStyleObj && viewportStyleObj[styleKey];
    const overflowStyle = viewportStyleObjStyle || getStyles(_viewport, styleKey);
    const overflowScroll = overflowStyle === 'scroll';

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
  const setAxisOverflowStyle = (
    axisBehavior: OverflowBehavior,
    axisHasOverflow: boolean,
    perpendicularBehavior: OverflowBehavior,
    perpendicularOverflow: boolean
  ) => {
    // convert behavior to style:
    // 'visible'        -> 'hidden'
    // 'hidden'         -> 'hidden'
    // 'scroll'         -> 'scroll'
    // 'visible-hidden' -> 'hidden'
    // 'visible-scroll' -> 'scroll'
    const behaviorStyle =
      axisBehavior === 'visible' ? strHidden : axisBehavior.replace(`${strVisible}-`, '');
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

  viewportStyleObj[strOverflowX] = setAxisOverflowStyle(
    overflowOption.x,
    hasOverflow.x,
    overflowOption.y,
    hasOverflow.y
  );
  viewportStyleObj[strOverflowY] = setAxisOverflowStyle(
    overflowOption.y,
    hasOverflow.y,
    overflowOption.x,
    hasOverflow.x
  );

  return getViewportOverflowState(structureSetupElements, viewportStyleObj);
};
