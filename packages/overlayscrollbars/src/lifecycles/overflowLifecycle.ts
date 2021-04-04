import {
  createCache,
  keys,
  attr,
  WH,
  XY,
  equalXY,
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
} from 'support';
import { LifecycleHub, Lifecycle } from 'lifecycles/lifecycleHub';
import { getEnvironment } from 'environment';
import { OverflowBehavior } from 'options';
import { StyleObject } from 'typings';
import { classNameViewportArrange, classNameViewportScrollbarStyling } from 'classnames';

interface ContentScrollSizeCacheContext {
  _viewportRect: DOMRect;
  _viewportOffsetSize: WH<number>;
  _viewportScrollSize: WH<number>;
}

interface OverflowAmountCacheContext {
  _contentScrollSize: WH<number>;
  _viewportSize: WH<number>;
}

interface ViewportOverflowState {
  _scrollbarsHideOffset: XY<number>;
  _scrollbarsHideOffsetArrange: XY<boolean>;
  _overflowScroll: XY<boolean>;
}

interface OverflowOption {
  x: OverflowBehavior;
  y: OverflowBehavior;
}

const overlaidScrollbarsHideOffset = 42;

/**
 * Lifecycle with the responsibility to set the correct overflow and scrollbar hiding styles of the viewport element.
 * @param lifecycleHub
 * @returns
 */
export const createOverflowLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _structureSetup, _doViewportArrange, _getViewportPaddingStyle, _getPaddingInfo, _setViewportOverflowScroll } = lifecycleHub;
  const { _host, _padding, _viewport, _viewportArrange } = _structureSetup._targetObj;
  const { _update: updateContentScrollSizeCache, _current: getCurrentContentScrollSizeCache } = createCache<
    WH<number>,
    ContentScrollSizeCacheContext
  >((ctx) => fixScrollSizeRounding(ctx._viewportScrollSize, ctx._viewportOffsetSize, ctx._viewportRect), { _equal: equalWH });
  const { _update: updateOverflowAmountCache, _current: getCurrentOverflowAmountCache } = createCache<XY<number>, OverflowAmountCacheContext>(
    (ctx) => ({
      x: Math.max(0, ctx._contentScrollSize.w - ctx._viewportSize.w),
      y: Math.max(0, ctx._contentScrollSize.h - ctx._viewportSize.h),
    }),
    { _equal: equalXY, _initialValue: { x: 0, y: 0 } }
  );

  /**
   * Fixes incorrect roundng of scroll size.
   * @param viewportScrollSize The potential incorrect viewport scroll size.
   * @param viewportOffsetSize The viewport offset size.
   * @param viewportRect The viewport bounding client rect.
   * @returns The passed scroll size without rounding errors.
   */
  const fixScrollSizeRounding = (viewportScrollSize: WH<number>, viewportOffsetSize: WH<number>, viewportRect: DOMRect): WH<number> => ({
    w: viewportScrollSize.w - Math.round(Math.max(0, viewportRect.width - viewportOffsetSize.w)),
    h: viewportScrollSize.h - Math.round(Math.max(0, viewportRect.height - viewportOffsetSize.h)),
  });

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
      const { _absolute: paddingAbsolute, _padding: padding } = _getPaddingInfo();
      const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
      const hostBCR = getBoundingClientRect(_host);
      const hostOffsetSize = offsetSize(_host);
      const hostClientSize = clientSize(_host);
      const paddingAbsoluteVertical = paddingAbsolute ? padding.b + padding.t : 0;
      const clientSizeWithoutRounding = hostClientSize.h + (hostBCR.height - hostOffsetSize.h);

      style(_viewport, {
        height: clientSizeWithoutRounding + (_overflowScroll.x ? _scrollbarsHideOffset.x : 0) - paddingAbsoluteVertical,
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
        x: overlaidX,
        y: overlaidY,
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
    overflowAmount: XY<number>,
    overflow: OverflowOption,
    viewportStyleObj: StyleObject
  ): ViewportOverflowState => {
    const setPartialStylePerAxis = (horizontal: boolean, overflowAmount: number, behavior: OverflowBehavior, styleObj: StyleObject) => {
      const overflowKey: keyof StyleObject = horizontal ? 'overflowX' : 'overflowY';
      const behaviorIsScroll = behavior === 'scroll';
      const behaviorIsVisibleScroll = behavior === 'visible-scroll';
      const hideOverflow = behaviorIsScroll || behavior === 'hidden';
      const applyStyle = overflowAmount > 0 && hideOverflow;

      if (applyStyle) {
        styleObj[overflowKey] = behavior;
      }

      return {
        _visible: !applyStyle,
        _behavior: behaviorIsVisibleScroll ? 'scroll' : 'hidden',
      };
    };
    const { _visible: xVisible, _behavior: xVisibleBehavior } = setPartialStylePerAxis(true, overflowAmount!.x, overflow.x, viewportStyleObj);
    const { _visible: yVisible, _behavior: yVisibleBehavior } = setPartialStylePerAxis(false, overflowAmount!.y, overflow.y, viewportStyleObj);

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
   * @param contentScrollSize The content scroll size.
   * @param directionIsRTL Whether the direction is RTL or not.
   * @returns A boolean which indicates whether the viewport arrange element was adjusted.
   */
  const arrangeViewport = (viewportOverflowState: ViewportOverflowState, contentScrollSize: WH<number>, directionIsRTL: boolean) => {
    if (_doViewportArrange) {
      const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
      const viewportPaddingStyle = _getViewportPaddingStyle();
      const viewportArrangeHorizontalPaddingKey: keyof StyleObject = directionIsRTL ? 'paddingRight' : 'paddingLeft';
      const viewportArrangeHorizontalPaddingValue = viewportPaddingStyle[viewportArrangeHorizontalPaddingKey] as number;
      const viewportArrangeVerticalPaddingValue = viewportPaddingStyle.paddingTop as number;
      const arrangeSize = {
        w: hideOffsetY && arrangeY ? `${hideOffsetY + contentScrollSize.w - viewportArrangeHorizontalPaddingValue}px` : '',
        h: hideOffsetX && arrangeX ? `${hideOffsetX + contentScrollSize.h - viewportArrangeVerticalPaddingValue}px` : '',
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
        style<'--viewport-arrange-width' | '--viewport-arrange-height'>(_viewport, {
          '--viewport-arrange-width': arrangeSize.w,
          '--viewport-arrange-height': arrangeSize.h,
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
    const { _nativeScrollbarStyling } = getEnvironment();
    const { _overflowScroll, _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
    const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
    const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
    const { x: scrollX, y: scrollY } = _overflowScroll;
    const paddingStyle = _getViewportPaddingStyle();
    const horizontalMarginKey: keyof StyleObject = directionIsRTL ? 'marginLeft' : 'marginRight';
    const viewportHorizontalPaddingKey: keyof StyleObject = directionIsRTL ? 'paddingLeft' : 'paddingRight';
    const horizontalMarginValue = paddingStyle[horizontalMarginKey] as number;
    const verticalMarginValue = paddingStyle.marginBottom as number;
    const horizontalPaddingValue = paddingStyle[viewportHorizontalPaddingKey] as number;
    const verticalPaddingValue = paddingStyle.paddingBottom as number;

    // horizontal
    viewportStyleObj.maxWidth = `calc(100% + ${hideOffsetY + horizontalMarginValue * -1}px)`;
    viewportStyleObj[horizontalMarginKey] = -hideOffsetY + horizontalMarginValue;

    // vertical
    viewportStyleObj.marginBottom = -hideOffsetX + verticalMarginValue;

    // viewport arrange additional styles
    if (viewportArrange) {
      viewportStyleObj[viewportHorizontalPaddingKey] = horizontalPaddingValue + (arrangeY ? hideOffsetY : 0);
      viewportStyleObj.paddingBottom = verticalPaddingValue + (arrangeX ? hideOffsetX : 0);
    }

    // hide overflowing scrollbars if there are any
    if (!_nativeScrollbarStyling) {
      style(_padding || _host, {
        overflow: scrollX || scrollY ? 'hidden' : '',
      });
    }
  };

  /**
   * Removes all styles applied because of the viewport arrange strategy.
   * @returns A function which again applies all the removed styles.
   */
  const undoViewportArrange = () => {
    if (_doViewportArrange) {
      const { _flexboxGlue } = getEnvironment();
      let paddingStyle = _getViewportPaddingStyle();

      if (!_flexboxGlue) {
        paddingStyle = {
          ...paddingStyle,
          height: '',
        };
      }

      const prevStyle = style(_viewport, keys(paddingStyle));
      removeClass(_viewport, classNameViewportArrange);
      style(_viewport, paddingStyle);

      return () => {
        style(_viewport, prevStyle);
        addClass(_viewport, classNameViewportArrange);
      };
    }
    return noop;
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
    let overflowAmuntCache: CacheValues<XY<number>> = getCurrentOverflowAmountCache(force);
    let contentScrollSizeCache: CacheValues<WH<number>> = getCurrentContentScrollSizeCache(force);
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
      const redoViewportArrange = undoViewportArrange();
      const contentSize = clientSize(_viewport);
      const viewportRect = getBoundingClientRect(_viewport);
      const viewportOffsetSize = offsetSize(_viewport);
      let viewportScrollSize = scrollSize(_viewport);
      let viewportClientSize = contentSize;
      const { _value: contentScrollSize, _changed: contentScrollSizeChanged } = (contentScrollSizeCache = updateContentScrollSizeCache(force, {
        _viewportRect: viewportRect,
        _viewportOffsetSize: viewportOffsetSize,
        _viewportScrollSize: viewportScrollSize,
      }));

      redoViewportArrange();

      if ((contentScrollSizeChanged || showNativeOverlaidScrollbarsChanged) && !showNativeOverlaidScrollbars) {
        const arranged = arrangeViewport(
          preMeasureViewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars),
          contentScrollSize!,
          directionIsRTL!
        );

        if (arranged) {
          viewportClientSize = clientSize(_viewport);
          viewportScrollSize = fixScrollSizeRounding(scrollSize(_viewport), offsetSize(_viewport), getBoundingClientRect(_viewport));
        }
      }

      overflowAmuntCache = updateOverflowAmountCache(force, {
        _contentScrollSize: {
          w: Math.max(contentScrollSize!.w, viewportScrollSize.w),
          h: Math.max(contentScrollSize!.h, viewportScrollSize.h),
        },
        _viewportSize: {
          w: viewportClientSize.w + Math.max(0, contentSize.w - contentScrollSize!.w),
          h: viewportClientSize.h + Math.max(0, contentSize.h - contentScrollSize!.h),
        },
      });
    }

    const { _value: overflow, _changed: overflowChanged } = checkOption<OverflowOption>('overflow');
    const { _value: contentScrollSize, _changed: contentScrollSizeChanged } = contentScrollSizeCache;
    const { _value: overflowAmount, _changed: overflowAmountChanged } = overflowAmuntCache;

    if (
      _paddingStyleChanged ||
      contentScrollSizeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      directionChanged ||
      adjustFlexboxGlue
    ) {
      const viewportStyle: StyleObject = {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        maxWidth: '',
        overflowY: '',
        overflowX: '',
      };

      const viewportOverflowState = setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount!, overflow, viewportStyle);
      const viewportArranged = arrangeViewport(viewportOverflowState, contentScrollSize!, directionIsRTL!);
      hideNativeScrollbars(viewportOverflowState, directionIsRTL!, viewportArranged, viewportStyle);

      if (adjustFlexboxGlue) {
        fixFlexboxGlue(viewportOverflowState, !!heightIntrinsic);
      }

      // TODO: enlargen viewport if div too small for firefox scrollbar hiding behavior
      // TODO: hide host overflow if scroll x or y and no padding element there
      // TODO: Test without content
      // TODO: Test without padding

      style(_viewport, viewportStyle);

      _setViewportOverflowScroll(viewportOverflowState._overflowScroll);
    }
  };
};
