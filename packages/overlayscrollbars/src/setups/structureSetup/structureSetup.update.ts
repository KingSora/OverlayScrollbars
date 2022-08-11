import { each, scrollLeft, scrollTop, assignDeep, keys } from 'support';
import { getEnvironment } from 'environment';
import { dataValueHostUpdating } from 'classnames';
import {
  createTrinsicUpdateSegment,
  createPaddingUpdateSegment,
  createOverflowUpdateSegment,
} from 'setups/structureSetup/updateSegments';
import type { SetupState, SetupUpdateSegment, SetupUpdateCheckOption } from 'setups';
import type { StructureSetupState } from 'setups/structureSetup';
import type { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';

export type CreateStructureUpdateSegment = (
  structureSetupElements: StructureSetupElementsObj,
  state: SetupState<StructureSetupState>
) => StructureSetupUpdateSegment;

export type StructureSetupUpdateSegment = SetupUpdateSegment<StructureSetupUpdateHints>;

export type StructureSetupUpdate = (
  checkOption: SetupUpdateCheckOption,
  updateHints: Partial<StructureSetupUpdateHints>,
  force?: boolean
) => StructureSetupUpdateHints;

export interface StructureSetupUpdateHints {
  _sizeChanged: boolean;
  _directionChanged: boolean;
  _heightIntrinsicChanged: boolean;
  _overflowEdgeChanged: boolean;
  _overflowAmountChanged: boolean;
  _overflowStyleChanged: boolean;
  _paddingStyleChanged: boolean;
  _hostMutation: boolean;
  _contentMutation: boolean;
}

const prepareUpdateHints = <T extends StructureSetupUpdateHints>(
  leading: Required<T>,
  adaptive?: Partial<T>,
  force?: boolean
): Required<T> => {
  const result = {};
  const finalAdaptive = adaptive || {};
  const objKeys = keys(leading).concat(keys(finalAdaptive));

  each(objKeys, (key) => {
    const leadingValue = leading[key];
    const adaptiveValue = finalAdaptive[key];
    result[key] = !!(force || leadingValue || adaptiveValue);
  });

  return result as Required<T>;
};

export const createStructureSetupUpdate = (
  structureSetupElements: StructureSetupElementsObj,
  state: SetupState<StructureSetupState>
): StructureSetupUpdate => {
  const { _target, _viewport, _viewportAddRemoveClass, _viewportIsTarget } = structureSetupElements;
  const { _nativeScrollbarsHiding, _nativeScrollbarsOverlaid, _flexboxGlue } = getEnvironment();
  const doViewportArrange =
    !_nativeScrollbarsHiding && (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y);

  const updateSegments: StructureSetupUpdateSegment[] = [
    createTrinsicUpdateSegment(structureSetupElements, state),
    createPaddingUpdateSegment(structureSetupElements, state),
    createOverflowUpdateSegment(structureSetupElements, state),
  ];

  return (
    checkOption: SetupUpdateCheckOption,
    updateHints: Partial<StructureSetupUpdateHints>,
    force?: boolean
  ) => {
    const initialUpdateHints = prepareUpdateHints(
      assignDeep(
        {
          _sizeChanged: false,
          _paddingStyleChanged: false,
          _directionChanged: false,
          _heightIntrinsicChanged: false,
          _overflowEdgeChanged: false,
          _overflowAmountChanged: false,
          _overflowStyleChanged: false,
          _hostMutation: false,
          _contentMutation: false,
        },
        updateHints
      ),
      {},
      force
    );
    const adjustScrollOffset = doViewportArrange || !_flexboxGlue;
    const scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
    const scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);
    _viewportAddRemoveClass('', dataValueHostUpdating, true);

    let adaptivedUpdateHints: Required<StructureSetupUpdateHints> = initialUpdateHints;
    each(updateSegments, (updateSegment) => {
      adaptivedUpdateHints = prepareUpdateHints<StructureSetupUpdateHints>(
        adaptivedUpdateHints,
        updateSegment(adaptivedUpdateHints, checkOption, !!force) || {},
        force
      );
    });

    scrollLeft(_viewport, scrollOffsetX);
    scrollTop(_viewport, scrollOffsetY);
    _viewportAddRemoveClass('', dataValueHostUpdating);

    if (!_viewportIsTarget) {
      scrollLeft(_target, 0);
      scrollTop(_target, 0);
    }

    return adaptivedUpdateHints;
  };
};
