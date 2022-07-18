import {
  addClass,
  appendChildren,
  createDiv,
  each,
  isEmptyArray,
  on,
  push,
  removeClass,
  removeElements,
  runEachAndClear,
  setT,
  stopPropagation,
} from 'support';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
  classNamesScrollbarInteraction,
  classNamesScrollbarTransitionless,
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

export interface ScrollbarsSetupElement {
  _scrollbarStructures: ScrollbarStructure[];
  _clone: () => ScrollbarStructure;
  _addRemoveClass: (classNames: string | false | null | undefined, add?: boolean) => void;
  // _removeClass: (classNames: string) => void;
  /*
  _addEventListener: () => void;
  _removeEventListener: () => void;
  */
}

export interface ScrollbarsSetupElementsObj {
  _horizontal: ScrollbarsSetupElement;
  _vertical: ScrollbarsSetupElement;
}

export type ScrollbarsSetupElements = [
  elements: ScrollbarsSetupElementsObj,
  appendElements: () => void,
  destroy: () => void
];

const interactionStartEventNames = 'touchstart mouseenter';
const interactionEndEventNames = 'touchend touchcancel mouseleave';
const stopRootClickPropagation = (scrollbar: HTMLElement, documentElm: Document) =>
  on(
    scrollbar,
    'mousedown',
    on.bind(0, documentElm, 'click', stopPropagation, { _once: true, _capture: true }),
    { _capture: true }
  );

export const createScrollbarsSetupElements = (
  target: InitializationTarget,
  structureSetupElements: StructureSetupElementsObj
): ScrollbarsSetupElements => {
  const { _getInitializationStrategy } = getEnvironment();
  const { scrollbarsSlot: environmentScrollbarSlot } =
    _getInitializationStrategy() as ScrollbarsInitializationStrategy;
  const { _documentElm, _target, _host, _viewport, _targetIsElm } = structureSetupElements;
  const initializationScrollbarSlot = _targetIsElm
    ? null
    : (target as ScrollbarsInitialization).scrollbarsSlot;
  const evaluatedScrollbarSlot =
    generalDynamicInitializationElement<ScrollbarsDynamicInitializationElement>(
      [_target, _host, _viewport],
      () => _host,
      environmentScrollbarSlot,
      initializationScrollbarSlot
    );
  const scrollbarsAddRemoveClass = (
    scrollbarStructures: ScrollbarStructure[],
    classNames: string | false | null | undefined,
    add?: boolean
  ) => {
    const action = add ? addClass : removeClass;
    each(scrollbarStructures, (scrollbarStructure) => {
      action(scrollbarStructure._scrollbar, classNames);
    });
  };
  const destroyFns: (() => void)[] = [];
  const horizontalScrollbars: ScrollbarStructure[] = [];
  const verticalScrollbars: ScrollbarStructure[] = [];

  const addRemoveClassHorizontal = scrollbarsAddRemoveClass.bind(0, horizontalScrollbars);
  const addRemoveClassVertical = scrollbarsAddRemoveClass.bind(0, verticalScrollbars);
  const generateScrollbarDOM = (horizontal?: boolean): ScrollbarStructure => {
    const scrollbarClassName = horizontal
      ? classNameScrollbarHorizontal
      : classNameScrollbarVertical;
    const arrToPush = horizontal ? horizontalScrollbars : verticalScrollbars;
    const transitionlessClass = isEmptyArray(arrToPush) ? classNamesScrollbarTransitionless : '';
    const scrollbar = createDiv(
      `${classNameScrollbar} ${scrollbarClassName} ${transitionlessClass}`
    );
    const track = createDiv(classNameScrollbarTrack);
    const handle = createDiv(classNameScrollbarHandle);
    const result = {
      _scrollbar: scrollbar,
      _track: track,
      _handle: handle,
    };

    appendChildren(scrollbar, track);
    appendChildren(track, handle);

    push(arrToPush, result);
    push(destroyFns, [
      removeElements.bind(0, scrollbar),
      on(scrollbar, interactionStartEventNames, () => {
        addRemoveClassHorizontal(classNamesScrollbarInteraction, true);
        addRemoveClassVertical(classNamesScrollbarInteraction, true);
      }),
      on(scrollbar, interactionEndEventNames, () => {
        addRemoveClassHorizontal(classNamesScrollbarInteraction);
        addRemoveClassVertical(classNamesScrollbarInteraction);
      }),
      stopRootClickPropagation(scrollbar, _documentElm),
    ]);

    return result;
  };
  const generateHorizontalScrollbarStructure = generateScrollbarDOM.bind(0, true);
  const generateVerticalScrollbarStructure = generateScrollbarDOM.bind(0, false);
  const appendElements = () => {
    appendChildren(evaluatedScrollbarSlot, horizontalScrollbars[0]._scrollbar);
    appendChildren(evaluatedScrollbarSlot, verticalScrollbars[0]._scrollbar);

    setT(() => {
      addRemoveClassHorizontal(classNamesScrollbarTransitionless);
      addRemoveClassVertical(classNamesScrollbarTransitionless);
    }, 300);
  };

  generateHorizontalScrollbarStructure();
  generateVerticalScrollbarStructure();

  return [
    {
      _horizontal: {
        _scrollbarStructures: horizontalScrollbars,
        _clone: generateHorizontalScrollbarStructure,
        _addRemoveClass: addRemoveClassHorizontal,
      },
      _vertical: {
        _scrollbarStructures: verticalScrollbars,
        _clone: generateVerticalScrollbarStructure,
        _addRemoveClass: addRemoveClassVertical,
      },
    },
    appendElements,
    runEachAndClear.bind(0, destroyFns),
  ];
};
