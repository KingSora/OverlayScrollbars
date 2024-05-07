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
  inArray,
  strWidth,
  strHeight,
  concat,
  assignDeep,
  ratioToCssPercent,
  numberToCssPx,
  setStyles,
  createOrKeepArray,
  getBoundingClientRect,
  capNumber,
  getScrollCoordinatesPercent,
  isDefaultDirectionScrollCoordinates,
} from '~/support';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
} from '~/classnames';
import { getEnvironment } from '~/environment';
import { dynamicInitializationElement as generalDynamicInitializationElement } from '~/initialization';
import type { XY } from '~/support';
import type {
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
} from '~/initialization';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
import type { ScrollbarsSetupEvents } from './scrollbarsSetup.events';
import type { StyleObject } from '~/typings';
import type { StructureSetupState } from '../structureSetup';

export interface ScrollbarStructure {
  _scrollbar: HTMLElement;
  _track: HTMLElement;
  _handle: HTMLElement;
}

export interface ScrollbarsSetupElement {
  _scrollTimeline: AnimationTimeline | undefined;
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
  _horizontal: ScrollbarsSetupElement;
  _vertical: ScrollbarsSetupElement;
}

export type ScrollbarsSetupElements = [
  elements: ScrollbarsSetupElementsObj,
  appendElements: () => () => void
];

type PotentialAnimation = Animation | false | null | undefined;

export const createScrollbarsSetupElements = (
  target: InitializationTarget,
  structureSetupElements: StructureSetupElementsObj,
  structureSetupState: StructureSetupState,
  scrollbarsSetupEvents: ScrollbarsSetupEvents
): ScrollbarsSetupElements => {
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
  const elementAnimations = new Map<HTMLElement, PotentialAnimation[]>();
  const initScrollTimeline = (axis: keyof XY<unknown>) =>
    scrollT &&
    new scrollT({
      source: _scrollOffsetElement,
      axis,
    });
  const scrollTimeline = {
    x: initScrollTimeline('x'),
    y: initScrollTimeline('y'),
  };
  const evaluatedScrollbarSlot = generalDynamicInitializationElement<
    [InitializationTargetElement, HTMLElement, HTMLElement]
  >(
    [_target, _host, _viewport],
    () => (_viewportIsTarget && _isBody ? _target : _host),
    defaultInitScrollbarsSlot,
    initScrollbarsSlot
  );

  /**
   * Gets the scrollbar handle length ratio.
   * @param isHorizontal Whether the axis is horizontal.
   * @param scrollbarStructure The scrollbar structure. Only passed when the length ratio is calculated for the offset ratio (respects handle min. & max. size via. css)
   * @returns The scrollbar handle length ratio.
   */
  const getScrollbarHandleLengthRatio = (
    isHorizontal: boolean | undefined,
    scrollbarStructure?: ScrollbarStructure
  ) => {
    if (scrollbarStructure) {
      const axis = isHorizontal ? strWidth : strHeight;
      const { _track, _handle } = scrollbarStructure;

      const handleSize = getBoundingClientRect(_handle)[axis];
      const trackSize = getBoundingClientRect(_track)[axis];

      return capNumber(0, 1, handleSize / trackSize || 0);
    }

    const axis = isHorizontal ? 'x' : 'y';
    const { _overflowAmount, _overflowEdge } = structureSetupState;

    const viewportSize = _overflowEdge[axis];
    const overflowAmount = _overflowAmount[axis];

    return capNumber(0, 1, viewportSize / (viewportSize + overflowAmount) || 0);
  };

  /**
   * Gets the scrollbar handle offset ratio.
   * @param structureSetupState The structure setup state.
   * @param scrollbarStructure The scrollbar structure.
   * @param scrollPercent The scroll percent 0..1.
   * @param isHorizontal Whether the axis is horizontal.
   * @returns The scrollbar handle offset ratio.
   */
  const getScrollbarHandleOffsetRatio = (
    scrollbarStructure: ScrollbarStructure,
    scrollPercent: number,
    isHorizontal?: boolean
  ) => {
    const lengthRatio = getScrollbarHandleLengthRatio(isHorizontal, scrollbarStructure);

    return (1 / lengthRatio) * (1 - lengthRatio) * scrollPercent;
  };

  /**
   * Adds additional directional keyframes to the passed keyframes.
   * @param keyframes The keyframes.
   * @param directionRTL Whether the direction is RTL.
   * @returns The passed keyframes with additional directional keyframes.
   */
  const addDirectionRTLKeyframes = (keyframes: Keyframe[] | PropertyIndexedKeyframes | null) =>
    assignDeep(keyframes, {
      // dummy keyframe which fixes bug where the scrollbar handle is reverted to origin position when it should be at its max position
      clear: ['left'],
    });

  /**
   * Cancels the animations of the passed elements or of all elements if no elements are passed.
   * @param elements The elements of which the animation shall be canceled.
   */
  const cancelElementAnimations = (elements?: HTMLElement | HTMLElement[]) => {
    elementAnimations.forEach((currAnimations, element) => {
      const doCancel = elements ? inArray(createOrKeepArray(elements), element) : true;
      if (doCancel) {
        each(currAnimations || [], (animation) => {
          animation && animation.cancel();
        });
        elementAnimations.delete(element);
      }
    });
  };

  /**
   * Sets of overwrites the animation of the passed element.
   * @param element The element of which the animation shall be set.
   * @param timeline The animation timeline of the animation.
   * @param keyframes The keyframes of the animation.
   * @param composite The composite information of the animation.
   */
  const setElementAnimation = (
    element: HTMLElement,
    timeline: AnimationTimeline,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    composite?: CompositeOperation
  ) => {
    const activeAnimations = elementAnimations.get(element) || [];
    const activeAnimation = activeAnimations.find(
      (animation) => animation && animation.timeline === timeline
    );

    if (activeAnimation) {
      activeAnimation.effect = new KeyframeEffect(element, keyframes, { composite });
    } else {
      elementAnimations.set(
        element,
        concat(activeAnimations, [
          element.animate(keyframes, {
            timeline,
            composite,
          }),
        ])
      );
    }
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
    elmStyle: (
      scrollbarStructure: ScrollbarStructure
    ) => [HTMLElement | false | null | undefined, StyleObject | false | null | undefined]
  ) => {
    each(scrollbarStructures, (scrollbarStructure) => {
      const [elm, styles] = elmStyle(scrollbarStructure);
      setStyles(elm, styles);
    });
  };
  const scrollbarStructureRefreshHandleLength = (
    scrollbarStructures: ScrollbarStructure[],
    isHorizontal?: boolean
  ) => {
    scrollbarStyle(scrollbarStructures, (structure) => {
      const { _handle } = structure;
      return [
        _handle,
        {
          [isHorizontal ? strWidth : strHeight]: ratioToCssPercent(
            getScrollbarHandleLengthRatio(isHorizontal)
          ),
        },
      ];
    });
  };
  const scrollbarStructureRefreshHandleOffset = (
    scrollbarStructures: ScrollbarStructure[],
    isHorizontal?: boolean
  ) => {
    const { _scrollCoordinates } = structureSetupState;
    const xyKey = isHorizontal ? 'x' : 'y';
    const axisScrollTimeline = scrollTimeline[xyKey];
    const axisIsDefaultDirectionScroll =
      isDefaultDirectionScrollCoordinates(_scrollCoordinates)[xyKey];
    const getAxisTransformValue = (scrollbarStructure: ScrollbarStructure, scrollPercent: number) =>
      getTrasformTranslateValue(
        ratioToCssPercent(
          getScrollbarHandleOffsetRatio(
            scrollbarStructure,
            axisIsDefaultDirectionScroll ? scrollPercent : 1 - scrollPercent,
            isHorizontal
          )
        ),
        isHorizontal
      );

    if (axisScrollTimeline) {
      each(scrollbarStructures, (structure: ScrollbarStructure) => {
        const { _handle } = structure;
        setElementAnimation(
          _handle,
          axisScrollTimeline,
          addDirectionRTLKeyframes({
            transform: [0, 1].map((percent) => getAxisTransformValue(structure, percent)),
          })
        );
      });
    } else {
      scrollbarStyle(scrollbarStructures, (structure) => [
        structure._handle,
        {
          transform: getAxisTransformValue(
            structure,
            getScrollCoordinatesPercent(_scrollCoordinates, getElementScroll(_scrollOffsetElement))[
              xyKey
            ]
          ),
        },
      ]);
    }
  };
  const doRefreshScrollbarOffset = (scrollbar: HTMLElement) =>
    _viewportIsTarget && !_isBody && parent(scrollbar) === _viewport;

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
  const refreshScrollbarsHandleLength = () => {
    scrollbarStructureRefreshHandleLength(horizontalScrollbars, true);
    scrollbarStructureRefreshHandleLength(verticalScrollbars);
  };
  const refreshScrollbarsHandleOffset = () => {
    scrollbarStructureRefreshHandleOffset(horizontalScrollbars, true);
    scrollbarStructureRefreshHandleOffset(verticalScrollbars);
  };
  const refreshScrollbarsScrollbarOffset = () => {
    if (_viewportIsTarget) {
      const { _overflowAmount, _scrollCoordinates } = structureSetupState;
      const isDefaultDirectionScroll = isDefaultDirectionScrollCoordinates(_scrollCoordinates);
      const cushion = 0.5; // otherwise it sometimes happens that scrolling to 100% will cause the scrollbars to disappear

      if (scrollTimeline.x && scrollTimeline.y) {
        each(concat(verticalScrollbars, horizontalScrollbars), ({ _scrollbar }) => {
          if (doRefreshScrollbarOffset(_scrollbar)) {
            const setScrollbarElementAnimation = (axis: keyof XY<unknown>) =>
              setElementAnimation(
                _scrollbar,
                scrollTimeline[axis],
                addDirectionRTLKeyframes({
                  transform: [0, isDefaultDirectionScroll[axis] ? 1 : -1].map((percent) =>
                    getTrasformTranslateValue(
                      numberToCssPx(percent * (_overflowAmount[axis] - cushion)),
                      axis === 'x'
                    )
                  ),
                }),
                'add'
              );

            setScrollbarElementAnimation('x');
            setScrollbarElementAnimation('y');
          } else {
            cancelElementAnimations(_scrollbar);
          }
        });
      } else {
        const scrollPercent = getScrollCoordinatesPercent(
          _scrollCoordinates,
          getElementScroll(_scrollOffsetElement)
        );
        const styleScrollbarPosition = (structure: ScrollbarStructure) => {
          const { _scrollbar } = structure;
          const elm = doRefreshScrollbarOffset(_scrollbar) && _scrollbar;
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
                x: getTranslateValue(
                  scrollPercent.x,
                  _overflowAmount.x,
                  isDefaultDirectionScroll.x
                ),
                y: getTranslateValue(
                  scrollPercent.y,
                  _overflowAmount.y,
                  isDefaultDirectionScroll.y
                ),
              }),
            },
          ] as [HTMLElement | false, StyleObject | false];
        };
        scrollbarStyle(horizontalScrollbars, styleScrollbarPosition);
        scrollbarStyle(verticalScrollbars, styleScrollbarPosition);
      }
    }
  };
  const generateScrollbarDOM = (isHorizontal?: boolean): ScrollbarStructure => {
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

    push(isHorizontal ? horizontalScrollbars : verticalScrollbars, result);
    push(destroyFns, [
      appendChildren(scrollbar, track),
      appendChildren(track, handle),
      bind(removeElements, scrollbar),
      cancelElementAnimations,
      scrollbarsSetupEvents(
        result,
        scrollbarsAddRemoveClass,
        scrollbarStructureRefreshHandleOffset,
        isHorizontal
      ),
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
      _refreshScrollbarsScrollbarOffset: refreshScrollbarsScrollbarOffset,
      _scrollbarsAddRemoveClass: scrollbarsAddRemoveClass,
      _horizontal: {
        _scrollTimeline: scrollTimeline.x,
        _scrollbarStructures: horizontalScrollbars,
        _clone: generateHorizontalScrollbarStructure,
        _style: bind(scrollbarStyle, horizontalScrollbars),
      },
      _vertical: {
        _scrollTimeline: scrollTimeline.y,
        _scrollbarStructures: verticalScrollbars,
        _clone: generateVerticalScrollbarStructure,
        _style: bind(scrollbarStyle, verticalScrollbars),
      },
    },
    appendElements,
  ];
};
