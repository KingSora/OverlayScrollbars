import { rAF, cAF, isFunction, on, runEachAndClear } from 'support';
import { createState, createOptionCheck } from 'setups/setups';
import {
  createScrollbarsSetupElements,
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

const createSelfCancelTimeout = (timeout?: number | (() => number)) => {
  let id: number;
  const setT = timeout ? (window.setTimeout as (...args: any[]) => number) : rAF!;
  const clearT = timeout ? window.clearTimeout : cAF!;
  return [
    (callback: () => any) => {
      clearT(id);
      // @ts-ignore
      id = setT(callback, isFunction(timeout) ? timeout() : timeout);
    },
    () => clearT(id),
  ] as [timeout: (callback: () => any) => void, clear: () => void];
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
  const { _host, _viewport } = structureSetupState._elements;
  const { _horizontal, _vertical } = elements;
  const { _addRemoveClass: addRemoveClassHorizontal } = _horizontal;
  const { _addRemoveClass: addRemoveClassVertical } = _vertical;
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

      const [visibility, visibilityChanged] =
        checkOption<ScrollbarVisibilityBehavior>('scrollbars.visibility');
      const [autoHide, autoHideChanged] =
        checkOption<ScrollbarAutoHideBehavior>('scrollbars.autoHide');
      const [autoHideDelay] = checkOption<number>('scrollbars.autoHideDelay');
      const [dragScrolling, dragScrollingChanged] = checkOption<boolean>(
        'scrollbars.dragScrolling'
      );
      const [touchSupport, touchSupportChanged] = checkOption<boolean>('scrollbars.touchSupport');

      const updateHandleSize = _overflowEdgeChanged || _overflowAmountChanged;
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
        const { _overflowStyle } = structureSetupState();

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
    },
    scrollbarsSetupState,
    runEachAndClear.bind(0, destroyFns),
  ];
};
