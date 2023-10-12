import {
  addClass,
  appendChildren,
  createDiv,
  getDirectionIsRTL,
  each,
  getTrasformTranslateValue,
  indexOf,
  isArray,
  isBoolean,
  isEmptyArray,
  parent,
  push,
  removeClass,
  removeElements,
  runEachAndClear,
  scrollLeft,
  scrollT,
  scrollTop,
  setT,
  style,
  bind,
  mathMax,
} from '~/support';
import {
  classNameScrollbar,
  classNameScrollbarHorizontal,
  classNameScrollbarVertical,
  classNameScrollbarTrack,
  classNameScrollbarHandle,
  classNameScrollbarTransitionless,
  classNameScrollbarNoCssCustomProps,
} from '~/classnames';
import { getEnvironment } from '~/environment';
import { dynamicInitializationElement as generalDynamicInitializationElement } from '~/initialization';
import type {
  InitializationTarget,
  InitializationTargetElement,
  InitializationTargetObject,
} from '~/initialization';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
import type { ScrollbarsSetupEvents } from './scrollbarsSetup.events';
import type { StyleObject } from '~/typings';
import type { StructureSetupState } from '../structureSetup';
import {
  getScrollbarHandleLengthRatio,
  getScrollbarHandleOffsetRatio,
} from './scrollbarsSetup.calculations';

export interface ScrollbarStructure {
  _scrollbar: HTMLElement;
  _track: HTMLElement;
  _handle: HTMLElement;
}

export interface ScrollbarsSetupElement {
  _scrollTimeline: AnimationTimeline | null;
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
  _refreshScrollbarsHandleLength: (structureSetupState: StructureSetupState) => void;
  _refreshScrollbarsHandleOffset: (structureSetupState: StructureSetupState) => void;
  _refreshScrollbarsHandleOffsetTimeline: (structureSetupState: StructureSetupState) => void;
  _refreshScrollbarsScrollbarOffsetTimeline: (structureSetupState: StructureSetupState) => void;
  _refreshScrollbarsScrollbarOffset: () => void;
  _horizontal: ScrollbarsSetupElement;
  _vertical: ScrollbarsSetupElement;
}

export type ScrollbarsSetupElements = [
  elements: ScrollbarsSetupElementsObj,
  appendElements: () => () => void
];

const animateElement = (
  element: HTMLElement,
  scrollTimeline: AnimationTimeline | null,
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  composite?: CompositeOperation
): Animation | false | null | undefined =>
  scrollTimeline &&
  element.animate(keyframes, {
    // @ts-ignore
    timeline: scrollTimeline,
    composite,
  });

const getScrollbarHandleAnimationKeyFrames = (directionRTL: boolean, isHorizontal?: boolean) => ({
  transform: [
    getTrasformTranslateValue(`0%`, isHorizontal),
    getTrasformTranslateValue(isHorizontal && directionRTL ? '100%' : '-100%', isHorizontal),
  ],
  [isHorizontal ? (directionRTL ? 'right' : 'left') : 'top']: ['0%', '100%'],
});
const maxScrollbarOffsetFrameValue = (value: number) => `${mathMax(0, value - 0.5)}px`;
const animateScrollbarOffset = (
  scrollbar: HTMLElement,
  scrollTimeline: AnimationTimeline | null,
  maxTransformValue: number,
  isHorizontal?: boolean
) =>
  animateElement(
    scrollbar,
    scrollTimeline,
    {
      transform: [
        getTrasformTranslateValue(`0px`, isHorizontal),
        getTrasformTranslateValue(maxScrollbarOffsetFrameValue(maxTransformValue), isHorizontal),
      ],
    },
    'add'
  );
const initScrollTimeline = (element: HTMLElement, axis: 'x' | 'y') =>
  scrollT
    ? new scrollT({
        source: element,
        axis,
      })
    : null;

export const createScrollbarsSetupElements = (
  target: InitializationTarget,
  structureSetupElements: StructureSetupElementsObj,
  scrollbarsSetupEvents: ScrollbarsSetupEvents
): ScrollbarsSetupElements => {
  const { _getDefaultInitialization, _cssCustomProperties } = getEnvironment();
  const { scrollbars: defaultInitScrollbars } = _getDefaultInitialization();
  const { slot: defaultInitScrollbarsSlot } = defaultInitScrollbars;
  const {
    _documentElm,
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
  const elementAnimations = new Map<HTMLElement, Array<Animation | false | null | undefined>>();
  const scrollTimelineX = initScrollTimeline(_scrollOffsetElement, 'x');
  const scrollTimelineY = initScrollTimeline(_scrollOffsetElement, 'y');

  const evaluatedScrollbarSlot = generalDynamicInitializationElement<
    [InitializationTargetElement, HTMLElement, HTMLElement]
  >(
    [_target, _host, _viewport],
    () => (_viewportIsTarget && _isBody ? _target : _host),
    defaultInitScrollbarsSlot,
    initScrollbarsSlot
  );
  const doRefreshScrollbarOffset = (scrollbar: HTMLElement) =>
    _viewportIsTarget && !_isBody && parent(scrollbar) === _viewport;
  const cancelElementAnimations = (elements?: HTMLElement | HTMLElement[]) => {
    elementAnimations.forEach((currAnimations, element) => {
      const doCancel = elements
        ? indexOf(isArray(elements) ? elements : [elements], element) > -1
        : true;
      if (doCancel) {
        (currAnimations || []).forEach((animation) => {
          animation && animation.cancel();
        });
        elementAnimations.delete(element);
      }
    });
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
      style(elm, styles);
    });
  };
  const scrollbarStructureRefreshHandleLength = (
    scrollbarStructures: ScrollbarStructure[],
    structureSetupState: StructureSetupState,
    isHorizontal?: boolean
  ) => {
    scrollbarStyle(scrollbarStructures, (structure) => {
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
    if (!scrollTimelineY && !scrollTimelineY) {
      scrollbarStyle(scrollbarStructures, (structure) => {
        const { _handle, _track, _scrollbar } = structure;
        const offsetRatio = getScrollbarHandleOffsetRatio(
          _handle,
          _track,
          _scrollOffsetElement,
          structureSetupState,
          getDirectionIsRTL(_scrollbar),
          isHorizontal
        );
        // eslint-disable-next-line no-self-compare
        const validOffsetRatio = offsetRatio === offsetRatio; // is false when offset is NaN
        return [
          _handle,
          {
            transform: validOffsetRatio
              ? getTrasformTranslateValue(`${(offsetRatio * 100).toFixed(3)}%`, isHorizontal)
              : '',
          },
        ];
      });
    }
  };
  const styleScrollbarPosition = (structure: ScrollbarStructure) => {
    const { _scrollbar } = structure;
    const elm = doRefreshScrollbarOffset(_scrollbar) && _scrollbar;
    return [
      elm,
      {
        transform: elm
          ? getTrasformTranslateValue([
              `${scrollLeft(_scrollOffsetElement)}px`,
              `${scrollTop(_scrollOffsetElement)}px`,
            ])
          : '',
      },
    ] as [HTMLElement | false, StyleObject];
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
  const refreshScrollbarsHandleOffsetTimeline = () => {
    const forEachFn = (isHorizontal: boolean, { _scrollbar, _handle }: ScrollbarStructure) => {
      cancelElementAnimations(_handle);
      elementAnimations.set(_handle, [
        animateElement(
          _handle,
          isHorizontal ? scrollTimelineX : scrollTimelineY,
          getScrollbarHandleAnimationKeyFrames(
            isHorizontal && getDirectionIsRTL(_scrollbar),
            isHorizontal
          )
        ),
      ]);
    };
    horizontalScrollbars.forEach(bind(forEachFn, true));
    verticalScrollbars.forEach(bind(forEachFn, false));
  };
  const refreshScrollbarsScrollbarOffset = () => {
    if (!scrollTimelineY && !scrollTimelineY) {
      _viewportIsTarget && scrollbarStyle(horizontalScrollbars, styleScrollbarPosition);
      _viewportIsTarget && scrollbarStyle(verticalScrollbars, styleScrollbarPosition);
    }
  };
  const refreshScrollbarsScrollbarOffsetTimeline = ({ _overflowAmount }: StructureSetupState) => {
    verticalScrollbars.concat(horizontalScrollbars).forEach(({ _scrollbar }) => {
      cancelElementAnimations(_scrollbar);
      if (doRefreshScrollbarOffset(_scrollbar)) {
        elementAnimations.set(_scrollbar, [
          animateScrollbarOffset(_scrollbar, scrollTimelineX, _overflowAmount.x, true),
          animateScrollbarOffset(_scrollbar, scrollTimelineY, _overflowAmount.y),
        ]);
      }
    });
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

    if (!_cssCustomProperties) {
      addClass(scrollbar, classNameScrollbarNoCssCustomProps);
    }

    push(arrToPush, result);
    push(destroyFns, [
      appendChildren(scrollbar, track),
      appendChildren(track, handle),
      bind(removeElements, scrollbar),
      cancelElementAnimations,
      scrollbarsSetupEvents(
        result,
        scrollbarsAddRemoveClass,
        _documentElm,
        _host,
        _scrollOffsetElement,
        isHorizontal ? scrollTimelineX : scrollTimelineY,
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
      _refreshScrollbarsHandleOffsetTimeline: refreshScrollbarsHandleOffsetTimeline,
      _refreshScrollbarsScrollbarOffsetTimeline: refreshScrollbarsScrollbarOffsetTimeline,
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
