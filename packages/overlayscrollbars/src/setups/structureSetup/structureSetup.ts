import { runEach } from 'support';
import { createState, createOptionCheck } from 'setups/setups';
import { createStructureSetupElements } from 'setups/structureSetup/structureSetup.elements';
import { createStructureSetupUpdate } from 'setups/structureSetup/structureSetup.update';
import { createStructureSetupObservers } from 'setups/structureSetup/structureSetup.observers';
import type { StructureSetupUpdateHints } from 'setups/structureSetup/structureSetup.update';
import type { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';
import type { TRBL, XY, WH } from 'support';
import type { OSOptions, ReadonlyOSOptions } from 'options';
import type { Setup } from 'setups';
import type { OSTarget, PartialOptions, StyleObject } from 'typings';

export interface StructureSetupState {
  _padding: TRBL;
  _paddingAbsolute: boolean;
  _viewportPaddingStyle: StyleObject;
  _overflowScroll: XY<boolean>;
  _overflowAmount: WH<number>;
  _hasOverflow: XY<boolean>;
  _heightIntrinsic: boolean;
  _directionIsRTL: boolean;
}

export interface StructureSetupStaticState {
  _elements: StructureSetupElementsObj;
  _addOnUpdatedListener: (listener: OnUpdatedListener) => void;
}

export type OnUpdatedListener = (
  updateHints: StructureSetupUpdateHints,
  changedOptions: PartialOptions<OSOptions>,
  force: boolean
) => void;

const initialStructureSetupUpdateState: StructureSetupState = {
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
  _overflowAmount: {
    w: 0,
    h: 0,
  },
  _overflowScroll: {
    x: false,
    y: false,
  },
  _hasOverflow: {
    x: false,
    y: false,
  },
  _heightIntrinsic: false,
  _directionIsRTL: false,
};

export const createStructureSetup = (
  target: OSTarget,
  options: ReadonlyOSOptions
): Setup<StructureSetupState, StructureSetupStaticState> => {
  const checkOptionsFallback = createOptionCheck(options, {});
  const state = createState(initialStructureSetupUpdateState);
  const onUpdatedListeners = new Set<OnUpdatedListener>();
  const [getState] = state;
  const runOnUpdatedListeners = (
    updateHints: StructureSetupUpdateHints,
    changedOptions?: PartialOptions<OSOptions>,
    force?: boolean
  ) => {
    runEach(onUpdatedListeners, [updateHints, changedOptions || {}, !!force]);
  };

  const [elements, destroyElements] = createStructureSetupElements(target);
  const updateStructure = createStructureSetupUpdate(elements, state);
  const [updateObservers, destroyObservers] = createStructureSetupObservers(
    elements,
    state,
    (updateHints) => {
      runOnUpdatedListeners(updateStructure(checkOptionsFallback, updateHints));
    }
  );

  const structureSetupState = getState.bind(0) as (() => StructureSetupState) &
    StructureSetupStaticState;
  structureSetupState._addOnUpdatedListener = (listener) => {
    onUpdatedListeners.add(listener);
  };
  structureSetupState._elements = elements;

  return [
    (changedOptions, force?) => {
      const checkOption = createOptionCheck(options, changedOptions, force);
      updateObservers(checkOption);
      runOnUpdatedListeners(updateStructure(checkOption, {}, force));
    },
    structureSetupState,
    () => {
      onUpdatedListeners.clear();
      destroyObservers();
      destroyElements();
    },
  ];
};
