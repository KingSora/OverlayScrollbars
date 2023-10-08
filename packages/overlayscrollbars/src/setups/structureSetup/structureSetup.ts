import {
  createEventListenerHub,
  directionIsRTL,
  isEmptyObject,
  keys,
  scrollLeft,
  scrollTop,
} from '~/support';
import { createStructureSetupElements } from '~/setups/structureSetup/structureSetup.elements';
import { createStructureSetupUpdate } from '~/setups/structureSetup/structureSetup.update';
import { createStructureSetupObservers } from '~/setups/structureSetup/structureSetup.observers';
import { createOptionCheck, type PartialOptions, type ReadonlyOptions } from '~/options';
import type { StructureSetupUpdateHints } from '~/setups/structureSetup/structureSetup.update';
import type { StructureSetupElementsObj } from '~/setups/structureSetup/structureSetup.elements';
import type { TRBL, XY, EventListener } from '~/support';
import type { Setup } from '~/setups';
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
  _heightIntrinsic: boolean;
  _directionIsRTL: boolean;
}

export interface StructureSetupUpdateInfo {
  _changedOptions: PartialOptions;
  _force: boolean;
}

export interface StructureSetup
  extends Setup<StructureSetupUpdateInfo, StructureSetupState, boolean> {
  _elements: StructureSetupElementsObj;
  _addOnUpdatedListener: (listener: EventListener<StructureSetupEventMap, 'u'>) => void;
}

type StructureSetupEventMap = {
  u: [updateHints: StructureSetupUpdateHints, changedOptions: PartialOptions, force: boolean];
};

const initialXYNumber = { x: 0, y: 0 };
const createInitialStructureSetupUpdateState = (
  elements: StructureSetupElementsObj
): StructureSetupState => ({
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
  _directionIsRTL: directionIsRTL(elements._host),
});

export const createStructureSetup = (
  target: InitializationTarget,
  options: ReadonlyOptions
): StructureSetup => {
  const checkOptionsFallback = createOptionCheck(options, {});
  const [addEvent, removeEvent, triggerEvent] = createEventListenerHub<StructureSetupEventMap>();
  const [elements, appendStructureElements, destroyElements] = createStructureSetupElements(target);
  const state = createInitialStructureSetupUpdateState(elements);
  const updateStructure = createStructureSetupUpdate(elements, state);
  const triggerUpdateEvent: (...args: StructureSetupEventMap['u']) => boolean = (
    updateHints,
    changedOptions,
    force
  ) => {
    const truthyUpdateHints = keys(updateHints).some(
      (key) => !!updateHints[key as keyof StructureSetupUpdateHints]
    );
    const changed = truthyUpdateHints || !isEmptyObject(changedOptions) || force;
    if (changed) {
      triggerEvent('u', [updateHints, changedOptions, force]);
    }
    return changed;
  };
  const [destroyObservers, appendObserverElements, updateObservers, updateObserversOptions] =
    createStructureSetupObservers(elements, state, (updateHints) =>
      triggerUpdateEvent(updateStructure(checkOptionsFallback, updateHints), {}, false)
    );

  return {
    _create: () => {
      const { _target, _viewport, _documentElm, _isBody } = elements;
      const scrollingElement = _isBody ? _documentElm.documentElement : _target;
      const initialScrollLeft = scrollLeft(scrollingElement);
      const initialScrollTop = scrollTop(scrollingElement);

      appendObserverElements();
      appendStructureElements();

      scrollLeft(_viewport, initialScrollLeft);
      scrollTop(_viewport, initialScrollTop);

      return () => {
        removeEvent();
        destroyObservers();
        destroyElements();
      };
    },
    _update: ({ _changedOptions, _force }) => {
      const checkOption = createOptionCheck(options, _changedOptions, _force);
      updateObserversOptions(checkOption);
      return triggerUpdateEvent(
        updateStructure(checkOption, updateObservers(), _force),
        _changedOptions,
        _force
      );
    },
    _state: state,
    _elements: elements,
    _addOnUpdatedListener: (listener) => addEvent('u', listener),
  };
};
