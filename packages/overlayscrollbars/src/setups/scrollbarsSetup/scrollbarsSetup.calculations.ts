import {
  getBoundingClientRect,
  getRTLCompatibleScrollBounds,
  mathMax,
  mathMin,
  mathRound,
  strHeight,
  strWidth,
} from '~/support';
import type { Environment } from '~/environment';
import type { StructureSetupState } from '~/setups';
import type { ScrollbarStructure } from './scrollbarsSetup.elements';

const capNumber = (min: number, max: number, number: number) => mathMax(min, mathMin(max, number));

export const getScrollbarHandleOffsetPercent = (
  scrollPos: number,
  overflowAmount: number,
  rtlScrollBehavior?: Environment['rtlScrollBehavior'] | false
) => {
  const rawScrollPosMax = mathRound(overflowAmount);
  const [scrollPositionMin, scrollPositionMax] = getRTLCompatibleScrollBounds(
    rawScrollPosMax,
    rtlScrollBehavior
  );

  const scrollPercentNegate = (scrollPositionMax - scrollPos) / scrollPositionMax;
  const scrollPercentInvert = scrollPos / scrollPositionMin;
  const scrollPercentNone = scrollPos / scrollPositionMax;
  const rawScrollPercent = rtlScrollBehavior
    ? rtlScrollBehavior.n
      ? scrollPercentNegate
      : rtlScrollBehavior.i
      ? scrollPercentInvert
      : scrollPercentNone
    : scrollPercentNone;

  return capNumber(0, 1, rawScrollPercent);
};

/**
 * Gets the scrollbar handle length ratio
 * @param structureSetupState The structure setup state.
 * @param isHorizontal Whether the axis is horizontal
 * @param scrollbarStructure The scrollbar structure. Only passed when the length ratio is calculated for the offset ratio (respects handle min. & max. size via. css)
 * @returns The scrollbar handle length ratio.
 */
export const getScrollbarHandleLengthRatio = (
  structureSetupState: StructureSetupState,
  isHorizontal?: boolean,
  scrollbarStructure?: ScrollbarStructure
) => {
  if (scrollbarStructure) {
    const axis = isHorizontal ? strWidth : strHeight;
    const { _track, _handle } = scrollbarStructure;

    const handleSize = getBoundingClientRect(_handle)[axis];
    const trackSize = getBoundingClientRect(_track)[axis];

    return capNumber(0, 1, handleSize / trackSize);
  }

  const axis = isHorizontal ? 'x' : 'y';
  const { _overflowAmount, _overflowEdge } = structureSetupState;

  const viewportSize = _overflowEdge[axis];
  const overflowAmount = _overflowAmount[axis];

  return capNumber(0, 1, viewportSize / (viewportSize + overflowAmount));
};

export const getScrollbarHandleOffsetRatio = (
  structureSetupState: StructureSetupState,
  scrollbarStructure: ScrollbarStructure,
  scrollPercent: number,
  isHorizontal?: boolean
) => {
  const lengthRatio = getScrollbarHandleLengthRatio(
    structureSetupState,
    isHorizontal,
    scrollbarStructure
  );

  return (1 / lengthRatio) * (1 - lengthRatio) * scrollPercent;
};
