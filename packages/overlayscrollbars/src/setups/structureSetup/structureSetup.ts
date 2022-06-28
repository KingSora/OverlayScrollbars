import { runEach } from 'support';
import { getEnvironment } from 'environment';
import { createState, createOptionCheck } from 'setups/setups';
import { createStructureSetupElements } from 'setups/structureSetup/structureSetup.elements';
import {
  createStructureSetupUpdate,
  StructureSetupUpdateHints,
} from 'setups/structureSetup/structureSetup.update';
import { createStructureSetupObservers } from 'setups/structureSetup/structureSetup.observers';
import type { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';
import type { TRBL, CacheValues, XY, WH } from 'support';
import type { OSOptions } from 'options';
import type { Setup } from 'setups';
import type { OSTarget, PartialOptions, StyleObject } from 'typings';

export interface StructureSetupState {
  _padding: TRBL;
  _paddingAbsolute: boolean;
  _viewportPaddingStyle: StyleObject;
  _viewportOverflowScrollCache: CacheValues<XY<boolean>>;
  _viewportOverflowAmountCache: CacheValues<WH<number>>;
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
  _viewportOverflowScrollCache: [
    {
      x: false,
      y: false,
    },
    false,
  ],
  _viewportOverflowAmountCache: [
    {
      w: 0,
      h: 0,
    },
    false,
  ],
  _viewportPaddingStyle: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
};

export const createStructureSetup = (
  target: OSTarget,
  options: OSOptions
): Setup<StructureSetupState, StructureSetupStaticState> => {
  const checkOptionsFallback = createOptionCheck(options, {});
  const state = createState(initialStructureSetupUpdateState);
  const onUpdatedListeners = new Set<OnUpdatedListener>();
  const [getUpdateState] = state;

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
    (updateHints) => {
      runOnUpdatedListeners(updateStructure(checkOptionsFallback, updateHints));
    }
  );

  const removeEnvListener = getEnvironment()._addListener(
    updateStructure.bind(0, checkOptionsFallback, {}, true)
  );

  const structureSetupState = getUpdateState.bind(0) as (() => StructureSetupState) &
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
      removeEnvListener();
      destroyObservers();
      destroyElements();
    },
  ];
};
