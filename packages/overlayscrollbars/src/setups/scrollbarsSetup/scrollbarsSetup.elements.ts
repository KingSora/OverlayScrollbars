import type { XY } from '../../support';
import type {
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
} from '../../initialization';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
import type { ScrollbarsSetupEvents } from './scrollbarsSetup.events';
import type { StyleObject } from '../../typings';
import type { StructureSetupState } from '../structureSetup';
import { dynamicInitializationElement as generalDynamicInitializationElement } from '../../initialization';
import { getEnvironment } from '../../environment';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
} from '../../classnames';
import {
  addClass,
  appendChildren,
  createDiv,
  each,
  getTrasformTranslateValue,
  isBoolean,
  parent,
  push,
  removeClass,
  removeElements,
  runEachAndClear,
  scrollT,
  bind,
  getElementScroll,
  numberToCssPx,
  setStyles,
  capNumber,
  getScrollCoordinatesPercent,
  isDefaultDirectionScrollCoordinates,
  roundCssNumber,
  selfClearTimeout,
} from '../../support';

export interface ScrollbarStructure {
  _scrollbar: HTMLElement;
  _track: HTMLElement;
  _handle: HTMLElement;
}

export interface ScrollbarsSetupElement {
  _scrollbarStructures: ScrollbarStructure[];
  _clone: () => ScrollbarStructure;
  _style: (
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
  _refreshScrollbarsHandleLength: () => void;
  _refreshScrollbarsHandleOffset: () => void;
  _refreshScrollbarsScrollbarOffset: () => void;
  _refreshScrollbarsScrollCoordinates: () => void;
  _horizontal: ScrollbarsSetupElement;
  _vertical: ScrollbarsSetupElement;
}

export type ScrollbarsSetupElements = [
  elements: ScrollbarsSetupElementsObj,
  appendElements: () => () => void,
];

type ScrollbarStyleFn = (
  scrollbarStructure: ScrollbarStructure
) => [HTMLElement | false | null | undefined, StyleObject | false | null | undefined];

export const createScrollbarsSetupElements = (
  target: InitializationTarget,
  structureSetupElements: StructureSetupElementsObj,
  structureSetupState: StructureSetupState,
  scrollbarsSetupEvents: ScrollbarsSetupEvents
): ScrollbarsSetupElements => {
  const cssCustomPropViewportPercent = '--os-viewport-percent';
  const cssCustomPropScrollPercent = '--os-scroll-percent';
  const cssCustomPropScrollDirection = '--os-scroll-direction';
  const { _getDefaultInitialization } = getEnvironment();
  const { scrollbars: defaultInitScrollbars } = _getDefaultInitialization();
  const { slot: defaultInitScrollbarsSlot } = defaultInitScrollbars;
  const {
    _target,
    _host,
    _viewport,
    _targetIsElm,
    _scrollOffsetElement,
    _isBody,
    _viewportIsTarget,
  } = structureSetupElements;
  const { scrollbars: scrollbarsInit } = (_targetIsElm ? {} : target) as InitializationTargetObject;
  const { slot: initScrollbarsSlot } = scrollbarsInit || {};
  const destroyFns: (() => void)[] = [];
  const horizontalScrollbars: ScrollbarStructure[] = [];
  const verticalScrollbars: ScrollbarStructure[] = [];
  const evaluatedScrollbarSlot = generalDynamicInitializationElement<
    [InitializationTargetElement, HTMLElement, HTMLElement]
  >(
    [_target, _host, _viewport],
    () => (_viewportIsTarget && _isBody ? _target : _host),
    defaultInitScrollbarsSlot,
    initScrollbarsSlot
  );

  const initScrollTimeline = (axis: keyof XY<unknown>) => {
    if (scrollT) {
      let currAnimation: Animation | null = null;
      let currAnimationTransform: string[] = [];
      const [setAnimationTimeout, clearAnimationTimeout] = selfClearTimeout();
      const timeline = new scrollT({
        source: _scrollOffsetElement,
        axis,
      });
      const cancelAnimation = () => {
        clearAnimationTimeout();
        if (currAnimation) {
          currAnimation.cancel();
        }
        currAnimation = null;
      };
      const _setScrollPercentAnimation = (structure: ScrollbarStructure) => {
        const { _scrollCoordinates } = structureSetupState;
        const defaultDirectionScroll =
          isDefaultDirectionScrollCoordinates(_scrollCoordinates)[axis];
        const isHorizontal = axis === 'x';
        const transformArray = [
          getTrasformTranslateValue(0, isHorizontal),
          getTrasformTranslateValue(`calc(-100% + 100cq${isHorizontal ? 'w' : 'h'})`, isHorizontal),
        ];
        const transform = defaultDirectionScroll ? transformArray : transformArray.reverse();

        // if the animation keyframes are identical, do nothing and keep current animation
        if (
          currAnimationTransform[0] === transform[0] &&
          currAnimationTransform[1] === transform[1]
        ) {
          return cancelAnimation;
        }

        currAnimationTransform = transform;

        // timeout is just a workaround for incorrect safari implementation
        // more info: https://github.com/KingSora/OverlayScrollbars/issues/735
        setAnimationTimeout(() => {
          cancelAnimation();
          currAnimation = structure._handle.animate(
            {
              // dummy keyframe which fixes bug where the scrollbar handle is reverted to origin position when it should be at its max position
              clear: ['left'],
              // transform is a temporary fix for: https://github.com/KingSora/OverlayScrollbars/issues/705
              // can be reverted to just animate "cssCustomPropScrollPercent" when browsers implement an optimization possibility
              transform,
              // [cssCustomPropScrollPercent]: [0, 1],
            },
            {
              timeline,
            }
          );
        });

        return cancelAnimation;
      };

      return {
        _setScrollPercentAnimation,
      };
    }
  };
  const scrollTimeline = {
    x: initScrollTimeline('x'),
    y: initScrollTimeline('y'),
  };
  const getViewportPercent = () => {
    const { _overflowAmount, _overflowEdge } = structureSetupState;
    const getAxisValue = (axisViewportSize: number, axisOverflowAmount: number) =>
      capNumber(0, 1, axisViewportSize / (axisViewportSize + axisOverflowAmount) || 0);

    return {
      x: getAxisValue(_overflowEdge.x, _overflowAmount.x),
      y: getAxisValue(_overflowEdge.y, _overflowAmount.y),
    };
  };
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
  const scrollbarStyle = (
    scrollbarStructures: ScrollbarStructure[],
    elmStyle: ScrollbarStyleFn
  ) => {
    each(scrollbarStructures, (scrollbarStructure) => {
      const [elm, styles] = elmStyle(scrollbarStructure);
      setStyles(elm, styles);
    });
  };
  const scrollbarsAddRemoveClass = (
    className: string | false | null | undefined,
    add?: boolean,
    onlyHorizontal?: boolean
  ) => {
    const singleAxis = isBoolean(onlyHorizontal);
    const runHorizontal = singleAxis ? onlyHorizontal : true;
    const runVertical = singleAxis ? !onlyHorizontal : true;
    if (runHorizontal) {
      scrollbarStructureAddRemoveClass(horizontalScrollbars, className, add);
    }
    if (runVertical) {
      scrollbarStructureAddRemoveClass(verticalScrollbars, className, add);
    }
  };
  const refreshScrollbarsHandleLength = () => {
    const viewportPercent = getViewportPercent();
    const createScrollbarStyleFn =
      (axisViewportPercent: number): ScrollbarStyleFn =>
      (structure: ScrollbarStructure) => [
        structure._scrollbar,
        {
          [cssCustomPropViewportPercent]: roundCssNumber(axisViewportPercent) + '',
        },
      ];

    scrollbarStyle(horizontalScrollbars, createScrollbarStyleFn(viewportPercent.x));
    scrollbarStyle(verticalScrollbars, createScrollbarStyleFn(viewportPercent.y));
  };
  const refreshScrollbarsHandleOffset = () => {
    if (!scrollT) {
      const { _scrollCoordinates } = structureSetupState;
      const scrollPercent = getScrollCoordinatesPercent(
        _scrollCoordinates,
        getElementScroll(_scrollOffsetElement)
      );
      const createScrollbarStyleFn =
        (axisScrollPercent: number): ScrollbarStyleFn =>
        (structure: ScrollbarStructure) => [
          structure._scrollbar,
          {
            [cssCustomPropScrollPercent]: roundCssNumber(axisScrollPercent) + '',
          },
        ];

      scrollbarStyle(horizontalScrollbars, createScrollbarStyleFn(scrollPercent.x));
      scrollbarStyle(verticalScrollbars, createScrollbarStyleFn(scrollPercent.y));
    }
  };
  const refreshScrollbarsScrollCoordinates = () => {
    const { _scrollCoordinates } = structureSetupState;
    const defaultDirectionScroll = isDefaultDirectionScrollCoordinates(_scrollCoordinates);
    const createScrollbarStyleFn =
      (axisIsDefaultDirectionScrollCoordinates: boolean): ScrollbarStyleFn =>
      (structure: ScrollbarStructure) => [
        structure._scrollbar,
        {
          [cssCustomPropScrollDirection]: axisIsDefaultDirectionScrollCoordinates ? '0' : '1',
        },
      ];

    scrollbarStyle(horizontalScrollbars, createScrollbarStyleFn(defaultDirectionScroll.x));
    scrollbarStyle(verticalScrollbars, createScrollbarStyleFn(defaultDirectionScroll.y));

    // temporary fix for: https://github.com/KingSora/OverlayScrollbars/issues/705
    if (scrollT) {
      horizontalScrollbars.forEach(scrollTimeline.x!._setScrollPercentAnimation);
      verticalScrollbars.forEach(scrollTimeline.y!._setScrollPercentAnimation);
    }
  };
  const refreshScrollbarsScrollbarOffset = () => {
    if (_viewportIsTarget && !_isBody) {
      const { _overflowAmount, _scrollCoordinates } = structureSetupState;
      const isDefaultDirectionScroll = isDefaultDirectionScrollCoordinates(_scrollCoordinates);
      const scrollPercent = getScrollCoordinatesPercent(
        _scrollCoordinates,
        getElementScroll(_scrollOffsetElement)
      );
      const styleScrollbarPosition: ScrollbarStyleFn = (structure: ScrollbarStructure) => {
        const { _scrollbar } = structure;
        const elm = parent(_scrollbar) === _viewport && _scrollbar;
        const getTranslateValue = (
          axisScrollPercent: number,
          axisOverflowAmount: number,
          axisIsDefaultCoordinates: boolean
        ) => {
          const px = axisOverflowAmount * axisScrollPercent;
          return numberToCssPx(axisIsDefaultCoordinates ? px : -px);
        };

        return [
          elm,
          elm && {
            transform: getTrasformTranslateValue({
              x: getTranslateValue(scrollPercent.x, _overflowAmount.x, isDefaultDirectionScroll.x),
              y: getTranslateValue(scrollPercent.y, _overflowAmount.y, isDefaultDirectionScroll.y),
            }),
          },
        ];
      };

      scrollbarStyle(horizontalScrollbars, styleScrollbarPosition);
      scrollbarStyle(verticalScrollbars, styleScrollbarPosition);
    }
  };
  const generateScrollbarDOM = (isHorizontal?: boolean): ScrollbarStructure => {
    const xyKey = isHorizontal ? 'x' : 'y';
    const scrollbarClassName = isHorizontal
      ? classNameScrollbarHorizontal
      : classNameScrollbarVertical;
    const scrollbar = createDiv(`${classNameScrollbar} ${scrollbarClassName}`);
    const track = createDiv(classNameScrollbarTrack);
    const handle = createDiv(classNameScrollbarHandle);
    const result = {
      _scrollbar: scrollbar,
      _track: track,
      _handle: handle,
    };
    const timeline = scrollTimeline[xyKey];

    push(isHorizontal ? horizontalScrollbars : verticalScrollbars, result);
    push(destroyFns, [
      appendChildren(scrollbar, track),
      appendChildren(track, handle),
      bind(removeElements, scrollbar),
      timeline && timeline._setScrollPercentAnimation(result),
      scrollbarsSetupEvents(result, scrollbarsAddRemoveClass, isHorizontal),
    ]);

    return result;
  };
  const generateHorizontalScrollbarStructure = bind(generateScrollbarDOM, true);
  const generateVerticalScrollbarStructure = bind(generateScrollbarDOM, false);
  const appendElements = () => {
    appendChildren(evaluatedScrollbarSlot, horizontalScrollbars[0]._scrollbar);
    appendChildren(evaluatedScrollbarSlot, verticalScrollbars[0]._scrollbar);

    return bind(runEachAndClear, destroyFns);
  };

  generateHorizontalScrollbarStructure();
  generateVerticalScrollbarStructure();

  return [
    {
      _refreshScrollbarsHandleLength: refreshScrollbarsHandleLength,
      _refreshScrollbarsHandleOffset: refreshScrollbarsHandleOffset,
      _refreshScrollbarsScrollCoordinates: refreshScrollbarsScrollCoordinates,
      _refreshScrollbarsScrollbarOffset: refreshScrollbarsScrollbarOffset,
      _scrollbarsAddRemoveClass: scrollbarsAddRemoveClass,
      _horizontal: {
        _scrollbarStructures: horizontalScrollbars,
        _clone: generateHorizontalScrollbarStructure,
        _style: bind(scrollbarStyle, horizontalScrollbars),
      },
      _vertical: {
        _scrollbarStructures: verticalScrollbars,
        _clone: generateVerticalScrollbarStructure,
        _style: bind(scrollbarStyle, verticalScrollbars),
      },
    },
    appendElements,
  ];
};
