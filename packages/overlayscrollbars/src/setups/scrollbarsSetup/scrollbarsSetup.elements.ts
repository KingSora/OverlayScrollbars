import {
  addClass,
  appendChildren,
  createDiv,
  each,
  isBoolean,
  isEmptyArray,
  push,
  removeClass,
  removeElements,
  runEachAndClear,
  setT,
  style,
} from 'support';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
  classNamesScrollbarTransitionless,
} from 'classnames';
import { getEnvironment } from 'environment';
import { dynamicInitializationElement as generalDynamicInitializationElement } from 'initialization';
import type { InitializationTarget } from 'initialization';
import type { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';
import type { ScrollbarsSetupEvents } from 'setups/scrollbarsSetup/scrollbarsSetup.events';
import type {
  ScrollbarsInitialization,
  ScrollbarsDynamicInitializationElement,
} from 'setups/scrollbarsSetup/scrollbarsSetup.initialization';
import type { StyleObject } from 'typings';

export interface ScrollbarStructure {
  _scrollbar: HTMLElement;
  _track: HTMLElement;
  _handle: HTMLElement;
}

export interface ScrollbarsSetupElement {
  _scrollbarStructures: ScrollbarStructure[];
  _clone: () => ScrollbarStructure;
  _handleStyle: (
    elmStyle: (
      scrollbarStructure: ScrollbarStructure
    ) => [HTMLElement | false | null | undefined, StyleObject]
  ) => void;
}

export interface ScrollbarsSetupElementsObj {
  _scrollbarsAddRemoveClass: (
    classNames: string | false | null | undefined,
    add?: boolean,
    isHorizontal?: boolean
  ) => void;
  _horizontal: ScrollbarsSetupElement;
  _vertical: ScrollbarsSetupElement;
}

export type ScrollbarsSetupElements = [
  elements: ScrollbarsSetupElementsObj,
  appendElements: () => void,
  destroy: () => void
];

export const createScrollbarsSetupElements = (
  target: InitializationTarget,
  structureSetupElements: StructureSetupElementsObj,
  scrollbarsSetupEvents: ScrollbarsSetupEvents
): ScrollbarsSetupElements => {
  const { _getDefaultInitialization } = getEnvironment();
  const { scrollbarsSlot: defaultScrollbarsSlot } = _getDefaultInitialization();
  const { _documentElm, _target, _host, _viewport, _targetIsElm, _scrollOffsetElement } =
    structureSetupElements;
  const { scrollbarsSlot } = (_targetIsElm ? {} : target) as ScrollbarsInitialization;
  const evaluatedScrollbarSlot =
    generalDynamicInitializationElement<ScrollbarsDynamicInitializationElement>(
      [_target, _host, _viewport],
      () => _host,
      defaultScrollbarsSlot,
      scrollbarsSlot
    );
  const scrollbarStructureAddRemoveClass = (
    scrollbarStructures: ScrollbarStructure[],
    classNames: string | false | null | undefined,
    add?: boolean
  ) => {
    const action = add ? addClass : removeClass;
    each(scrollbarStructures, (scrollbarStructure) => {
      action(scrollbarStructure._scrollbar, classNames);
    });
  };
  const scrollbarsHandleStyle = (
    scrollbarStructures: ScrollbarStructure[],
    elmStyle: (
      scrollbarStructure: ScrollbarStructure
    ) => [HTMLElement | false | null | undefined, StyleObject]
  ) => {
    each(scrollbarStructures, (scrollbarStructure) => {
      const [elm, styles] = elmStyle(scrollbarStructure);
      style(elm, styles);
    });
  };
  const destroyFns: (() => void)[] = [];
  const horizontalScrollbars: ScrollbarStructure[] = [];
  const verticalScrollbars: ScrollbarStructure[] = [];

  const scrollbarsAddRemoveClass = (
    className: string | false | null | undefined,
    add?: boolean,
    onlyHorizontal?: boolean
  ) => {
    const singleAxis = isBoolean(onlyHorizontal);
    const runHorizontal = singleAxis ? onlyHorizontal : true;
    const runVertical = singleAxis ? !onlyHorizontal : true;
    runHorizontal && scrollbarStructureAddRemoveClass(horizontalScrollbars, className, add);
    runVertical && scrollbarStructureAddRemoveClass(verticalScrollbars, className, add);
  };
  const generateScrollbarDOM = (isHorizontal?: boolean): ScrollbarStructure => {
    const scrollbarClassName = isHorizontal
      ? classNameScrollbarHorizontal
      : classNameScrollbarVertical;
    const arrToPush = isHorizontal ? horizontalScrollbars : verticalScrollbars;
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
      scrollbarsSetupEvents(
        result,
        scrollbarsAddRemoveClass,
        _documentElm,
        _scrollOffsetElement,
        isHorizontal
      ),
    ]);

    return result;
  };
  const generateHorizontalScrollbarStructure = generateScrollbarDOM.bind(0, true);
  const generateVerticalScrollbarStructure = generateScrollbarDOM.bind(0, false);
  const appendElements = () => {
    appendChildren(evaluatedScrollbarSlot, horizontalScrollbars[0]._scrollbar);
    appendChildren(evaluatedScrollbarSlot, verticalScrollbars[0]._scrollbar);

    setT(() => {
      scrollbarsAddRemoveClass(classNamesScrollbarTransitionless);
    }, 300);
  };

  generateHorizontalScrollbarStructure();
  generateVerticalScrollbarStructure();

  return [
    {
      _scrollbarsAddRemoveClass: scrollbarsAddRemoveClass,
      _horizontal: {
        _scrollbarStructures: horizontalScrollbars,
        _clone: generateHorizontalScrollbarStructure,
        _handleStyle: scrollbarsHandleStyle.bind(0, horizontalScrollbars),
      },
      _vertical: {
        _scrollbarStructures: verticalScrollbars,
        _clone: generateVerticalScrollbarStructure,
        _handleStyle: scrollbarsHandleStyle.bind(0, verticalScrollbars),
      },
    },
    appendElements,
    runEachAndClear.bind(0, destroyFns),
  ];
};
