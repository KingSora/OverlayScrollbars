import { getBoundingClientRect, mathMax, mathMin, mathRound } from '~/support';
import { getEnvironment } from '~/environment';
import type { StructureSetupState } from '~/setups';

const capNumber = (min: number, max: number, number: number) => mathMax(min, mathMin(max, number));

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
  const axis = isHorizontal ? 'width' : 'height';
  const handleSize = getBoundingClientRect(scrollbarHandle)[axis];
  const trackSize = getBoundingClientRect(scrollbarTrack)[axis];
  return capNumber(0, 1, handleSize / trackSize);
};

export const getScrollbarHandleOffsetRatio = (
  scrollbarHandle: HTMLElement,
  scrollbarTrack: HTMLElement,
  scrollOffsetElement: HTMLElement,
  structureSetupState: StructureSetupState,
  isRTL: boolean,
  isHorizontal?: boolean
) => {
  const { _rtlScrollBehavior } = getEnvironment();
  const axis = isHorizontal ? 'x' : 'y';
  const scrollLeftTop = isHorizontal ? 'Left' : 'Top';
  const { _overflowAmount } = structureSetupState;
  const scrollPositionMax = mathRound(_overflowAmount[axis]);
  // cap scroll position in min / max bounds to prevent overscroll visual glitches (https://github.com/KingSora/OverlayScrollbars/issues/559)
  const scrollPosition = capNumber(
    0,
    scrollPositionMax,
    scrollOffsetElement[`scroll${scrollLeftTop}`]
  );
  const handleRTL = isHorizontal && isRTL;
  const rtlNormalizedScrollPosition = _rtlScrollBehavior.i
    ? scrollPosition
    : scrollPositionMax - scrollPosition;
  const finalScrollPosition = handleRTL ? rtlNormalizedScrollPosition : scrollPosition;
  const scrollPercent = mathMin(1, finalScrollPosition / scrollPositionMax);
  const lengthRatio = getScrollbarHandleLengthRatio(scrollbarHandle, scrollbarTrack, isHorizontal);

  return (1 / lengthRatio) * (1 - lengthRatio) * scrollPercent;
};
