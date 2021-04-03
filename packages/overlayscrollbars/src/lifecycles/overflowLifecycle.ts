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
  _overflowScroll: XY<boolean>;
}

interface OverflowOption {
  x: OverflowBehavior;
  y: OverflowBehavior;
}

interface ViewportArrangeCustomCssProps {
  '--viewport-arrange-width': string;
  '--viewport-arrange-height': string;
}

const overlaidScrollbarsHideOffset = 42;

export const createOverflowLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _structureSetup, _doViewportArrange, _getViewportPaddingStyle, _getPaddingInfo } = lifecycleHub;
  const { _host, _padding, _viewport, _viewportArrange } = _structureSetup._targetObj;
  const { _update: updateContentScrollSizeCache, _current: getCurrentContentScrollSizeCache } = createCache<
    WH<number>,
    ContentScrollSizeCacheContext
  >(
    (ctx) => {
      const { _viewportOffsetSize, _viewportScrollSize, _viewportRect } = ctx;
      return fixScrollSizeRounding(_viewportScrollSize, _viewportOffsetSize, _viewportRect);
    },
    { _equal: equalWH }
  );
  const { _update: updateOverflowAmountCache, _current: getCurrentOverflowAmountCache } = createCache<XY<number>, OverflowAmountCacheContext>(
    (ctx) => ({
      x: Math.max(0, ctx._contentScrollSize.w - ctx._viewportSize.w),
      y: Math.max(0, ctx._contentScrollSize.h - ctx._viewportSize.h),
    }),
    { _equal: equalXY, _initialValue: { x: 0, y: 0 } }
  );

  const fixScrollSizeRounding = (scrollSize: WH<number>, viewportOffsetSize: WH<number>, viewportRect: DOMRect): WH<number> => ({
    w: scrollSize.w - Math.round(Math.max(0, viewportRect.width - viewportOffsetSize.w)),
    h: scrollSize.h - Math.round(Math.max(0, viewportRect.height - viewportOffsetSize.h)),
  });

  const fixFlexboxGlue = (viewportOverflowState: ViewportOverflowState, heightIntrinsic: boolean) => {
    style(_viewport, {
      maxHeight: '',
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
        maxHeight: clientSizeWithoutRounding + (_overflowScroll.x ? _scrollbarsHideOffset.x : 0) - paddingAbsoluteVertical,
      });
    }
  };

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
      _scrollbarsHideOffset: scrollbarsHideOffset,
    };
  };

  const setViewportOverflowState = (
    showNativeOverlaidScrollbars: boolean,
    overflowAmount: XY<number>,
    overflow: OverflowOption,
    viewportStyleObj: StyleObject
  ): ViewportOverflowState => {
    const setPartialStylePerAxis = (horizontal: boolean, overflowAmount: number, behavior: OverflowBehavior, styleObj: StyleObject) => {
      const overflowKey = horizontal ? 'overflowX' : 'overflowY';
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

  const setContentArrange = (
    viewportOverflowState: ViewportOverflowState,
    contentScrollSize: WH<number>,
    directionIsRTL: boolean,
    viewportStyleObj?: StyleObject
  ) => {
    const { _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();
    if ((_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y) && !_nativeScrollbarStyling) {
      const { _scrollbarsHideOffset } = viewportOverflowState;
      const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
      const viewportPaddingStyle = _getViewportPaddingStyle();
      const viewportHorizontalPaddingKey = directionIsRTL ? 'paddingLeft' : 'paddingRight';
      const viewportHorizontalPaddingValue = viewportPaddingStyle[viewportHorizontalPaddingKey] as number;
      const viewportVerticalPaddingValue = viewportPaddingStyle.paddingBottom as number;
      const viewportArrangeHorizontalPaddingKey = directionIsRTL ? 'paddingRight' : 'paddingLeft';
      const viewportArrangeHorizontalPaddingValue = viewportPaddingStyle[viewportArrangeHorizontalPaddingKey] as number;
      const viewportArrangeVerticalPaddingValue = viewportPaddingStyle.paddingTop as number;
      const styleObj: StyleObject = viewportStyleObj || {};
      const arrangeSize = {
        w: hideOffsetY ? `${hideOffsetY + contentScrollSize.w - viewportArrangeHorizontalPaddingValue}px` : '',
        h: hideOffsetX ? `${hideOffsetX + contentScrollSize.h - viewportArrangeVerticalPaddingValue}px` : '',
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
        style<ViewportArrangeCustomCssProps>(_viewport, {
          '--viewport-arrange-width': arrangeSize.w,
          '--viewport-arrange-height': arrangeSize.h,
        });
      }

      styleObj[viewportHorizontalPaddingKey] = viewportHorizontalPaddingValue + hideOffsetY;
      styleObj.paddingBottom = viewportVerticalPaddingValue + hideOffsetX;

      if (!viewportStyleObj) {
        style(_viewport, styleObj);
      }
    }
  };

  const hideNativeScrollbars = (viewportOverflowState: ViewportOverflowState, directionIsRTL: boolean, viewportStyleObj: StyleObject) => {
    const { _nativeScrollbarStyling } = getEnvironment();
    const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
    const { x: scrollX, y: scrollY } = _overflowScroll;
    const paddingStyle = _getViewportPaddingStyle();
    const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
    const horizontalPaddingValue = paddingStyle[horizontalMarginKey] as number;
    const verticalPaddingValue = paddingStyle.marginBottom as number;

    // horizontal
    viewportStyleObj.maxWidth = `calc(100% + ${_scrollbarsHideOffset.y + horizontalPaddingValue * -1}px)`;
    viewportStyleObj[horizontalMarginKey] = -_scrollbarsHideOffset.y + horizontalPaddingValue;

    // vertical
    viewportStyleObj.marginBottom = -_scrollbarsHideOffset.x + verticalPaddingValue;

    // hide overflowing scrollbars if there are any
    if (!_nativeScrollbarStyling) {
      style(_padding, {
        overflow: scrollX || scrollY ? 'hidden' : 'visible',
      });
    }
  };

  const undoOverlaidScrollbarsHiding = () => {
    const paddingStyle = _getViewportPaddingStyle();
    const viewportStyle = {
      marginTop: '',
      marginRight: '',
      marginBottom: '',
      marginLeft: '',
      ...paddingStyle,
    };
    const prevStyle = style(_viewport, keys(viewportStyle));
    removeClass(_viewport, classNameViewportArrange);
    style(_viewport, viewportStyle);

    return () => {
      style(_viewport, prevStyle);
      addClass(_viewport, classNameViewportArrange);
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
    const viewportArrange = _doViewportArrange && !showNativeOverlaidScrollbars;
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

    if (_sizeChanged || _paddingStyleChanged || _contentMutation || directionChanged) {
      const redoOverlaidScrollbarsHiding = viewportArrange ? undoOverlaidScrollbarsHiding() : noop;
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

      redoOverlaidScrollbarsHiding();

      // re measure is only required if we rely on content arrange to hide native scrollbars (no native scrollbar styling and overlaid scrollbars)
      const reMeasureRequired = viewportArrange && contentScrollSizeChanged && !showNativeOverlaidScrollbars;

      if (reMeasureRequired) {
        setContentArrange(
          preMeasureViewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars),
          contentScrollSize!,
          directionIsRTL!
        );

        viewportClientSize = clientSize(_viewport);
        viewportScrollSize = fixScrollSizeRounding(scrollSize(_viewport), offsetSize(_viewport), getBoundingClientRect(_viewport));
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
        overflowY: '',
        overflowX: '',
        marginTop: '',
        marginRight: '',
        marginBottom: '',
        marginLeft: '',
        maxWidth: '',
      };

      const viewportOverflowState = setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount!, overflow, viewportStyle);
      hideNativeScrollbars(viewportOverflowState, directionIsRTL!, viewportStyle);

      if (_doViewportArrange) {
        setContentArrange(viewportOverflowState, contentScrollSize!, directionIsRTL!, viewportStyle);
      }

      if (adjustFlexboxGlue) {
        fixFlexboxGlue(viewportOverflowState, !!heightIntrinsic);
      }

      // TODO: enlargen viewport if div too small for firefox scrollbar hiding behavior
      // TODO: Test without content
      // TODO: Test without padding
      // TODO: hide host || padding overflow if scroll x or y
      // TODO: add trinsic lifecycle
      // TODO: IE max-width fix not always working
      // TODO: remove lifecycleHub get set padding if not needed

      style(_viewport, viewportStyle);
    }
  };
};
