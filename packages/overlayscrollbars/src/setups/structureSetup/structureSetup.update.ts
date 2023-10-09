import { each, scrollLeft, scrollTop, assignDeep } from '~/support';
import { getEnvironment } from '~/environment';
import { dataValueHostUpdating } from '~/classnames';
import {
  createTrinsicUpdateSegment,
  createPaddingUpdateSegment,
  createOverflowUpdateSegment,
} from '~/setups/structureSetup/updateSegments';
import type {
  StructureSetupState,
  StructureSetupUpdateHints,
  StructureSetupUpdateInfo,
} from '~/setups/structureSetup';
import type { StructureSetupElementsObj } from '~/setups/structureSetup/structureSetup.elements';

export type StructureSetupUpdate = (
  updateInfo: StructureSetupUpdateInfo
) => StructureSetupUpdateHints;

export type StructureUpdateSegment = (
  updateInfo: StructureSetupUpdateInfo,
  updateHints: Readonly<StructureSetupUpdateHints>
) => StructureSetupUpdateHints | void;

export type CreateStructureUpdateSegment = (
  structureSetupElements: StructureSetupElementsObj,
  state: StructureSetupState
) => StructureUpdateSegment;

export const createStructureSetupUpdate = (
  structureSetupElements: StructureSetupElementsObj,
  state: StructureSetupState
): StructureSetupUpdate => {
  const { _target, _viewport, _viewportAddRemoveClass, _viewportIsTarget } = structureSetupElements;
  const { _nativeScrollbarsHiding, _nativeScrollbarsOverlaid, _flexboxGlue } = getEnvironment();
  const doViewportArrange =
    !_nativeScrollbarsHiding && (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y);

  const updateSegments: StructureUpdateSegment[] = [
    createTrinsicUpdateSegment(structureSetupElements, state),
    createPaddingUpdateSegment(structureSetupElements, state),
    createOverflowUpdateSegment(structureSetupElements, state),
  ];

  return (updateInfo) => {
    const updateHints: StructureSetupUpdateHints = {};
    const adjustScrollOffset = doViewportArrange || !_flexboxGlue;
    const scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
    const scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);
    _viewportAddRemoveClass('', dataValueHostUpdating, true);

    each(updateSegments, (updateSegment) => {
      assignDeep(updateHints, updateSegment(updateInfo, updateHints) || {});
    });

    scrollLeft(_viewport, scrollOffsetX);
    scrollTop(_viewport, scrollOffsetY);
    _viewportAddRemoveClass('', dataValueHostUpdating);

    if (!_viewportIsTarget) {
      scrollLeft(_target, 0);
      scrollTop(_target, 0);
    }

    return updateHints;
  };
};
