import { getRTLCompatibleScrollBounds, mathMax, mathMin, mathRound } from '~/support';
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
  structureSetupState: StructureSetupState,
  isHorizontal?: boolean
) => {
  const axis = isHorizontal ? 'x' : 'y';
  const { _overflowAmount, _overflowEdge } = structureSetupState;
  const viewportSize = _overflowEdge[axis];
  const overflowAmount = _overflowAmount[axis];

  return capNumber(0, 1, viewportSize / (viewportSize + overflowAmount));
};

export const getScrollbarHandleOffsetRatio = (
  structureSetupState: StructureSetupState,
  scrollPercent: number,
  isHorizontal?: boolean
) => {
  const lengthRatio = getScrollbarHandleLengthRatio(structureSetupState, isHorizontal);

  return (1 / lengthRatio) * (1 - lengthRatio) * scrollPercent;
};
