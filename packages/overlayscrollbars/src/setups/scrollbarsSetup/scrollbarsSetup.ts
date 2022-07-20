import { rAF, cAF, isFunction, on, runEachAndClear, setT, clearT } from 'support';
import { createState, createOptionCheck } from 'setups/setups';
import {
  createScrollbarsSetupElements,
  ScrollbarsSetupElement,
  ScrollbarsSetupElementsObj,
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
import type { OverflowStyle } from 'typings';

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

const getScrollbarHandleRatio = (
  structureSetupState: StructureSetupState,
  isHorizontal?: boolean
) => {
  const { _overflowAmount, _overflowEdge } = structureSetupState;
  const axis = isHorizontal ? 'x' : 'y';
  const viewportSize = _overflowEdge[axis];
  const overflowAmount = _overflowAmount[axis];
  return min(1, viewportSize / (viewportSize + overflowAmount));
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
        getScrollbarHandleRatio(structureSetupState, isHorizontal) * 100
      ).toFixed(3)}%`,
    },
  ]);

const refreshScrollbarHandlePosition = (
  setStyleFn: ScrollbarsSetupElement['_handleStyle'],
  structureSetupState: StructureSetupState,
  viewport: HTMLElement,
  isHorizontal?: boolean
) => {
  const axis = isHorizontal ? 'x' : 'y';
  const translateAxis = isHorizontal ? 'X' : 'Y';
  const scrollLeftTop = isHorizontal ? 'Left' : 'Top';
  const handleRatio = getScrollbarHandleRatio(structureSetupState, isHorizontal);
  const scrollPosition = viewport[`scroll${scrollLeftTop}`] as number;
  const scrollPositionMax =
    (viewport[`scroll${scrollLeftTop}Max`] as number) ||
    Math.floor(structureSetupState._overflowAmount[axis]);

  setStyleFn((structure) => [
    structure._handle,
    {
      transform: scrollPositionMax
        ? `translate${translateAxis}(${(
            (1 / handleRatio) *
            (1 - handleRatio) *
            (scrollPosition / scrollPositionMax) *
            100
          ).toFixed(3)}%)`
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
    structureSetupState._elements
  );
  const { _host, _viewport } = structureSetupState._elements;
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
      requestScrollAnimationFrame(() => {
        const structureState = structureSetupState();
        refreshScrollbarHandlePosition(styleHorizontal, structureState, _viewport, true);
        refreshScrollbarHandlePosition(styleVertical, structureState, _viewport);

        autoHideNotNever && manageScrollbarsAutoHide(true);
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
      if (themeChanged) {
        addRemoveClassHorizontal(prevTheme);
        addRemoveClassVertical(prevTheme);

        addRemoveClassHorizontal(theme, true);
        addRemoveClassVertical(theme, true);
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

        refreshScrollbarHandlePosition(styleHorizontal, currStructureSetupState, _viewport, true);
        refreshScrollbarHandlePosition(styleVertical, currStructureSetupState, _viewport);
      }
    },
    scrollbarsSetupState,
    runEachAndClear.bind(0, destroyFns),
  ];
};
