import { noop, on, runEachAndClear, selfClearTimeout } from '~/support';
import { getEnvironment } from '~/environment';
import { createState, createOptionCheck } from '~/setups/setups';
import { createScrollbarsSetupEvents } from '~/setups/scrollbarsSetup/scrollbarsSetup.events';
import { createScrollbarsSetupElements } from '~/setups/scrollbarsSetup/scrollbarsSetup.elements';
import {
  classNameScrollbarThemeNone,
  classNameScrollbarVisible,
  classNameScrollbarUnusable,
  classNameScrollbarCornerless,
  classNameScrollbarAutoHideHidden,
  classNameScrollbarHandleInteractive,
  classNameScrollbarTrackInteractive,
  classNameScrollbarRtl,
  classNameScrollbarAutoHide,
} from '~/classnames';
import type { ScrollbarsSetupElementsObj } from '~/setups/scrollbarsSetup/scrollbarsSetup.elements';
import type { StructureSetupUpdateHints } from '~/setups/structureSetup/structureSetup.update';
import type {
  ReadonlyOptions,
  ScrollbarsVisibilityBehavior,
  ScrollbarsAutoHideBehavior,
} from '~/options';
import type { Setup, StructureSetupState, StructureSetupStaticState } from '~/setups';
import type { InitializationTarget } from '~/initialization';
import type { DeepPartial, OverflowStyle } from '~/typings';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScrollbarsSetupState {}

export interface ScrollbarsSetupStaticState {
  _elements: ScrollbarsSetupElementsObj;
  _appendElements: () => void;
}

export const createScrollbarsSetup = (
  target: InitializationTarget,
  options: ReadonlyOptions,
  structureSetupState: (() => StructureSetupState) & StructureSetupStaticState,
  onScroll: (event: Event) => void
): Setup<
  ScrollbarsSetupState,
  ScrollbarsSetupStaticState,
  [DeepPartial<StructureSetupUpdateHints>]
> => {
  let autoHideIsMove: boolean | undefined;
  let autoHideIsLeave: boolean | undefined;
  let autoHideNotNever: boolean | undefined;
  let mouseInHost: boolean | undefined;
  let prevTheme: string | null | undefined;
  let instanceAutoHideSuspendScrollDestroyFn = noop;
  let instanceAutoHideDelay = 0;

  const state = createState({});
  const [getState] = state;
  const [requestMouseMoveAnimationFrame, cancelMouseMoveAnimationFrame] = selfClearTimeout();
  const [requestScrollAnimationFrame, cancelScrollAnimationFrame] = selfClearTimeout();
  const [scrollTimeout, clearScrollTimeout] = selfClearTimeout(100);
  const [auotHideMoveTimeout, clearAutoHideTimeout] = selfClearTimeout(100);
  const [autoHideSuspendTimeout, clearAutoHideSuspendTimeout] = selfClearTimeout(100);
  const [auotHideTimeout, clearAutoTimeout] = selfClearTimeout(() => instanceAutoHideDelay);
  const [elements, appendElements, destroyElements] = createScrollbarsSetupElements(
    target,
    structureSetupState._elements,
    createScrollbarsSetupEvents(options, structureSetupState)
  );
  const { _host, _scrollEventElement, _isBody } = structureSetupState._elements;
  const {
    _scrollbarsAddRemoveClass,
    _refreshScrollbarsHandleLength,
    _refreshScrollbarsHandleOffset,
    _refreshScrollbarsHandleOffsetTimeline,
    _refreshScrollbarsScrollbarOffsetTimeline,
    _refreshScrollbarsScrollbarOffset,
  } = elements;
  const manageAutoHideSuspension = (add: boolean) => {
    _scrollbarsAddRemoveClass(classNameScrollbarAutoHide, add, true);
    _scrollbarsAddRemoveClass(classNameScrollbarAutoHide, add, false);
  };
  const manageScrollbarsAutoHide = (removeAutoHide: boolean, delayless?: boolean) => {
    clearAutoTimeout();
    if (removeAutoHide) {
      _scrollbarsAddRemoveClass(classNameScrollbarAutoHideHidden);
    } else {
      const hide = () => _scrollbarsAddRemoveClass(classNameScrollbarAutoHideHidden, true);
      if (instanceAutoHideDelay > 0 && !delayless) {
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
    clearAutoHideSuspendTimeout,
    cancelScrollAnimationFrame,
    cancelMouseMoveAnimationFrame,
    destroyElements,

    on(_host, 'pointerover', onHostMouseEnter, { _once: true }),
    on(_host, 'pointerenter', onHostMouseEnter),
    on(_host, 'pointerleave', () => {
      mouseInHost = false;
      autoHideIsLeave && manageScrollbarsAutoHide(false);
    }),
    on(_host, 'pointermove', () => {
      autoHideIsMove &&
        requestMouseMoveAnimationFrame(() => {
          clearScrollTimeout();
          manageScrollbarsAutoHide(true);
          auotHideMoveTimeout(() => {
            autoHideIsMove && manageScrollbarsAutoHide(false);
          });
        });
    }),
    on(_scrollEventElement, 'scroll', (event) => {
      requestScrollAnimationFrame(() => {
        _refreshScrollbarsHandleOffset(structureSetupState());

        autoHideNotNever && manageScrollbarsAutoHide(true);
        scrollTimeout(() => {
          autoHideNotNever && !mouseInHost && manageScrollbarsAutoHide(false);
        });
      });

      onScroll(event);

      _refreshScrollbarsScrollbarOffset();
    }),
  ];
  const scrollbarsSetupState = getState.bind(0) as (() => ScrollbarsSetupState) &
    ScrollbarsSetupStaticState;
  scrollbarsSetupState._elements = elements;
  scrollbarsSetupState._appendElements = appendElements;

  return [
    (changedOptions, force, structureUpdateHints) => {
      const {
        _overflowEdgeChanged,
        _overflowAmountChanged,
        _overflowStyleChanged,
        _directionChanged,
        _appear,
      } = structureUpdateHints;
      const { _nativeScrollbarsOverlaid } = getEnvironment();
      const checkOption = createOptionCheck(options, changedOptions, force);
      const currStructureSetupState = structureSetupState();
      const { _overflowAmount, _overflowStyle, _directionIsRTL, _hasOverflow } =
        currStructureSetupState;
      const [showNativeOverlaidScrollbarsOption, showNativeOverlaidScrollbarsChanged] =
        checkOption<boolean>('showNativeOverlaidScrollbars');
      const [theme, themeChanged] = checkOption<string | null>('scrollbars.theme');
      const [visibility, visibilityChanged] =
        checkOption<ScrollbarsVisibilityBehavior>('scrollbars.visibility');
      const [autoHide, autoHideChanged] =
        checkOption<ScrollbarsAutoHideBehavior>('scrollbars.autoHide');
      const [autoHideSuspend, autoHideSuspendChanged] = checkOption<boolean>(
        'scrollbars.autoHideSuspend'
      );
      const [autoHideDelay] = checkOption<number>('scrollbars.autoHideDelay');
      const [dragScroll, dragScrollChanged] = checkOption<boolean>('scrollbars.dragScroll');
      const [clickScroll, clickScrollChanged] = checkOption<boolean>('scrollbars.clickScroll');

      const trulyAppeared = _appear && !force;
      const hasOverflow = _hasOverflow.x || _hasOverflow.y;
      const updateScrollbars = _overflowEdgeChanged || _overflowAmountChanged || _directionChanged;
      const updateVisibility = _overflowStyleChanged || visibilityChanged;
      const showNativeOverlaidScrollbars =
        showNativeOverlaidScrollbarsOption &&
        _nativeScrollbarsOverlaid.x &&
        _nativeScrollbarsOverlaid.y;

      const setScrollbarVisibility = (overflowStyle: OverflowStyle, isHorizontal: boolean) => {
        const isVisible =
          visibility === 'visible' || (visibility === 'auto' && overflowStyle === 'scroll');
        _scrollbarsAddRemoveClass(classNameScrollbarVisible, isVisible, isHorizontal);
        return isVisible;
      };

      instanceAutoHideDelay = autoHideDelay;

      if (trulyAppeared) {
        if (autoHideSuspend && hasOverflow) {
          manageAutoHideSuspension(false);
          instanceAutoHideSuspendScrollDestroyFn();
          autoHideSuspendTimeout(() => {
            instanceAutoHideSuspendScrollDestroyFn = on(
              _scrollEventElement,
              'scroll',
              manageAutoHideSuspension.bind(0, true),
              {
                _once: true,
              }
            );
          });
        } else {
          manageAutoHideSuspension(true);
        }
      }

      if (showNativeOverlaidScrollbarsChanged) {
        _scrollbarsAddRemoveClass(classNameScrollbarThemeNone, showNativeOverlaidScrollbars);
      }
      if (themeChanged) {
        _scrollbarsAddRemoveClass(prevTheme);
        _scrollbarsAddRemoveClass(theme, true);

        prevTheme = theme;
      }

      if (autoHideSuspendChanged && !autoHideSuspend) {
        manageAutoHideSuspension(true);
      }

      if (autoHideChanged) {
        autoHideIsMove = autoHide === 'move';
        autoHideIsLeave = autoHide === 'leave';
        autoHideNotNever = autoHide !== 'never';
        manageScrollbarsAutoHide(!autoHideNotNever, true);
      }
      if (dragScrollChanged) {
        _scrollbarsAddRemoveClass(classNameScrollbarHandleInteractive, dragScroll);
      }
      if (clickScrollChanged) {
        _scrollbarsAddRemoveClass(classNameScrollbarTrackInteractive, clickScroll);
      }
      if (updateVisibility) {
        const xVisible = setScrollbarVisibility(_overflowStyle.x, true);
        const yVisible = setScrollbarVisibility(_overflowStyle.y, false);
        const hasCorner = xVisible && yVisible;

        _scrollbarsAddRemoveClass(classNameScrollbarCornerless, !hasCorner);
      }
      if (updateScrollbars) {
        _refreshScrollbarsHandleLength(currStructureSetupState);
        _refreshScrollbarsHandleOffset(currStructureSetupState);
        _refreshScrollbarsHandleOffsetTimeline(currStructureSetupState);
        _refreshScrollbarsScrollbarOffsetTimeline(currStructureSetupState);
        _refreshScrollbarsScrollbarOffset();

        _scrollbarsAddRemoveClass(classNameScrollbarUnusable, !_overflowAmount.x, true);
        _scrollbarsAddRemoveClass(classNameScrollbarUnusable, !_overflowAmount.y, false);
        _scrollbarsAddRemoveClass(classNameScrollbarRtl, _directionIsRTL && !_isBody);
      }
    },
    scrollbarsSetupState,
    () => {
      runEachAndClear(destroyFns);
      instanceAutoHideSuspendScrollDestroyFn();
    },
  ];
};
