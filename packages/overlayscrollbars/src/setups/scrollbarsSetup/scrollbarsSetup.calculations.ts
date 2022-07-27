import { offsetSize } from 'support';
import type { StructureSetupState } from 'setups';

const { min, max } = Math;
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
  isHorizontal?: boolean
) => {
  const axis = isHorizontal ? 'x' : 'y';
  const scrollLeftTop = isHorizontal ? 'Left' : 'Top';
  const { _overflowAmount } = structureSetupState;
  const scrollPosition = scrollOffsetElement[`scroll${scrollLeftTop}`] as number;
  const scrollPositionMax = Math.floor(_overflowAmount[axis]);
  const scrollPercent = min(1, scrollPosition / scrollPositionMax);
  const lengthRatio = getScrollbarHandleLengthRatio(scrollbarHandle, scrollbarTrack, isHorizontal);
  return (1 / lengthRatio) * (1 - lengthRatio) * scrollPercent;
};
