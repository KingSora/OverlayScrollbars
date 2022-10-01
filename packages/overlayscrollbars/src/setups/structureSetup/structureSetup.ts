import { createEventListenerHub, isEmptyObject, keys, scrollLeft, scrollTop } from '~/support';
import { createState, createOptionCheck } from '~/setups/setups';
import { createStructureSetupElements } from '~/setups/structureSetup/structureSetup.elements';
import { createStructureSetupUpdate } from '~/setups/structureSetup/structureSetup.update';
import { createStructureSetupObservers } from '~/setups/structureSetup/structureSetup.observers';
import type { StructureSetupUpdateHints } from '~/setups/structureSetup/structureSetup.update';
import type { StructureSetupElementsObj } from '~/setups/structureSetup/structureSetup.elements';
import type { TRBL, XY, EventListener } from '~/support';
import type { Options, ReadonlyOptions } from '~/options';
import type { Setup } from '~/setups';
import type { InitializationTarget } from '~/initialization';
import type { DeepPartial, StyleObject, OverflowStyle } from '~/typings';

export interface StructureSetupState {
  _padding: TRBL;
  _paddingAbsolute: boolean;
  _viewportPaddingStyle: StyleObject;
  _overflowEdge: XY<number>;
  _overflowAmount: XY<number>;
  _overflowStyle: XY<OverflowStyle>;
  _hasOverflow: XY<boolean>;
  _heightIntrinsic: boolean;
  _directionIsRTL: boolean;
}

export interface StructureSetupStaticState {
  _elements: StructureSetupElementsObj;
  _appendElements: () => void;
  _addOnUpdatedListener: (listener: EventListener<StructureSetupEventMap, 'u'>) => void;
}

type StructureSetupEventMap = {
  u: [updateHints: StructureSetupUpdateHints, changedOptions: DeepPartial<Options>, force: boolean];
};

const initialXYNumber = { x: 0, y: 0 };
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
  _overflowEdge: initialXYNumber,
  _overflowAmount: initialXYNumber,
  _overflowStyle: {
    x: 'hidden',
    y: 'hidden',
  },
  _hasOverflow: {
    x: false,
    y: false,
  },
  _heightIntrinsic: false,
  _directionIsRTL: false,
};

export const createStructureSetup = (
  target: InitializationTarget,
  options: ReadonlyOptions
): Setup<StructureSetupState, StructureSetupStaticState, [], boolean> => {
  const checkOptionsFallback = createOptionCheck(options, {});
  const state = createState(initialStructureSetupUpdateState);
  const [addEvent, removeEvent, triggerEvent] = createEventListenerHub<StructureSetupEventMap>();
  const [getState, setState] = state;
  const [elements, appendStructureElements, destroyElements] = createStructureSetupElements(target);
  const updateStructure = createStructureSetupUpdate(elements, state);
  const triggerUpdateEvent: (...args: StructureSetupEventMap['u']) => boolean = (
    updateHints,
    changedOptions,
    force
  ) => {
    const truthyUpdateHints = keys(updateHints).some((key) => updateHints[key]);
    const changed = truthyUpdateHints || !isEmptyObject(changedOptions) || force;
    if (changed) {
      triggerEvent('u', [updateHints, changedOptions, force]);
    }
    return changed;
  };
  const [destroyObservers, appendObserverElements, updateObservers, updateObserversOptions] =
    createStructureSetupObservers(elements, setState, (updateHints) =>
      triggerUpdateEvent(updateStructure(checkOptionsFallback, updateHints), {}, false)
    );

  const structureSetupState = getState.bind(0) as (() => StructureSetupState) &
    StructureSetupStaticState;
  structureSetupState._addOnUpdatedListener = (listener) => addEvent('u', listener);
  structureSetupState._appendElements = () => {
    const { _target, _viewport } = elements;
    const initialScrollLeft = scrollLeft(_target);
    const initialScrollTop = scrollTop(_target);

    appendObserverElements();
    appendStructureElements();

    scrollLeft(_viewport, initialScrollLeft);
    scrollTop(_viewport, initialScrollTop);
  };
  structureSetupState._elements = elements;

  return [
    (changedOptions, force?) => {
      const checkOption = createOptionCheck(options, changedOptions, force);
      updateObserversOptions(checkOption);
      return triggerUpdateEvent(
        updateStructure(checkOption, updateObservers(), force),
        changedOptions,
        !!force
      );
    },
    structureSetupState,
    () => {
      removeEvent();
      destroyObservers();
      destroyElements();
    },
  ];
};
