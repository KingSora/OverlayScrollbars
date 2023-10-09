import { createStructureSetupElements } from '~/setups/structureSetup/structureSetup.elements';
import { createStructureSetupUpdate } from '~/setups/structureSetup/structureSetup.update';
import { type PartialOptions } from '~/options';
import type { OptionsCheckFn } from '~/options';
import type { StructureSetupElementsObj } from '~/setups/structureSetup/structureSetup.elements';
import type { TRBL, XY } from '~/support';
import type { ObserversSetupState, ObserversSetupUpdateHints, Setup } from '~/setups';
import type { InitializationTarget } from '~/initialization';
import type { StyleObject, OverflowStyle } from '~/typings';

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

export interface StructureSetup
  extends Setup<StructureSetupUpdateInfo, StructureSetupState, StructureSetupUpdateHints> {
  /** The elements created by the structure setup. */
  _elements: StructureSetupElementsObj;
  /** Function to be called when the initialization was canceled. */
  _canceled: () => void;
}

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
  const updateStructure = createStructureSetupUpdate(elements, state);

  return {
    _create: appendStructureElements,
    _update: updateStructure,
    _state: state,
    _elements: elements,
    _canceled: canceled,
  };
};
