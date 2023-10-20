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

export const getScrollbarHandleLengthRatio = (
  scrollbarHandle: HTMLElement,
  scrollbarTrack: HTMLElement,
  isHorizontal?: boolean,
  structureSetupState?: StructureSetupState
) => {
  if (structureSetupState) {
    const axis = isHorizontal ? 'x' : 'y';
    const { _overflowAmount, _overflowEdge } = structureSetupState;

    const viewportSize = _overflowEdge[axis];
    const overflowAmount = _overflowAmount[axis];
    return capNumber(0, 1, viewportSize / (viewportSize + overflowAmount));
  }
  const axis = isHorizontal ? strWidth : strHeight;
  const handleSize = getBoundingClientRect(scrollbarHandle)[axis];
  const trackSize = getBoundingClientRect(scrollbarTrack)[axis];
  return capNumber(0, 1, handleSize / trackSize);
};

export const getScrollbarHandleOffsetRatio = (
  scrollbarHandle: HTMLElement,
  scrollbarTrack: HTMLElement,
  scrollPercent: number,
  isHorizontal?: boolean
) => {
  const lengthRatio = getScrollbarHandleLengthRatio(scrollbarHandle, scrollbarTrack, isHorizontal);

  return (1 / lengthRatio) * (1 - lengthRatio) * scrollPercent;
};
