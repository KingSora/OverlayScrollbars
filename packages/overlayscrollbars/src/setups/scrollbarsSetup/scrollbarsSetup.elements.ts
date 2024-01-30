import {
  addClass,
  appendChildren,
  createDiv,
  getDirectionIsRTL,
  each,
  getTrasformTranslateValue,
  isBoolean,
  isEmptyArray,
  parent,
  push,
  removeClass,
  removeElements,
  runEachAndClear,
  scrollT,
  setT,
  bind,
  getElmentScroll,
  inArray,
  strWidth,
  strHeight,
  concat,
  assignDeep,
  ratioToCssPercent,
  numberToCssPx,
  setStyles,
  createOrKeepArray,
  getRawScrollBounds,
  getRawScrollRatio,
  getBoundingClientRect,
  capNumber,
} from '~/support';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
  classNameScrollbarTransitionless,
} from '~/classnames';
import { getEnvironment } from '~/environment';
import { dynamicInitializationElement as generalDynamicInitializationElement } from '~/initialization';
import type { RTLScrollBehavior } from '~/support';
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
  const { _getDefaultInitialization, _rtlScrollBehavior } = getEnvironment();
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
  const initScrollTimeline = (axis: 'x' | 'y') =>
    scrollT &&
    new scrollT({
      source: _scrollOffsetElement,
      axis,
    });
  const scrollTimelineX = initScrollTimeline('x');
  const scrollTimelineY = initScrollTimeline('y');
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
    isHorizontal?: boolean,
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
    isHorizontal?: boolean,
    rtlScrollBehavior?: RTLScrollBehavior
  ) => {
    const lengthRatio = getScrollbarHandleLengthRatio(isHorizontal, scrollbarStructure);

    return (
      (1 / lengthRatio) *
        (1 - lengthRatio) *
        (rtlScrollBehavior ? 1 - scrollPercent : scrollPercent) || 0
    );
  };

  /**
   * Adds additional directional keyframes to the passed keyframes.
   * @param keyframes The keyframes.
   * @param directionRTL Whether the direction is RTL.
   * @returns The passed keyframes with additional directional keyframes.
   */
  const addDirectionRTLKeyframes = (
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    directionRTL?: boolean | RTLScrollBehavior
  ) =>
    assignDeep(
      keyframes,
      directionRTL
        ? {
            clear: ['left'], // dummy keyframe for direction rtl animation because of chrome bug
          }
        : {}
    );

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
    ) => [HTMLElement | false | null | undefined, StyleObject]
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
    if (scrollTimelineX && scrollTimelineY) {
      each(scrollbarStructures, (structure: ScrollbarStructure) => {
        const { _scrollbar, _handle } = structure;
        const rtlScrollBehavior =
          isHorizontal && getDirectionIsRTL(_scrollbar) && _rtlScrollBehavior;
        setElementAnimation(
          _handle,
          isHorizontal ? scrollTimelineX : scrollTimelineY,
          addDirectionRTLKeyframes(
            {
              transform: getRawScrollBounds(1, rtlScrollBehavior).map((bound) =>
                getTrasformTranslateValue(
                  ratioToCssPercent(
                    getScrollbarHandleOffsetRatio(
                      structure,
                      getRawScrollRatio(bound, 1, rtlScrollBehavior),
                      isHorizontal,
                      rtlScrollBehavior
                    )
                  ),
                  isHorizontal
                )
              ),
            },
            rtlScrollBehavior
          )
        );
      });
    } else {
      const { _overflowAmount } = structureSetupState;
      const scroll = getElmentScroll(_scrollOffsetElement);
      scrollbarStyle(scrollbarStructures, (structure) => {
        const { _handle, _scrollbar } = structure;
        const axis = isHorizontal ? 'x' : 'y';
        const rtlScrollBehavior =
          isHorizontal && getDirectionIsRTL(_scrollbar) && _rtlScrollBehavior;

        return [
          _handle,
          {
            transform: getTrasformTranslateValue(
              ratioToCssPercent(
                getScrollbarHandleOffsetRatio(
                  structure,
                  getRawScrollRatio(scroll[axis], _overflowAmount[axis], rtlScrollBehavior),
                  isHorizontal,
                  rtlScrollBehavior
                )
              ),
              isHorizontal
            ),
          },
        ];
      });
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
      const { _overflowAmount } = structureSetupState;

      if (scrollTimelineX && scrollTimelineY) {
        each(concat(verticalScrollbars, horizontalScrollbars), ({ _scrollbar }) => {
          if (doRefreshScrollbarOffset(_scrollbar)) {
            const setScrollbarElementAnimation = (
              timeline: AnimationTimeline,
              overflowAmount: number,
              isHorizontal?: boolean
            ) => {
              const rtlScrollBehavior =
                isHorizontal && getDirectionIsRTL(_scrollbar) && _rtlScrollBehavior;
              setElementAnimation(
                _scrollbar,
                timeline,
                addDirectionRTLKeyframes(
                  {
                    transform: getRawScrollBounds(overflowAmount, rtlScrollBehavior).map((bound) =>
                      getTrasformTranslateValue(numberToCssPx(bound), isHorizontal)
                    ),
                  },
                  rtlScrollBehavior
                ),
                'add'
              );
            };

            setScrollbarElementAnimation(scrollTimelineX, _overflowAmount.x, true);
            setScrollbarElementAnimation(scrollTimelineY, _overflowAmount.y);
          } else {
            cancelElementAnimations(_scrollbar);
          }
        });
      } else {
        const scroll = getElmentScroll(_scrollOffsetElement);
        const styleScrollbarPosition = (structure: ScrollbarStructure) => {
          const { _scrollbar } = structure;
          const elm = doRefreshScrollbarOffset(_scrollbar) && _scrollbar;
          const getTranslateValue = (
            axisScroll: number,
            axisOverflowAmount: number,
            rtlScrollBehavior?: RTLScrollBehavior
          ) => {
            const percent = getRawScrollRatio(axisScroll, axisOverflowAmount, rtlScrollBehavior);
            const px = axisOverflowAmount * percent;
            return numberToCssPx(rtlScrollBehavior ? -px : px);
          };

          return [
            elm,
            {
              transform: elm
                ? getTrasformTranslateValue({
                    x: getTranslateValue(
                      scroll.x,
                      _overflowAmount.x,
                      getDirectionIsRTL(_scrollbar) && _rtlScrollBehavior
                    ),
                    y: getTranslateValue(scroll.y, _overflowAmount.y),
                  })
                : '',
            },
          ] as [HTMLElement | false, StyleObject];
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
    const arrToPush = isHorizontal ? horizontalScrollbars : verticalScrollbars;
    const transitionlessClass = isEmptyArray(arrToPush) ? classNameScrollbarTransitionless : '';
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

    push(arrToPush, result);
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

    setT(() => {
      scrollbarsAddRemoveClass(classNameScrollbarTransitionless);
    }, 300);

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
        _scrollTimeline: scrollTimelineX,
        _scrollbarStructures: horizontalScrollbars,
        _clone: generateHorizontalScrollbarStructure,
        _style: bind(scrollbarStyle, horizontalScrollbars),
      },
      _vertical: {
        _scrollTimeline: scrollTimelineY,
        _scrollbarStructures: verticalScrollbars,
        _clone: generateVerticalScrollbarStructure,
        _style: bind(scrollbarStyle, verticalScrollbars),
      },
    },
    appendElements,
  ];
};
