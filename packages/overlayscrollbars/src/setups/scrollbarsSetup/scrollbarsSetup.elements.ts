import { appendChildren, createDiv, removeElements } from 'support';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
} from 'classnames';
import { getEnvironment } from 'environment';
import { dynamicInitializationElement as generalDynamicInitializationElement } from 'initialization';
import type { InitializationTarget } from 'initialization';
import type { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';
import type {
  ScrollbarsInitialization,
  ScrollbarsInitializationStrategy,
  ScrollbarsDynamicInitializationElement,
} from 'setups/scrollbarsSetup/scrollbarsSetup.initialization';

export interface ScrollbarStructure {
  _scrollbar: HTMLElement;
  _track: HTMLElement;
  _handle: HTMLElement;
}

export interface ScrollbarsSetupElementsObj {
  _horizontalScrollbarStructure: ScrollbarStructure;
  _verticalScrollbarStructure: ScrollbarStructure;
}

export type ScrollbarsSetupElements = [
  elements: ScrollbarsSetupElementsObj,
  appendElements: () => void,
  destroy: () => void
];

const generateScrollbarDOM = (scrollbarClassName: string): ScrollbarStructure => {
  const scrollbar = createDiv(`${classNameScrollbar} ${scrollbarClassName} os-theme-dark`);
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
  target: InitializationTarget,
  structureSetupElements: StructureSetupElementsObj
): ScrollbarsSetupElements => {
  const { _getInitializationStrategy } = getEnvironment();
  const { _scrollbarsSlot: environmentScrollbarSlot } =
    _getInitializationStrategy() as ScrollbarsInitializationStrategy;
  const { _target, _host, _viewport, _targetIsElm } = structureSetupElements;
  const initializationScrollbarSlot =
    !_targetIsElm && (target as ScrollbarsInitialization).scrollbarsSlot;
  const evaluatedScrollbarSlot =
    generalDynamicInitializationElement<ScrollbarsDynamicInitializationElement>(
      [_target, _host, _viewport],
      () => _host,
      environmentScrollbarSlot,
      initializationScrollbarSlot
    );

  const horizontalScrollbarStructure = generateScrollbarDOM(classNameScrollbarHorizontal);
  const verticalScrollbarStructure = generateScrollbarDOM(classNameScrollbarVertical);

  const { _scrollbar: horizontalScrollbar } = horizontalScrollbarStructure;
  const { _scrollbar: verticalScrollbar } = verticalScrollbarStructure;

  const appendElements = () => {
    appendChildren(evaluatedScrollbarSlot, horizontalScrollbar);
    appendChildren(evaluatedScrollbarSlot, verticalScrollbar);
  };

  return [
    {
      _horizontalScrollbarStructure: horizontalScrollbarStructure,
      _verticalScrollbarStructure: verticalScrollbarStructure,
    },
    appendElements,
    removeElements.bind(0, [horizontalScrollbar, verticalScrollbar]),
  ];
};
