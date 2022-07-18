import {
  rAF,
  cAF,
  isFunction,
  on,
  runEachAndClear,
  setT,
  clearT,
  parent,
  scrollLeft,
  scrollTop,
} from 'support';
import { createState, createOptionCheck } from 'setups/setups';
import {
  createScrollbarsSetupElements,
  ScrollbarsSetupElement,
  ScrollbarsSetupElementsObj,
  ScrollbarStructure,
} from 'setups/scrollbarsSetup/scrollbarsSetup.elements';
import {
  classNamesScrollbarVisible,
  classNamesScrollbarCornerless,
  classNamesScrollbarAutoHidden,
} from 'classnames';
import type { StructureSetupUpdateHints } from 'setups/structureSetup/structureSetup.update';
import type {
  ReadonlyOSOptions,
  ScrollbarVisibilityBehavior,
  ScrollbarAutoHideBehavior,
} from 'options';
import type { Setup, StructureSetupState, StructureSetupStaticState } from 'setups';
import type { InitializationTarget } from 'initialization';
import type { OverflowStyle, StyleObject } from 'typings';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScrollbarsSetupState {}

export interface ScrollbarsSetupStaticState {
  _elements: ScrollbarsSetupElementsObj;
  _appendElements: () => void;
}

const { min } = Math;
const createSelfCancelTimeout = (timeout?: number | (() => number)) => {
  let id: number;
  const setTFn = timeout ? setT : rAF!;
  const clearTFn = timeout ? clearT : cAF!;
  return [
    (callback: () => any) => {
      clearTFn(id);
      // @ts-ignore
      id = setTFn(callback, isFunction(timeout) ? timeout() : timeout);
    },
    () => clearTFn(id),
  ] as [timeout: (callback: () => any) => void, clear: () => void];
};

const refreshScrollbarHandleLength = (
  setStyleFn: ScrollbarsSetupElement['_handleStyle'],
  structureSetupState: StructureSetupState,
  isHorizontal?: boolean
) => {
  const { _overflowAmount, _overflowEdge } = structureSetupState;
  const axis = isHorizontal ? 'x' : 'y';
  const viewportSize = _overflowEdge[axis];
  const overflowAmount = _overflowAmount[axis];
  const handleRatio = min(1, viewportSize / (viewportSize + overflowAmount));

  setStyleFn((structure) => [
    structure._handle,
    {
      [isHorizontal ? 'width' : 'height']: `${(handleRatio * 100).toFixed(3)}%`,
    },
  ]);
};

const refreshScrollbarHandlePosition = (
  setStyleFn: (styles: StyleObject) => void,
  structureSetupState: StructureSetupState,
  isHorizontal?: boolean
) => {
  /*
  //measure the handle length to respect min & max length
  var handleLength = scrollbarVarsInfo._handleLength;
  var trackLength = scrollbarVars._track[0]['offset' + scrollbarVars._Width_Height];
  var handleTrackDiff = trackLength - handleLength;
  var handleCSS = {};
  var transformOffset;
  var translateValue;

  //DONT use the variable '_contentScrollSizeCache[scrollbarVars._w_h]' instead of '_viewportElement[0]['scroll' + scrollbarVars._Width_Height]'
  // because its a bit behind during the small delay when content size updates
  //(delay = mutationObserverContentLag, if its 0 then this var could be used)
  var maxScroll =
    (_viewportElementNative[_strScroll + scrollbarVars._Width_Height] -
      _viewportElementNative['client' + scrollbarVars._Width_Height]) *
    (_rtlScrollBehavior.n && isRTLisHorizontal ? -1 : 1); //* -1 if rtl scroll max is negative
  var getScrollRatio = function (base) {
    return isNaN(base / maxScroll) ? 0 : MATH.max(0, MATH.min(1, base / maxScroll));
  };
  var getHandleOffset = function (scrollRatio) {
    var offset = handleTrackDiff * scrollRatio;
    offset = isNaN(offset) ? 0 : offset;
    offset =
      isRTLisHorizontal && !_rtlScrollBehavior.i ? trackLength - handleLength - offset : offset;
    offset = MATH.max(0, offset);
    return offset;
  };
  var scrollRatio = getScrollRatio(nativeScroll);
  var unsnappedScrollRatio = getScrollRatio(currentScroll);
  var handleOffset = getHandleOffset(unsnappedScrollRatio);
  var snappedHandleOffset = getHandleOffset(scrollRatio);

  scrollbarVarsInfo._maxScroll = maxScroll;
  scrollbarVarsInfo._currentScroll = nativeScroll;
  scrollbarVarsInfo._currentScrollRatio = scrollRatio;

  if (_supportTransform) {
    transformOffset = isRTLisHorizontal
      ? -(trackLength - handleLength - handleOffset)
      : handleOffset; //in px
    //transformOffset = (transformOffset / trackLength * 100) * (trackLength / handleLength); //in %
    translateValue = isHorizontal
      ? strTranslateBrace + transformOffset + 'px, 0)'
      : strTranslateBrace + '0, ' + transformOffset + 'px)';

    handleCSS[strTransform] = translateValue;

    //apply or clear up transition
    if (_supportTransition)
      handleCSS[strTransition] =
        transition && MATH.abs(handleOffset - scrollbarVarsInfo._handleOffset) > 1
          ? getCSSTransitionString(scrollbarVars._handle) +
            ', ' +
            (strTransform + _strSpace + transitionDuration + 'ms')
          : _strEmpty;
  } else handleCSS[scrollbarVars._left_top] = handleOffset;

  //only apply css if offset has changed and overflow exists.
  if (!nativeOverlayScrollbarsAreActive()) {
    scrollbarVars._handle.css(handleCSS);

    //clear up transition
    if (_supportTransform && _supportTransition && transition) {
      scrollbarVars._handle.one(_strTransitionEndEvent, function () {
        if (!_destroyed) scrollbarVars._handle.css(strTransition, _strEmpty);
      });
    }
  }

  scrollbarVarsInfo._handleOffset = handleOffset;
  scrollbarVarsInfo._snappedHandleOffset = snappedHandleOffset;
  scrollbarVarsInfo._trackLength = trackLength;
  */
};

export const createScrollbarsSetup = (
  target: InitializationTarget,
  options: ReadonlyOSOptions,
  structureSetupState: (() => StructureSetupState) & StructureSetupStaticState
): Setup<ScrollbarsSetupState, ScrollbarsSetupStaticState, [StructureSetupUpdateHints]> => {
  let globalAutoHideDelay = 0;
  let autoHideIsMove: boolean;
  let autoHideIsLeave: boolean;
  let autoHideNotNever: boolean;
  let mouseInHost: boolean;
  const state = createState({});
  const [getState] = state;
  const [requestMouseMoveAnimationFrame, cancelMouseMoveAnimationFrame] = createSelfCancelTimeout();
  const [requestScrollAnimationFrame, cancelScrollAnimationFrame] = createSelfCancelTimeout();
  const [scrollTimeout, clearScrollTimeout] = createSelfCancelTimeout(100);
  const [auotHideMoveTimeout, clearAutoHideTimeout] = createSelfCancelTimeout(100);
  const [auotHideTimeout, clearAutoTimeout] = createSelfCancelTimeout(() => globalAutoHideDelay);
  const [elements, appendElements, destroyElements] = createScrollbarsSetupElements(
    target,
    structureSetupState._elements
  );
  const { _host, _viewport, _viewportIsTarget, _isBody } = structureSetupState._elements;
  const { _horizontal, _vertical } = elements;
  const { _addRemoveClass: addRemoveClassHorizontal, _handleStyle: styleHorizontal } = _horizontal;
  const { _addRemoveClass: addRemoveClassVertical, _handleStyle: styleVertical } = _vertical;
  const manageScrollbarsAutoHide = (removeAutoHide: boolean, delayless?: boolean) => {
    clearAutoTimeout();
    if (removeAutoHide) {
      addRemoveClassHorizontal(classNamesScrollbarAutoHidden);
      addRemoveClassVertical(classNamesScrollbarAutoHidden);
    } else {
      const hide = () => {
        addRemoveClassHorizontal(classNamesScrollbarAutoHidden, true);
        addRemoveClassVertical(classNamesScrollbarAutoHidden, true);
      };
      if (globalAutoHideDelay > 0 && !delayless) {
        auotHideTimeout(hide);
      } else {
        hide();
      }
    }
  };
  const onHostMouseEnter = () => {
    mouseInHost = autoHideIsLeave;
    mouseInHost && manageScrollbarsAutoHide(true);
  };
  const destroyFns: (() => void)[] = [
    clearScrollTimeout,
    clearAutoTimeout,
    clearAutoHideTimeout,
    cancelScrollAnimationFrame,
    cancelMouseMoveAnimationFrame,
    destroyElements,

    on(_host, 'mouseover', onHostMouseEnter, { _once: true }),
    on(_host, 'mouseenter', onHostMouseEnter),
    on(_host, 'mouseleave', () => {
      mouseInHost = false;
      autoHideIsLeave && manageScrollbarsAutoHide(false);
    }),
    on(_host, 'mousemove', () => {
      autoHideIsMove &&
        requestMouseMoveAnimationFrame(() => {
          clearScrollTimeout();
          manageScrollbarsAutoHide(true);
          auotHideMoveTimeout(() => {
            autoHideIsMove && manageScrollbarsAutoHide(false);
          });
        });
    }),
    on(_viewport, 'scroll', () => {
      autoHideNotNever &&
        requestScrollAnimationFrame(() => {
          manageScrollbarsAutoHide(true);
          scrollTimeout(() => {
            autoHideNotNever && !mouseInHost && manageScrollbarsAutoHide(false);
          });
        });
    }),
  ];
  const scrollbarsSetupState = getState.bind(0) as (() => ScrollbarsSetupState) &
    ScrollbarsSetupStaticState;
  scrollbarsSetupState._elements = elements;
  scrollbarsSetupState._appendElements = appendElements;

  return [
    (changedOptions, force, structureUpdateHints) => {
      const { _overflowEdgeChanged, _overflowAmountChanged, _overflowStyleChanged } =
        structureUpdateHints;
      const checkOption = createOptionCheck(options, changedOptions, force);
      const currStructureSetupState = structureSetupState();

      const [visibility, visibilityChanged] =
        checkOption<ScrollbarVisibilityBehavior>('scrollbars.visibility');
      const [autoHide, autoHideChanged] =
        checkOption<ScrollbarAutoHideBehavior>('scrollbars.autoHide');
      const [autoHideDelay] = checkOption<number>('scrollbars.autoHideDelay');
      const [dragScrolling, dragScrollingChanged] = checkOption<boolean>(
        'scrollbars.dragScrolling'
      );
      const [touchSupport, touchSupportChanged] = checkOption<boolean>('scrollbars.touchSupport');

      const updateHandle = _overflowEdgeChanged || _overflowAmountChanged;
      const updateVisibility = _overflowStyleChanged || visibilityChanged;

      const setScrollbarVisibility = (
        overflowStyle: OverflowStyle,
        addRemoveClass: (classNames: string, add?: boolean) => void
      ) => {
        const isVisible =
          visibility === 'visible' || (visibility === 'auto' && overflowStyle === 'scroll');
        addRemoveClass(classNamesScrollbarVisible, isVisible);
        return isVisible;
      };

      globalAutoHideDelay = autoHideDelay;

      if (updateVisibility) {
        const { _overflowStyle } = currStructureSetupState;

        const xVisible = setScrollbarVisibility(_overflowStyle.x, addRemoveClassHorizontal);
        const yVisible = setScrollbarVisibility(_overflowStyle.y, addRemoveClassVertical);
        const hasCorner = xVisible && yVisible;

        addRemoveClassHorizontal(classNamesScrollbarCornerless, !hasCorner);
        addRemoveClassVertical(classNamesScrollbarCornerless, !hasCorner);
      }
      if (autoHideChanged) {
        autoHideIsMove = autoHide === 'move';
        autoHideIsLeave = autoHide === 'leave';
        autoHideNotNever = autoHide !== 'never';
        manageScrollbarsAutoHide(!autoHideNotNever, true);
      }
      if (updateHandle) {
        refreshScrollbarHandleLength(styleHorizontal, currStructureSetupState, true);
        refreshScrollbarHandleLength(styleVertical, currStructureSetupState);
      }
    },
    scrollbarsSetupState,
    runEachAndClear.bind(0, destroyFns),
  ];
};
