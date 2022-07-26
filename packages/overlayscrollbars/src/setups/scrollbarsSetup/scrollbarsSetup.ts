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
  getScrollbarHandleLengthRatio,
  getScrollbarHandleOffsetRatio,
} from 'setups/scrollbarsSetup/scrollbarsSetup.calculations';
import { createScrollbarsSetupEvents } from 'setups/scrollbarsSetup/scrollbarsSetup.events';
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
) =>
  setStyleFn((structure) => [
    structure._handle,
    {
      [isHorizontal ? 'width' : 'height']: `${(
        getScrollbarHandleLengthRatio(structureSetupState, isHorizontal) * 100
      ).toFixed(3)}%`,
    },
  ]);

const refreshScrollbarHandleOffset = (
  setStyleFn: ScrollbarsSetupElement['_handleStyle'],
  structureSetupState: StructureSetupState,
  scrollOffsetElement: HTMLElement,
  isHorizontal?: boolean
) => {
  const translateAxis = isHorizontal ? 'X' : 'Y';
  const offsetRatio = getScrollbarHandleOffsetRatio(
    structureSetupState,
    scrollOffsetElement,
    isHorizontal
  );
  // eslint-disable-next-line no-self-compare
  const validOffsetRatio = offsetRatio === offsetRatio; // is false when offset is NaN

  setStyleFn((structure) => [
    structure._handle,
    {
      transform: validOffsetRatio
        ? `translate${translateAxis}(${(offsetRatio * 100).toFixed(3)}%)`
        : '',
    },
  ]);
};

export const createScrollbarsSetup = (
  target: InitializationTarget,
  options: ReadonlyOSOptions,
  structureSetupState: (() => StructureSetupState) & StructureSetupStaticState
): Setup<ScrollbarsSetupState, ScrollbarsSetupStaticState, [StructureSetupUpdateHints]> => {
  let autoHideIsMove: boolean;
  let autoHideIsLeave: boolean;
  let autoHideNotNever: boolean;
  let mouseInHost: boolean | undefined;
  let prevTheme: string | null | undefined;
  let globalAutoHideDelay = 0;

  const state = createState({});
  const [getState] = state;
  const [requestMouseMoveAnimationFrame, cancelMouseMoveAnimationFrame] = createSelfCancelTimeout();
  const [requestScrollAnimationFrame, cancelScrollAnimationFrame] = createSelfCancelTimeout();
  const [scrollTimeout, clearScrollTimeout] = createSelfCancelTimeout(100);
  const [auotHideMoveTimeout, clearAutoHideTimeout] = createSelfCancelTimeout(100);
  const [auotHideTimeout, clearAutoTimeout] = createSelfCancelTimeout(() => globalAutoHideDelay);
  const [elements, appendElements, destroyElements] = createScrollbarsSetupElements(
    target,
    structureSetupState._elements,
    createScrollbarsSetupEvents(structureSetupState)
  );
  const {
    _host,
    _viewport,
    _scrollOffsetElement,
    _scrollEventElement,
    _viewportIsTarget,
    _isBody,
  } = structureSetupState._elements;
  const { _horizontal, _vertical, _scrollbarsAddRemoveClass: scrollbarsAddRemoveClass } = elements;
  const { _handleStyle: styleHorizontal } = _horizontal;
  const { _handleStyle: styleVertical } = _vertical;
  const styleScrollbarPosition = (structure: ScrollbarStructure) => {
    const { _scrollbar } = structure;
    const elm = _viewportIsTarget && !_isBody && parent(_scrollbar) === _viewport && _scrollbar;
    return [
      elm,
      {
        transform: elm
          ? `translate(${scrollLeft(_scrollOffsetElement)}px, ${scrollTop(_scrollOffsetElement)}px)`
          : '',
      },
    ] as [HTMLElement | false, StyleObject];
  };
  const manageScrollbarsAutoHide = (removeAutoHide: boolean, delayless?: boolean) => {
    clearAutoTimeout();
    if (removeAutoHide) {
      scrollbarsAddRemoveClass(classNamesScrollbarAutoHidden);
    } else {
      const hide = () => scrollbarsAddRemoveClass(classNamesScrollbarAutoHidden, true);
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
    on(_scrollEventElement, 'scroll', () => {
      requestScrollAnimationFrame(() => {
        const structureState = structureSetupState();
        refreshScrollbarHandleOffset(styleHorizontal, structureState, _scrollOffsetElement, true);
        refreshScrollbarHandleOffset(styleVertical, structureState, _scrollOffsetElement);

        autoHideNotNever && manageScrollbarsAutoHide(true);
        scrollTimeout(() => {
          autoHideNotNever && !mouseInHost && manageScrollbarsAutoHide(false);
        });
      });

      _viewportIsTarget && styleHorizontal(styleScrollbarPosition);
      _viewportIsTarget && styleVertical(styleScrollbarPosition);
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

      const [theme, themeChanged] = checkOption<string | null>('scrollbars.theme');
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

      const setScrollbarVisibility = (overflowStyle: OverflowStyle, isHorizontal: boolean) => {
        const isVisible =
          visibility === 'visible' || (visibility === 'auto' && overflowStyle === 'scroll');
        scrollbarsAddRemoveClass(classNamesScrollbarVisible, isVisible, isHorizontal);
        return isVisible;
      };

      globalAutoHideDelay = autoHideDelay;

      if (updateVisibility) {
        const { _overflowStyle } = currStructureSetupState;

        const xVisible = setScrollbarVisibility(_overflowStyle.x, true);
        const yVisible = setScrollbarVisibility(_overflowStyle.y, false);
        const hasCorner = xVisible && yVisible;

        scrollbarsAddRemoveClass(classNamesScrollbarCornerless, !hasCorner);
      }
      if (themeChanged) {
        scrollbarsAddRemoveClass(prevTheme);
        scrollbarsAddRemoveClass(theme, true);

        prevTheme = theme;
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

        refreshScrollbarHandleOffset(
          styleHorizontal,
          currStructureSetupState,
          _scrollOffsetElement,
          true
        );
        refreshScrollbarHandleOffset(styleVertical, currStructureSetupState, _scrollOffsetElement);
      }
    },
    scrollbarsSetupState,
    runEachAndClear.bind(0, destroyFns),
  ];
};
