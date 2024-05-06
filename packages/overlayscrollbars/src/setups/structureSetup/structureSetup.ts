import { getEnvironment } from '~/environment';
import {
  assignDeep,
  each,
  getElementScroll,
  scrollElementTo,
  strHidden,
  strMarginBottom,
  strMarginLeft,
  strMarginRight,
  strPaddingBottom,
  strPaddingLeft,
  strPaddingRight,
  strPaddingTop,
  type TRBL,
  type XY,
} from '~/support';
import { dataValueViewportMeasuring } from '~/classnames';
import type { StructureSetupElementsObj } from './structureSetup.elements';
import type {
  ObserversSetupState,
  ObserversSetupUpdateHints,
  Setup,
  SetupUpdateInfo,
} from '~/setups';
import type { InitializationTarget } from '~/initialization';
import type { StyleObject, OverflowStyle } from '~/typings';
import { createStructureSetupElements } from './structureSetup.elements';
import {
  createOverflowUpdateSegment,
  createPaddingUpdateSegment,
  createTrinsicUpdateSegment,
} from './updateSegments';

export interface StructureSetupState {
  _padding: TRBL;
  _paddingAbsolute: boolean;
  _viewportPaddingStyle: StyleObject;
  _overflowEdge: XY<number>;
  _overflowAmount: XY<number>;
  _overflowStyle: XY<OverflowStyle>;
  _hasOverflow: XY<boolean>;
}

export interface StructureSetupUpdateInfo extends SetupUpdateInfo {
  _observersState: ObserversSetupState;
  _observersUpdateHints?: ObserversSetupUpdateHints;
}

export type StructureSetupUpdateHints = {
  _overflowEdgeChanged?: boolean;
  _overflowAmountChanged?: boolean;
  _overflowStyleChanged?: boolean;
  _paddingStyleChanged?: boolean;
};

export type StructureSetup = [
  ...Setup<StructureSetupUpdateInfo, StructureSetupState, StructureSetupUpdateHints>,
  /** The elements created by the structure setup. */
  StructureSetupElementsObj,
  /** Function to be called when the initialization was canceled. */
  () => void
];

export type StructureUpdateSegment = (
  updateInfo: StructureSetupUpdateInfo,
  updateHints: Readonly<StructureSetupUpdateHints>
) => StructureSetupUpdateHints | void;

export type CreateStructureUpdateSegment = (
  structureSetupElements: StructureSetupElementsObj,
  state: StructureSetupState
) => StructureUpdateSegment;

export const createStructureSetup = (target: InitializationTarget): StructureSetup => {
  const [elements, appendStructureElements, canceled] = createStructureSetupElements(target);
  const state: StructureSetupState = {
    _padding: {
      t: 0,
      r: 0,
      b: 0,
      l: 0,
    },
    _paddingAbsolute: false,
    _viewportPaddingStyle: {
      [strMarginRight]: 0,
      [strMarginBottom]: 0,
      [strMarginLeft]: 0,
      [strPaddingTop]: 0,
      [strPaddingRight]: 0,
      [strPaddingBottom]: 0,
      [strPaddingLeft]: 0,
    },
    _overflowEdge: { x: 0, y: 0 },
    _overflowAmount: { x: 0, y: 0 },
    _overflowStyle: {
      x: strHidden,
      y: strHidden,
    },
    _hasOverflow: {
      x: false,
      y: false,
    },
  };
  const { _target, _scrollOffsetElement, _viewportIsTarget, _viewportAddRemoveClass } = elements;
  const { _nativeScrollbarsHiding, _nativeScrollbarsOverlaid } = getEnvironment();
  const doViewportArrange =
    !_nativeScrollbarsHiding && (_nativeScrollbarsOverlaid.x || _nativeScrollbarsOverlaid.y);

  const updateSegments: StructureUpdateSegment[] = [
    createTrinsicUpdateSegment(elements, state),
    createPaddingUpdateSegment(elements, state),
    createOverflowUpdateSegment(elements, state),
  ];

  return [
    appendStructureElements,
    (updateInfo) => {
      const updateHints: StructureSetupUpdateHints = {};
      const adjustScrollOffset = doViewportArrange;
      const scrollOffset = adjustScrollOffset && getElementScroll(_scrollOffsetElement);
      const removeMeasuring = _viewportAddRemoveClass(dataValueViewportMeasuring, true);

      each(updateSegments, (updateSegment) => {
        assignDeep(updateHints, updateSegment(updateInfo, updateHints) || {});
      });

      scrollElementTo(_scrollOffsetElement, scrollOffset);
      !_viewportIsTarget && scrollElementTo(_target, 0);
      removeMeasuring();

      return updateHints;
    },
    state,
    elements,
    canceled,
  ];
};
