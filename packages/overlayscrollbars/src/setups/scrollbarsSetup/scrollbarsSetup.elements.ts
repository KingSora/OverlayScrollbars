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
import type { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';

export interface ScrollbarStructure {
  _scrollbar: HTMLElement;
  _track: HTMLElement;
  _handle: HTMLElement;
}

export interface ScrollbarsSetupElementsObj {
  _horizontalScrollbarStructure: ScrollbarStructure;
  _verticalScrollbarStructure: ScrollbarStructure;
}

export type ScrollbarsSetupElements = [elements: ScrollbarsSetupElementsObj, destroy: () => void];

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

export const createScrollbarsSetupElements = (
  target: OSTarget,
  structureSetupElements: StructureSetupElementsObj
): ScrollbarsSetupElements => {
  const { _getInitializationStrategy } = getEnvironment();
  const { _scrollbarsSlot: environmentScrollbarSlot } =
    _getInitializationStrategy() as ScrollbarsInitializationStrategy;
  const { _target, _host, _viewport, _targetIsElm } = structureSetupElements;
  const initializationScrollbarSlot =
    !_targetIsElm && (target as ScrollbarsInitialization).scrollbarsSlot;
  const initializationScrollbarSlotResult = isFunction(initializationScrollbarSlot)
    ? initializationScrollbarSlot(_target, _host, _viewport)
    : initializationScrollbarSlot;
  const evaluatedScrollbarSlot =
    initializationScrollbarSlotResult ||
    (isFunction(environmentScrollbarSlot)
      ? environmentScrollbarSlot(_target, _host, _viewport)
      : environmentScrollbarSlot) ||
    _host;

  const horizontalScrollbarStructure = generateScrollbarDOM(classNameScrollbarHorizontal);
  const verticalScrollbarStructure = generateScrollbarDOM(classNameScrollbarVertical);

  const { _scrollbar: horizontalScrollbar } = horizontalScrollbarStructure;
  const { _scrollbar: verticalScrollbar } = verticalScrollbarStructure;

  appendChildren(evaluatedScrollbarSlot, horizontalScrollbar);
  appendChildren(evaluatedScrollbarSlot, verticalScrollbar);

  return [
    {
      _horizontalScrollbarStructure: horizontalScrollbarStructure,
      _verticalScrollbarStructure: verticalScrollbarStructure,
    },
    removeElements.bind(0, [horizontalScrollbar, verticalScrollbar]),
  ];
};
