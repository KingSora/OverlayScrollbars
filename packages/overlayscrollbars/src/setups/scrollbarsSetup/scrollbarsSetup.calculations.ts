import type { StructureSetupState } from 'setups';

const { min, max } = Math;
export const getScrollbarHandleLengthRatio = (
  structureSetupState: StructureSetupState,
  isHorizontal?: boolean
) => {
  const { _overflowAmount, _overflowEdge } = structureSetupState;
  const axis = isHorizontal ? 'x' : 'y';
  const viewportSize = _overflowEdge[axis];
  const overflowAmount = _overflowAmount[axis];
  return max(0, min(1, viewportSize / (viewportSize + overflowAmount)));
};
export const getScrollbarHandleOffsetRatio = (
  structureSetupState: StructureSetupState,
  scrollOffsetElement: HTMLElement,
  isHorizontal?: boolean
) => {
  const axis = isHorizontal ? 'x' : 'y';
  const scrollLeftTop = isHorizontal ? 'Left' : 'Top';
  const lengthRatio = getScrollbarHandleLengthRatio(structureSetupState, isHorizontal);
  const scrollPosition = scrollOffsetElement[`scroll${scrollLeftTop}`] as number;
  const scrollPositionMax = Math.floor(structureSetupState._overflowAmount[axis]);
  const scrollPercent = min(1, scrollPosition / scrollPositionMax);

  return (1 / lengthRatio) * (1 - lengthRatio) * scrollPercent;
};
