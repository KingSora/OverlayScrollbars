import {
  addClass,
  appendChildren,
  createDiv,
  directionIsRTL,
  each,
  isBoolean,
  isEmptyArray,
  push,
  removeClass,
  removeElements,
  runEachAndClear,
  setT,
  style,
} from '~/support';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
  classNamesScrollbarTransitionless,
} from '~/classnames';
import { getEnvironment } from '~/environment';
import { dynamicInitializationElement as generalDynamicInitializationElement } from '~/initialization';
import {
  getScrollbarHandleLengthRatio,
  getScrollbarHandleOffsetRatio,
} from '~/setups/scrollbarsSetup/scrollbarsSetup.calculations';
import type {
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
} from '~/initialization';
import type { StructureSetupElementsObj } from '~/setups/structureSetup/structureSetup.elements';
import type { ScrollbarsSetupEvents } from '~/setups/scrollbarsSetup/scrollbarsSetup.events';
import type { StyleObject } from '~/typings';
import type { StructureSetupState } from '~/setups';

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
  _refreshScrollbarsHandleLength: (structureSetupState: StructureSetupState) => void;
  _refreshScrollbarsHandleOffset: (structureSetupState: StructureSetupState) => void;
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
  const { scrollbars: defaultInitScrollbars } = _getDefaultInitialization();
  const { slot: defaultInitScrollbarsSlot } = defaultInitScrollbars;
  const { _documentElm, _target, _host, _viewport, _targetIsElm, _scrollOffsetElement } =
    structureSetupElements;
  const { scrollbars: scrollbarsInit } = (_targetIsElm ? {} : target) as InitializationTargetObject;
  const { slot: initScrollbarsSlot } = scrollbarsInit || {};
  const evaluatedScrollbarSlot = generalDynamicInitializationElement<
    [InitializationTargetElement, HTMLElement, HTMLElement]
  >([_target, _host, _viewport], () => _host, defaultInitScrollbarsSlot, initScrollbarsSlot);
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
  const scrollbarStructureRefreshHandleLength = (
    scrollbarStructures: ScrollbarStructure[],
    structureSetupState: StructureSetupState,
    isHorizontal?: boolean
  ) => {
    scrollbarsHandleStyle(scrollbarStructures, (structure) => {
      const { _handle, _track } = structure;
      return [
        _handle,
        {
          [isHorizontal ? 'width' : 'height']: `${(
            getScrollbarHandleLengthRatio(_handle, _track, isHorizontal, structureSetupState) * 100
          ).toFixed(3)}%`,
        },
      ];
    });
  };
  const scrollbarStructureRefreshHandleOffset = (
    scrollbarStructures: ScrollbarStructure[],
    structureSetupState: StructureSetupState,
    isHorizontal?: boolean
  ) => {
    const translateAxis = isHorizontal ? 'X' : 'Y';
    scrollbarsHandleStyle(scrollbarStructures, (structure) => {
      const { _handle, _track, _scrollbar } = structure;
      const offsetRatio = getScrollbarHandleOffsetRatio(
        _handle,
        _track,
        _scrollOffsetElement,
        structureSetupState,
        directionIsRTL(_scrollbar),
        isHorizontal
      );
      // eslint-disable-next-line no-self-compare
      const validOffsetRatio = offsetRatio === offsetRatio; // is false when offset is NaN
      return [
        _handle,
        {
          transform: validOffsetRatio
            ? `translate${translateAxis}(${(offsetRatio * 100).toFixed(3)}%)`
            : '',
        },
      ];
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
  const refreshScrollbarsHandleLength = (structureSetupState: StructureSetupState) => {
    scrollbarStructureRefreshHandleLength(horizontalScrollbars, structureSetupState, true);
    scrollbarStructureRefreshHandleLength(verticalScrollbars, structureSetupState);
  };
  const refreshScrollbarsHandleOffset = (structureSetupState: StructureSetupState) => {
    scrollbarStructureRefreshHandleOffset(horizontalScrollbars, structureSetupState, true);
    scrollbarStructureRefreshHandleOffset(verticalScrollbars, structureSetupState);
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
        _host,
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
      _refreshScrollbarsHandleLength: refreshScrollbarsHandleLength,
      _refreshScrollbarsHandleOffset: refreshScrollbarsHandleOffset,
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
