import { appendChildren, createDiv, removeElements, isFunction } from 'support';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
} from 'classnames';
import { getEnvironment, ScrollbarsInitializationStrategy } from 'environment';
import { OSTarget, ScrollbarsInitialization } from 'typings';
import { StructureSetup } from 'setups/structureSetup';

export interface ScrollbarStructure {
  _scrollbar: HTMLElement;
  _track: HTMLElement;
  _handle: HTMLElement;
}

export interface ScrollbarsSetup {
  _horizontalScrollbarStructure: ScrollbarStructure;
  _verticalScrollbarStructure: ScrollbarStructure;
  _destroy: () => void;
}

const generateScrollbarDOM = (scrollbarClassName: string): ScrollbarStructure => {
  const scrollbar = createDiv(`${classNameScrollbar} ${scrollbarClassName}`);
  const track = createDiv(classNameScrollbarTrack);
  const handle = createDiv(classNameScrollbarHandle);

  appendChildren(scrollbar, track);
  appendChildren(track, handle);

  return {
    _scrollbar: scrollbar,
    _track: track,
    _handle: handle,
  };
};

export const createScrollbarsSetup = (target: OSTarget | ScrollbarsInitialization, structureSetup: StructureSetup): ScrollbarsSetup => {
  const { _getInitializationStrategy } = getEnvironment();
  const { _scrollbarsSlot: environmentScrollbarSlot } = _getInitializationStrategy() as ScrollbarsInitializationStrategy;
  const { _targetObj, _targetCtx } = structureSetup;
  const { _target, _host, _viewport } = _targetObj;
  const initializationScrollbarSlot = !_targetCtx._targetIsElm && (target as ScrollbarsInitialization).scrollbarsSlot;
  const initializationScrollbarSlotResult = isFunction(initializationScrollbarSlot)
    ? initializationScrollbarSlot(_target, _host, _viewport)
    : initializationScrollbarSlot;
  const evaluatedScrollbarSlot =
    initializationScrollbarSlotResult ||
    (isFunction(environmentScrollbarSlot) ? environmentScrollbarSlot(_target, _host, _viewport) : environmentScrollbarSlot) ||
    _host;

  const horizontalScrollbarStructure = generateScrollbarDOM(classNameScrollbarHorizontal);
  const verticalScrollbarStructure = generateScrollbarDOM(classNameScrollbarVertical);

  const { _scrollbar: horizontalScrollbar } = horizontalScrollbarStructure;
  const { _scrollbar: verticalScrollbar } = verticalScrollbarStructure;

  appendChildren(evaluatedScrollbarSlot, horizontalScrollbar);
  appendChildren(evaluatedScrollbarSlot, verticalScrollbar);

  return {
    _horizontalScrollbarStructure: horizontalScrollbarStructure,
    _verticalScrollbarStructure: verticalScrollbarStructure,
    _destroy() {
      removeElements([horizontalScrollbar, verticalScrollbar]);
    },
  };
};
