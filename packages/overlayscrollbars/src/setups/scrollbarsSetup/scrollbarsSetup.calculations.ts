import { offsetSize } from '~/support';
import { getEnvironment } from '~/environment';
import type { StructureSetupState } from '~/setups';

const { min, max, abs, round } = Math;

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
    return max(0, min(1, viewportSize / (viewportSize + overflowAmount)));
  }
  const axis = isHorizontal ? 'w' : 'h';
  const handleSize = offsetSize(scrollbarHandle)[axis];
  const trackSize = offsetSize(scrollbarTrack)[axis];
  return max(0, min(1, handleSize / trackSize));
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
  const scrollPositionMax = round(_overflowAmount[axis]);
  const scrollPosition = abs(scrollOffsetElement[`scroll${scrollLeftTop}`]);
  const handleRTL = isHorizontal && isRTL;
  const rtlNormalizedScrollPosition = _rtlScrollBehavior.i
    ? scrollPosition
    : scrollPositionMax - scrollPosition;
  const finalScrollPosition = handleRTL ? rtlNormalizedScrollPosition : scrollPosition;
  const scrollPercent = min(1, finalScrollPosition / scrollPositionMax);
  const lengthRatio = getScrollbarHandleLengthRatio(scrollbarHandle, scrollbarTrack, isHorizontal);

  return (1 / lengthRatio) * (1 - lengthRatio) * scrollPercent;
};
