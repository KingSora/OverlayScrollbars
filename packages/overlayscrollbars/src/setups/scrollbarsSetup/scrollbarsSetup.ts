import type { OverflowBehavior, ReadonlyOptions } from '../../options';
import type { ScrollbarsSetupElementsObj } from './scrollbarsSetup.elements';
import type {
  ObserversSetupState,
  ObserversSetupUpdateHints,
  Setup,
  SetupUpdateInfo,
  StructureSetupState,
  StructureSetupUpdateHints,
} from '../../setups';
import type { InitializationTarget } from '../../initialization';
import type { OverflowStyle } from '../../typings';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
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
} from '../../classnames';
import { getEnvironment } from '../../environment';
import {
  bind,
  noop,
  addEventListener,
  push,
  runEachAndClear,
  selfClearTimeout,
  strScroll,
  strVisible,
} from '../../support';
import { createScrollbarsSetupElements } from './scrollbarsSetup.elements';
import { createScrollbarsSetupEvents } from './scrollbarsSetup.events';
import {
  getStaticPluginModuleInstance,
  ScrollbarsHidingPlugin,
  scrollbarsHidingPluginName,
} from '../../plugins';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScrollbarsSetupState {}

export interface ScrollbarsSetupUpdateInfo extends SetupUpdateInfo {
  _observersUpdateHints?: ObserversSetupUpdateHints;
  _structureUpdateHints?: StructureSetupUpdateHints;
}

export type ScrollbarsSetup = [
  ...Setup<ScrollbarsSetupUpdateInfo, ScrollbarsSetupState, void>,
  /** The elements created by the scrollbars setup. */
  ScrollbarsSetupElementsObj,
];

export const createScrollbarsSetup = (
  target: InitializationTarget,
  options: ReadonlyOptions,
  observersSetupState: ObserversSetupState,
  structureSetupState: StructureSetupState,
  structureSetupElements: StructureSetupElementsObj,
  onScroll: (event: Event) => void
): ScrollbarsSetup => {
  let mouseInHost: boolean | undefined;
  let autoHideIsMove: boolean | undefined;
  let autoHideIsLeave: boolean | undefined;
  let autoHideIsNever: boolean | undefined;
  let prevTheme: string | null | undefined;
  let instanceAutoHideSuspendScrollDestroyFn = noop;
  let instanceAutoHideDelay = 0;
  const hoverablePointerTypes = ['mouse', 'pen'];

  // needed to not fire unnecessary operations for pointer events on ios safari which will cause side effects: https://github.com/KingSora/OverlayScrollbars/issues/560
  const isHoverablePointerType = (event: PointerEvent) =>
    hoverablePointerTypes.includes(event.pointerType);

  const [requestScrollAnimationFrame, cancelScrollAnimationFrame] = selfClearTimeout();
  const [autoHideInstantInteractionTimeout, clearAutoHideInstantInteractionTimeout] =
    selfClearTimeout(100);
  const [autoHideSuspendTimeout, clearAutoHideSuspendTimeout] = selfClearTimeout(100);
  const [auotHideTimeout, clearAutoHideTimeout] = selfClearTimeout(() => instanceAutoHideDelay);
  const [elements, appendElements] = createScrollbarsSetupElements(
    target,
    structureSetupElements,
    structureSetupState,
    createScrollbarsSetupEvents(
      options,
      structureSetupElements,
      structureSetupState,
      (event) => isHoverablePointerType(event) && manageScrollbarsAutoHideInstantInteraction()
    )
  );
  const { _host, _scrollEventElement, _isBody } = structureSetupElements;
  const {
    _scrollbarsAddRemoveClass,
    _refreshScrollbarsHandleLength,
    _refreshScrollbarsHandleOffset,
    _refreshScrollbarsScrollCoordinates,
    _refreshScrollbarsScrollbarOffset,
  } = elements;
  const manageScrollbarsAutoHide = (removeAutoHide: boolean, delayless?: boolean) => {
    clearAutoHideTimeout();
    if (removeAutoHide) {
      _scrollbarsAddRemoveClass(classNameScrollbarAutoHideHidden);
    } else {
      const hide = bind(_scrollbarsAddRemoveClass, classNameScrollbarAutoHideHidden, true);
      if (instanceAutoHideDelay > 0 && !delayless) {
        auotHideTimeout(hide);
      } else {
        hide();
      }
    }
  };
  const manageScrollbarsAutoHideInstantInteraction = () => {
    if (autoHideIsLeave ? !mouseInHost : !autoHideIsNever) {
      manageScrollbarsAutoHide(true);
      autoHideInstantInteractionTimeout(() => {
        manageScrollbarsAutoHide(false);
      });
    }
  };
  const manageAutoHideSuspension = (add: boolean) => {
    _scrollbarsAddRemoveClass(classNameScrollbarAutoHide, add, true);
    _scrollbarsAddRemoveClass(classNameScrollbarAutoHide, add, false);
  };
  const onHostMouseEnter = (event: PointerEvent) => {
    if (isHoverablePointerType(event)) {
      mouseInHost = autoHideIsLeave;
      if (autoHideIsLeave) {
        manageScrollbarsAutoHide(true);
      }
    }
  };
  const destroyFns: (() => void)[] = [
    clearAutoHideTimeout,
    clearAutoHideInstantInteractionTimeout,
    clearAutoHideSuspendTimeout,
    cancelScrollAnimationFrame,
    () => instanceAutoHideSuspendScrollDestroyFn(),

    addEventListener(_host, 'pointerover', onHostMouseEnter, { _once: true }),
    addEventListener(_host, 'pointerenter', onHostMouseEnter),
    addEventListener(_host, 'pointerleave', (event: PointerEvent) => {
      if (isHoverablePointerType(event)) {
        mouseInHost = false;
        if (autoHideIsLeave) {
          manageScrollbarsAutoHide(false);
        }
      }
    }),
    addEventListener(_host, 'pointermove', (event: PointerEvent) => {
      if (isHoverablePointerType(event) && autoHideIsMove) {
        manageScrollbarsAutoHideInstantInteraction();
      }
    }),
    addEventListener(_scrollEventElement, 'scroll', (event) => {
      requestScrollAnimationFrame(() => {
        _refreshScrollbarsHandleOffset();
        manageScrollbarsAutoHideInstantInteraction();
      });

      onScroll(event);

      _refreshScrollbarsScrollbarOffset();
    }),
  ];
  const scrollbarsHidingPlugin = getStaticPluginModuleInstance<typeof ScrollbarsHidingPlugin>(
    scrollbarsHidingPluginName
  );

  return [
    () => bind(runEachAndClear, push(destroyFns, appendElements())),
    ({ _checkOption, _force, _observersUpdateHints, _structureUpdateHints }) => {
      const {
        _overflowEdgeChanged,
        _overflowAmountChanged,
        _overflowStyleChanged,
        _scrollCoordinatesChanged,
      } = _structureUpdateHints || {};
      const { _directionChanged, _appear } = _observersUpdateHints || {};
      const { _directionIsRTL } = observersSetupState;
      const { _nativeScrollbarsOverlaid, _nativeScrollbarsHiding } = getEnvironment();
      const { _overflowStyle, _hasOverflow } = structureSetupState;
      const [showNativeOverlaidScrollbarsOption, showNativeOverlaidScrollbarsChanged] =
        _checkOption('showNativeOverlaidScrollbars');
      const [theme, themeChanged] = _checkOption('scrollbars.theme');
      const [visibility, visibilityChanged] = _checkOption('scrollbars.visibility');
      const [autoHide, autoHideChanged] = _checkOption('scrollbars.autoHide');
      const [autoHideSuspend, autoHideSuspendChanged] = _checkOption('scrollbars.autoHideSuspend');
      const [autoHideDelay] = _checkOption('scrollbars.autoHideDelay');
      const [dragScroll, dragScrollChanged] = _checkOption('scrollbars.dragScroll');
      const [clickScroll, clickScrollChanged] = _checkOption('scrollbars.clickScroll');
      const [overflow, overflowChanged] = _checkOption('overflow');
      const trulyAppeared = _appear && !_force;
      const hasOverflow = _hasOverflow.x || _hasOverflow.y;
      const updateScrollbars =
        _overflowEdgeChanged ||
        _overflowAmountChanged ||
        _scrollCoordinatesChanged ||
        _directionChanged ||
        _force;
      const updateVisibility = _overflowStyleChanged || visibilityChanged || overflowChanged;
      const showNativeOverlaidScrollbars =
        showNativeOverlaidScrollbarsOption &&
        _nativeScrollbarsOverlaid.x &&
        _nativeScrollbarsOverlaid.y;
      const cantHideScrollbars = !_nativeScrollbarsHiding && !scrollbarsHidingPlugin;
      const showNativeScrollbars = showNativeOverlaidScrollbars || cantHideScrollbars;

      const setScrollbarVisibility = (
        overflowBehavior: OverflowBehavior,
        overflowStyle: OverflowStyle,
        isHorizontal: boolean
      ) => {
        const isVisible =
          overflowBehavior.includes(strScroll) &&
          (visibility === strVisible || (visibility === 'auto' && overflowStyle === strScroll));

        _scrollbarsAddRemoveClass(classNameScrollbarVisible, isVisible, isHorizontal);

        return isVisible;
      };

      instanceAutoHideDelay = autoHideDelay;

      if (trulyAppeared) {
        if (autoHideSuspend && hasOverflow) {
          manageAutoHideSuspension(false);
          instanceAutoHideSuspendScrollDestroyFn();
          autoHideSuspendTimeout(() => {
            instanceAutoHideSuspendScrollDestroyFn = addEventListener(
              _scrollEventElement,
              'scroll',
              bind(manageAutoHideSuspension, true),
              {
                _once: true,
              }
            );
          });
        } else {
          manageAutoHideSuspension(true);
        }
      }

      if (showNativeOverlaidScrollbarsChanged || cantHideScrollbars) {
        _scrollbarsAddRemoveClass(classNameScrollbarThemeNone, showNativeScrollbars);
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
        autoHideIsNever = autoHide === 'never';
        manageScrollbarsAutoHide(autoHideIsNever, true);
      }

      if (dragScrollChanged) {
        _scrollbarsAddRemoveClass(classNameScrollbarHandleInteractive, dragScroll);
      }

      if (clickScrollChanged) {
        _scrollbarsAddRemoveClass(classNameScrollbarTrackInteractive, !!clickScroll);
      }

      // always update scrollbar visibility before scrollbar size
      // the scrollbar size is influenced whether both or just one scrollbar is visible (because of the corner element)
      if (updateVisibility) {
        const xVisible = setScrollbarVisibility(overflow.x, _overflowStyle.x, true);
        const yVisible = setScrollbarVisibility(overflow.y, _overflowStyle.y, false);
        const hasCorner = xVisible && yVisible;

        _scrollbarsAddRemoveClass(classNameScrollbarCornerless, !hasCorner);
      }

      // always update scrollbar sizes after the visibility
      if (updateScrollbars) {
        _refreshScrollbarsHandleOffset();
        _refreshScrollbarsHandleLength();
        _refreshScrollbarsScrollbarOffset();
        if (_scrollCoordinatesChanged) {
          _refreshScrollbarsScrollCoordinates();
        }

        _scrollbarsAddRemoveClass(classNameScrollbarUnusable, !_hasOverflow.x, true);
        _scrollbarsAddRemoveClass(classNameScrollbarUnusable, !_hasOverflow.y, false);
        _scrollbarsAddRemoveClass(classNameScrollbarRtl, _directionIsRTL && !_isBody);
      }
    },
    {},
    elements,
  ];
};
