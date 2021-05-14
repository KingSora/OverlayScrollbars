import {
  createCache,
  keys,
  attr,
  WH,
  XY,
  style,
  scrollSize,
  CacheValues,
  equalWH,
  addClass,
  removeClass,
  clientSize,
  offsetSize,
  getBoundingClientRect,
  noop,
  each,
} from 'support';
import { LifecycleHub, Lifecycle } from 'lifecycles/lifecycleHub';
import { getEnvironment } from 'environment';
import { OverflowBehavior } from 'options';
import { StyleObject } from 'typings';
import { classNameViewportArrange, classNameViewportScrollbarStyling } from 'classnames';

interface OverflowAmountCacheContext {
  _viewportScrollSize: WH<number>;
  _viewportClientSize: WH<number>;
  _viewportSizeFraction: WH<number>;
}

interface ViewportOverflowState {
  _scrollbarsHideOffset: XY<number>;
  _scrollbarsHideOffsetArrange: XY<boolean>;
  _overflowScroll: XY<boolean>;
}

interface UndoViewportArrangeResult {
  _redoViewportArrange: () => void;
  _viewportOverflowState?: ViewportOverflowState;
}

interface OverflowOption {
  x: OverflowBehavior;
  y: OverflowBehavior;
}

const { max, abs, round } = Math;
const overlaidScrollbarsHideOffset = 42;
const whCacheOptions = {
  _equal: equalWH,
  _initialValue: { w: 0, h: 0 },
};
const sizeFraction = (elm: HTMLElement): WH<number> => {
  const viewportOffsetSize = offsetSize(elm);
  const viewportRect = getBoundingClientRect(elm);
  return {
    w: viewportRect.width - viewportOffsetSize.w,
    h: viewportRect.height - viewportOffsetSize.h,
  };
};
const setAxisOverflowStyle = (horizontal: boolean, overflowAmount: number, behavior: OverflowBehavior, styleObj: StyleObject) => {
  const overflowKey: keyof StyleObject = horizontal ? 'overflowX' : 'overflowY';
  const behaviorIsVisible = behavior.indexOf('visible') === 0;
  const behaviorIsVisibleHidden = behavior === 'visible-hidden';
  const behaviorIsScroll = behavior === 'scroll';
  const hasOverflow = overflowAmount > 0;

  if (behaviorIsVisible) {
    styleObj[overflowKey] = 'visible';
  }
  if (behaviorIsScroll && hasOverflow) {
    styleObj[overflowKey] = behavior;
  }

  return {
    _visible: behaviorIsVisible,
    _behavior: behaviorIsVisibleHidden ? 'hidden' : 'scroll',
  };
};

/**
 * Lifecycle with the responsibility to set the correct overflow and scrollbar hiding styles of the viewport element.
 * @param lifecycleHub
 * @returns
 */
export const createOverflowLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _structureSetup, _doViewportArrange, _getLifecycleCommunication, _setLifecycleCommunication } = lifecycleHub;
  const { _host, _viewport, _viewportArrange } = _structureSetup._targetObj;
  const { _update: updateViewportSizeFraction, _current: getCurrentViewportSizeFraction } = createCache<WH<number>>(
    sizeFraction.bind(0, _viewport),
    whCacheOptions
  );
  const { _update: updateViewportScrollSizeCache, _current: getCurrentViewportScrollSizeCache } = createCache<WH<number>>(
    scrollSize.bind(0, _viewport),
    whCacheOptions
  );
  const { _update: updateOverflowAmountCache, _current: getCurrentOverflowAmountCache } = createCache<WH<number>, OverflowAmountCacheContext>(
    ({ _viewportScrollSize, _viewportClientSize, _viewportSizeFraction }) => ({
      w: max(0, round(max(0, _viewportScrollSize.w - _viewportClientSize.w) - max(0, _viewportSizeFraction.w))),
      h: max(0, round(max(0, _viewportScrollSize.h - _viewportClientSize.h) - max(0, _viewportSizeFraction.h))),
    }),
    whCacheOptions
  );

  /**
   * Applies a fixed height to the viewport so it can't overflow or underflow the host element.
   * @param viewportOverflowState The current overflow state.
   * @param heightIntrinsic Whether the host height is intrinsic or not.
   */
  const fixFlexboxGlue = (viewportOverflowState: ViewportOverflowState, heightIntrinsic: boolean) => {
    style(_viewport, {
      height: '',
    });

    if (heightIntrinsic) {
      const { _absolute: paddingAbsolute, _padding: padding } = _getLifecycleCommunication()._paddingInfo;
      const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
      const hostSizeFraction = sizeFraction(_host);
      const hostClientSize = clientSize(_host);
      // padding subtraction is only needed if padding is absolute or if viewport is content-box
      const paddingVertical = paddingAbsolute || style(_viewport, 'boxSizing') === 'content-box' ? padding.b + padding.t : 0;
      const fractionalClientHeight = hostClientSize.h + (abs(hostSizeFraction.h) < 1 ? hostSizeFraction.h : 0);

      style(_viewport, {
        height: fractionalClientHeight + (_overflowScroll.x ? _scrollbarsHideOffset.x : 0) - paddingVertical,
      });
    }
  };

  /**
   * Gets the current overflow state of the viewport.
   * @param showNativeOverlaidScrollbars Whether native overlaid scrollbars are shown instead of hidden.
   * @param viewportStyleObj The viewport style object where the overflow scroll property can be read of, or undefined if shall be determined.
   * @returns A object which contains informations about the current overflow state.
   */
  const getViewportOverflowState = (showNativeOverlaidScrollbars: boolean, viewportStyleObj?: StyleObject): ViewportOverflowState => {
    const { _nativeScrollbarSize, _nativeScrollbarIsOverlaid, _nativeScrollbarStyling } = getEnvironment();
    const { x: overlaidX, y: overlaidY } = _nativeScrollbarIsOverlaid;
    const determineOverflow = !viewportStyleObj;
    const arrangeHideOffset = !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const styleObj = determineOverflow ? style(_viewport, ['overflowX', 'overflowY']) : viewportStyleObj;
    const scroll = {
      x: styleObj!.overflowX === 'scroll',
      y: styleObj!.overflowY === 'scroll',
    };
    const scrollbarsHideOffset = {
      x: scroll.x && !_nativeScrollbarStyling ? (overlaidX ? arrangeHideOffset : _nativeScrollbarSize.x) : 0,
      y: scroll.y && !_nativeScrollbarStyling ? (overlaidY ? arrangeHideOffset : _nativeScrollbarSize.y) : 0,
    };

    return {
      _overflowScroll: scroll,
      _scrollbarsHideOffsetArrange: {
        x: overlaidX && !!arrangeHideOffset,
        y: overlaidY && !!arrangeHideOffset,
      },
      _scrollbarsHideOffset: scrollbarsHideOffset,
    };
  };

  /**
   * Sets the overflow property of the viewport and calculates the a overflow state according to the new parameters.
   * @param showNativeOverlaidScrollbars Whether to show natively overlaid scrollbars.
   * @param overflowAmount The overflow amount.
   * @param overflow The overflow behavior according to the options.
   * @param viewportStyleObj The viewport style object to which the overflow style shall be applied.
   * @returns A object which represents the newly set overflow state.
   */
  const setViewportOverflowState = (
    showNativeOverlaidScrollbars: boolean,
    overflowAmount: WH<number>,
    overflow: OverflowOption,
    viewportStyleObj: StyleObject
  ): ViewportOverflowState => {
    const { _visible: xVisible, _behavior: xVisibleBehavior } = setAxisOverflowStyle(true, overflowAmount!.w, overflow.x, viewportStyleObj);
    const { _visible: yVisible, _behavior: yVisibleBehavior } = setAxisOverflowStyle(false, overflowAmount!.h, overflow.y, viewportStyleObj);

    if (xVisible && !yVisible) {
      viewportStyleObj.overflowX = xVisibleBehavior;
    }
    if (yVisible && !xVisible) {
      viewportStyleObj.overflowY = yVisibleBehavior;
    }

    return getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj);
  };

  /**
   * Sets the styles of the viewport arrange element.
   * @param viewportOverflowState The viewport overflow state according to which the scrollbars shall be hidden.
   * @param viewportScrollSize The content scroll size.
   * @param directionIsRTL Whether the direction is RTL or not.
   * @returns A boolean which indicates whether the viewport arrange element was adjusted.
   */
  const arrangeViewport = (
    viewportOverflowState: ViewportOverflowState,
    viewportScrollSize: WH<number>,
    viewportSizeFraction: WH<number>,
    directionIsRTL: boolean
  ) => {
    if (_doViewportArrange) {
      const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
      const { _viewportPaddingStyle: viewportPaddingStyle } = _getLifecycleCommunication();
      const viewportArrangeHorizontalPaddingKey: keyof StyleObject = directionIsRTL ? 'paddingRight' : 'paddingLeft';
      const viewportArrangeHorizontalPaddingValue = viewportPaddingStyle[viewportArrangeHorizontalPaddingKey] as number;
      const viewportArrangeVerticalPaddingValue = viewportPaddingStyle.paddingTop as number;
      const fractionalContentWidth = viewportScrollSize.w + (abs(viewportSizeFraction.w) < 1 ? viewportSizeFraction.w : 0);
      const fractionalContenHeight = viewportScrollSize.h + (abs(viewportSizeFraction.h) < 1 ? viewportSizeFraction.h : 0);
      const arrangeSize = {
        w: hideOffsetY && arrangeY ? `${hideOffsetY + fractionalContentWidth - viewportArrangeHorizontalPaddingValue}px` : '',
        h: hideOffsetX && arrangeX ? `${hideOffsetX + fractionalContenHeight - viewportArrangeVerticalPaddingValue}px` : '',
      };

      // adjust content arrange / before element
      if (_viewportArrange) {
        const { sheet } = _viewportArrange;
        if (sheet) {
          const { cssRules } = sheet;
          if (cssRules) {
            if (!cssRules.length) {
              sheet.insertRule(`#${attr(_viewportArrange, 'id')} + .${classNameViewportArrange}::before {}`, 0);
            }

            // @ts-ignore
            const ruleStyle = cssRules[0].style;

            ruleStyle.width = arrangeSize.w;
            ruleStyle.height = arrangeSize.h;
          }
        }
      } else {
        style<'--os-vaw' | '--os-vah'>(_viewport, {
          '--os-vaw': arrangeSize.w,
          '--os-vah': arrangeSize.h,
        });
      }
    }

    return _doViewportArrange;
  };

  /**
   * Hides the native scrollbars according to the passed parameters.
   * @param viewportOverflowState The viewport overflow state.
   * @param directionIsRTL Whether the direction is RTL or not.
   * @param viewportArrange Whether special styles related to the viewport arrange strategy shall be applied.
   * @param viewportStyleObj The viewport style object to which the needed styles shall be applied.
   */
  const hideNativeScrollbars = (
    viewportOverflowState: ViewportOverflowState,
    directionIsRTL: boolean,
    viewportArrange: boolean,
    viewportStyleObj: StyleObject
  ) => {
    const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
    const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
    const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
    const { _viewportPaddingStyle: viewportPaddingStyle } = _getLifecycleCommunication();
    const horizontalMarginKey: keyof StyleObject = directionIsRTL ? 'marginLeft' : 'marginRight';
    const viewportHorizontalPaddingKey: keyof StyleObject = directionIsRTL ? 'paddingLeft' : 'paddingRight';
    const horizontalMarginValue = viewportPaddingStyle[horizontalMarginKey] as number;
    const verticalMarginValue = viewportPaddingStyle.marginBottom as number;
    const horizontalPaddingValue = viewportPaddingStyle[viewportHorizontalPaddingKey] as number;
    const verticalPaddingValue = viewportPaddingStyle.paddingBottom as number;

    // horizontal
    viewportStyleObj.width = `calc(100% + ${hideOffsetY + horizontalMarginValue * -1}px)`;
    viewportStyleObj[horizontalMarginKey] = -hideOffsetY + horizontalMarginValue;

    // vertical
    viewportStyleObj.marginBottom = -hideOffsetX + verticalMarginValue;

    // viewport arrange additional styles
    if (viewportArrange) {
      viewportStyleObj[viewportHorizontalPaddingKey] = horizontalPaddingValue + (arrangeY ? hideOffsetY : 0);
      viewportStyleObj.paddingBottom = verticalPaddingValue + (arrangeX ? hideOffsetX : 0);
    }
  };

  /**
   * Removes all styles applied because of the viewport arrange strategy.
   * @param showNativeOverlaidScrollbars Whether native overlaid scrollbars are shown instead of hidden.
   * @param directionIsRTL Whether the direction is RTL or not.
   * @param viewportOverflowState The currentviewport overflow state or undefined if it has to be determined.
   * @returns A object with a function which applies all the removed styles and the determined viewport vverflow state.
   */
  const undoViewportArrange = (
    showNativeOverlaidScrollbars: boolean,
    directionIsRTL: boolean,
    viewportOverflowState?: ViewportOverflowState
  ): UndoViewportArrangeResult => {
    if (_doViewportArrange) {
      const finalViewportOverflowState = viewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars);
      const { _viewportPaddingStyle: viewportPaddingStyle } = _getLifecycleCommunication();
      const { _flexboxGlue } = getEnvironment();
      const { _scrollbarsHideOffsetArrange } = finalViewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const finalPaddingStyle: StyleObject = {};
      const assignProps = (props: string) =>
        each(props.split(' '), (prop) => {
          finalPaddingStyle[prop] = viewportPaddingStyle[prop];
        });

      if (!_flexboxGlue) {
        finalPaddingStyle.height = '';
      }

      if (arrangeX) {
        assignProps('marginBottom paddingTop paddingBottom');
      }

      if (arrangeY) {
        assignProps('marginLeft marginRight paddingLeft paddingRight');
      }

      const prevStyle = style(_viewport, keys(finalPaddingStyle));
      removeClass(_viewport, classNameViewportArrange);
      style(_viewport, finalPaddingStyle);

      return {
        _redoViewportArrange: () => {
          hideNativeScrollbars(finalViewportOverflowState, directionIsRTL, _doViewportArrange, prevStyle);
          style(_viewport, prevStyle);
          addClass(_viewport, classNameViewportArrange);
        },
        _viewportOverflowState: finalViewportOverflowState,
      };
    }
    return {
      _redoViewportArrange: noop,
    };
  };

  return (updateHints, checkOption, force) => {
    const { _directionIsRTL, _heightIntrinsic, _sizeChanged, _hostMutation, _contentMutation, _paddingStyleChanged } = updateHints;
    const { _flexboxGlue, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();
    const { _value: heightIntrinsic, _changed: heightIntrinsicChanged } = _heightIntrinsic;
    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: showNativeOverlaidScrollbarsOption, _changed: showNativeOverlaidScrollbarsChanged } = checkOption<boolean>(
      'nativeScrollbarsOverlaid.show'
    );
    const showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
    const adjustFlexboxGlue =
      !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged || heightIntrinsicChanged);
    let viewportSizeFractionCache: CacheValues<WH<number>> = getCurrentViewportSizeFraction(force);
    let viewportScrollSizeCache: CacheValues<WH<number>> = getCurrentViewportScrollSizeCache(force);
    let overflowAmuntCache: CacheValues<WH<number>> = getCurrentOverflowAmountCache(force);
    let preMeasureViewportOverflowState: ViewportOverflowState | undefined;

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarStyling) {
      if (showNativeOverlaidScrollbars) {
        removeClass(_viewport, classNameViewportScrollbarStyling);
      } else {
        addClass(_viewport, classNameViewportScrollbarStyling);
      }
    }

    if (adjustFlexboxGlue) {
      preMeasureViewportOverflowState = getViewportOverflowState(showNativeOverlaidScrollbars);
      fixFlexboxGlue(preMeasureViewportOverflowState, !!heightIntrinsic);
    }

    if (_sizeChanged || _paddingStyleChanged || _contentMutation || showNativeOverlaidScrollbarsChanged || directionChanged) {
      const { _redoViewportArrange, _viewportOverflowState: undoViewportArrangeOverflowState } = undoViewportArrange(
        showNativeOverlaidScrollbars,
        directionIsRTL!,
        preMeasureViewportOverflowState
      );
      const { _value: viewportSizeFraction, _changed: viewportSizeFractionCahnged } = (viewportSizeFractionCache = updateViewportSizeFraction(force));
      const { _value: viewportScrollSize, _changed: viewportScrollSizeChanged } = (viewportScrollSizeCache = updateViewportScrollSizeCache(force));
      const viewportContentSize = clientSize(_viewport);
      let arrangedViewportScrollSize = viewportScrollSize!;
      let arrangedViewportClientSize = viewportContentSize;

      _redoViewportArrange();

      // if re measure is required (only required if content arrange strategy is used)
      if (
        (viewportScrollSizeChanged || viewportSizeFractionCahnged || showNativeOverlaidScrollbarsChanged) &&
        undoViewportArrangeOverflowState &&
        !showNativeOverlaidScrollbars &&
        arrangeViewport(undoViewportArrangeOverflowState, viewportScrollSize!, viewportSizeFraction!, directionIsRTL!)
      ) {
        arrangedViewportClientSize = clientSize(_viewport);
        arrangedViewportScrollSize = scrollSize(_viewport);
      }

      overflowAmuntCache = updateOverflowAmountCache(force, {
        _viewportSizeFraction: viewportSizeFraction!,
        _viewportScrollSize: {
          w: max(viewportScrollSize!.w, arrangedViewportScrollSize.w),
          h: max(viewportScrollSize!.h, arrangedViewportScrollSize.h),
        },
        _viewportClientSize: {
          w: arrangedViewportClientSize.w + max(0, viewportContentSize.w - viewportScrollSize!.w),
          h: arrangedViewportClientSize.h + max(0, viewportContentSize.h - viewportScrollSize!.h),
        },
      });
    }

    const { _value: viewportSizeFraction, _changed: viewportSizeFractionChanged } = viewportSizeFractionCache;
    const { _value: viewportScrollSize, _changed: viewportScrollSizeChanged } = viewportScrollSizeCache;
    const { _value: overflowAmount, _changed: overflowAmountChanged } = overflowAmuntCache;
    const { _value: overflow, _changed: overflowChanged } = checkOption<OverflowOption>('overflow');

    if (
      _paddingStyleChanged ||
      viewportSizeFractionChanged ||
      viewportScrollSizeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      directionChanged ||
      adjustFlexboxGlue
    ) {
      const viewportStyle: StyleObject = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: '',
        overflowY: '',
        overflowX: '',
      };

      const viewportOverflowState = setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount!, overflow, viewportStyle);
      const viewportArranged = arrangeViewport(viewportOverflowState, viewportScrollSize!, viewportSizeFraction!, directionIsRTL!);
      hideNativeScrollbars(viewportOverflowState, directionIsRTL!, viewportArranged, viewportStyle);

      if (adjustFlexboxGlue) {
        fixFlexboxGlue(viewportOverflowState, !!heightIntrinsic);
      }

      // TODO: hide host overflow if scroll x or y and no padding element there
      // TODO: Test without content
      // TODO: Test without padding
      // TODO: overflow: visible on padding / host if overflow visible on both axis

      style(_viewport, viewportStyle);

      _setLifecycleCommunication({
        _viewportOverflowScroll: viewportOverflowState._overflowScroll,
        _viewportOverflowAmount: overflowAmount,
      });
    }
  };
};
