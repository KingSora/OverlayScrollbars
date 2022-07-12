import { createState, createOptionCheck } from 'setups/setups';
import {
  createScrollbarsSetupElements,
  ScrollbarsSetupElementsObj,
} from 'setups/scrollbarsSetup/scrollbarsSetup.elements';
import type { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';
import type { ReadonlyOSOptions } from 'options';
import type { Setup } from 'setups';
import type { InitializationTarget } from 'initialization';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScrollbarsSetupState {}

export interface ScrollbarsSetupStaticState {
  _elements: ScrollbarsSetupElementsObj;
  _appendElements: () => void;
}

export const createScrollbarsSetup = (
  target: InitializationTarget,
  options: ReadonlyOSOptions,
  structureSetupElements: StructureSetupElementsObj
): Setup<ScrollbarsSetupState, ScrollbarsSetupStaticState> => {
  const state = createState({});
  const [getState] = state;

  const [elements, appendElements, destroyElements] = createScrollbarsSetupElements(
    target,
    structureSetupElements
  );

  const scrollbarsSetupState = getState.bind(0) as (() => ScrollbarsSetupState) &
    ScrollbarsSetupStaticState;
  scrollbarsSetupState._elements = elements;
  scrollbarsSetupState._appendElements = appendElements;

  return [
    (changedOptions, force?) => {
      const checkOption = createOptionCheck(options, changedOptions, force);
      // eslint-disable-next-line no-console
      console.log(checkOption);
    },
    scrollbarsSetupState,
    () => {
      destroyElements();
    },
  ];
};
