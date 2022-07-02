import { each, isNumber, scrollLeft, scrollTop, assignDeep, keys } from 'support';
import { getEnvironment } from 'environment';
import {
  createTrinsicUpdate,
  createPaddingUpdate,
  createOverflowUpdate,
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
  _overflowScrollChanged: boolean;
  _overflowAmountChanged: boolean;
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
  const { _viewport } = structureSetupElements;
  const { _nativeScrollbarStyling, _nativeScrollbarIsOverlaid, _flexboxGlue } = getEnvironment();
  const doViewportArrange =
    !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);

  const updateSegments: StructureSetupUpdateSegment[] = [
    createTrinsicUpdate(structureSetupElements, state),
    createPaddingUpdate(structureSetupElements, state),
    createOverflowUpdate(structureSetupElements, state),
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
          _overflowScrollChanged: false,
          _overflowAmountChanged: false,
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

    let adaptivedUpdateHints: Required<StructureSetupUpdateHints> = initialUpdateHints;
    each(updateSegments, (updateSegment) => {
      adaptivedUpdateHints = prepareUpdateHints<StructureSetupUpdateHints>(
        adaptivedUpdateHints,
        updateSegment(adaptivedUpdateHints, checkOption, !!force) || {},
        force
      );
    });

    if (isNumber(scrollOffsetX)) {
      scrollLeft(_viewport, scrollOffsetX);
    }
    if (isNumber(scrollOffsetY)) {
      scrollTop(_viewport, scrollOffsetY);
    }

    return adaptivedUpdateHints;
  };
};
