import { type PartialOptions } from '~/options';
import { getEnvironment } from '~/environment';
import { assignDeep, each, scrollLeft, scrollTop, type TRBL, type XY } from '~/support';
import { dataValueHostUpdating } from '~/classnames';
import type { OptionsCheckFn } from '~/options';
import type { StructureSetupElementsObj } from './structureSetup.elements';
import type { ObserversSetupState, ObserversSetupUpdateHints, Setup } from '~/setups';
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

export interface StructureSetupUpdateInfo {
  _checkOption: OptionsCheckFn;
  _changedOptions?: PartialOptions;
  _force?: boolean;
  _observersUpdateHints?: ObserversSetupUpdateHints;
  _observersState: ObserversSetupState;
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
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
    },
    _overflowEdge: { x: 0, y: 0 },
    _overflowAmount: { x: 0, y: 0 },
    _overflowStyle: {
      x: 'hidden',
      y: 'hidden',
    },
    _hasOverflow: {
      x: false,
      y: false,
    },
  };
  const { _target, _viewport, _viewportAddRemoveClass, _viewportIsTarget } = elements;
  const { _nativeScrollbarsHiding, _nativeScrollbarsOverlaid, _flexboxGlue } = getEnvironment();
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
    },
    state,
    elements,
    canceled,
  ];
};
