import {
  createCache,
  WH,
  XY,
  equalXY,
  style,
  scrollSize,
  CacheValues,
  equalWH,
  scrollLeft,
  scrollTop,
  addClass,
  removeClass,
  clientSize,
  offsetSize,
  getBoundingClientRect,
  topRightBottomLeft,
} from 'support';
import { LifecycleHub, Lifecycle } from 'lifecycles/lifecycleHub';
import { getEnvironment } from 'environment';
import { OverflowBehavior } from 'options';
import { StyleObject } from 'typings';
import { classNameViewportScrollbarStyling } from 'classnames';

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

const overlaidScrollbarsHideOffset = 42;
const overlaidScrollbarsHideBorderStyle = `${overlaidScrollbarsHideOffset}px solid transparent`;

export const createOverflowLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _structureSetup, _getPaddingStyle } = lifecycleHub;
  const { _host, _padding, _viewport, _content, _contentArrange } = _structureSetup._targetObj;
  const { _update: updateContentScrollSizeCache, _current: getCurrentContentScrollSizeCache } = createCache<
    WH<number>,
    ContentScrollSizeCacheContext
  >(
    (ctx) => {
      const { _viewportOffsetSize, _viewportScrollSize, _viewportRect } = ctx;
      const contentViewportScrollSize = _content ? scrollSize(_content) : _viewportScrollSize;
      return fixScrollSizeRounding(contentViewportScrollSize, _viewportOffsetSize, _viewportRect);
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
    w: scrollSize.w - Math.ceil(Math.max(0, viewportRect.width - viewportOffsetSize.w)),
    h: scrollSize.h - Math.ceil(Math.max(0, viewportRect.height - viewportOffsetSize.h)),
  });

  const fixFlexboxGlue = (viewportOverflowState: ViewportOverflowState, heightIntrinsic: boolean) => {
    const offsetLeft = scrollLeft(_viewport);
    const offsetTop = scrollTop(_viewport);

    style(_viewport, {
      maxHeight: '',
    });

    if (heightIntrinsic) {
      const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
      const hostBCR = getBoundingClientRect(_host);

      // TODO: change to offset size - client size calculation.
      const border = topRightBottomLeft(_host, 'border', 'width');

      style(_viewport, {
        maxHeight: hostBCR.height - (border.t + border.b) + (_overflowScroll.x ? _scrollbarsHideOffset.x : 0),
      });
    }

    scrollLeft(_viewport, offsetLeft);
    scrollTop(_viewport, offsetTop);
  };

  const getViewportOverflowState = (showNativeOverlaidScrollbars: boolean, viewportStyleObj?: StyleObject): ViewportOverflowState => {
    const { _nativeScrollbarSize, _nativeScrollbarIsOverlaid, _nativeScrollbarStyling } = getEnvironment();
    const { x: overlaidX, y: overlaidY } = _nativeScrollbarIsOverlaid;
    const determineOverflow = !viewportStyleObj;
    const arrangeHideOffset = _content && !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const scroll = {
      x: (determineOverflow ? style(_viewport, 'overflow-x') : viewportStyleObj!.overflowX) === 'scroll',
      y: (determineOverflow ? style(_viewport, 'overflow-y') : viewportStyleObj!.overflowY) === 'scroll',
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
    contentStyleObj?: StyleObject
  ) => {
    const { _scrollbarsHideOffset } = viewportOverflowState;
    const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
    const horizontalBorderKey = directionIsRTL ? 'borderLeft' : 'borderRight';

    if (_contentArrange && contentStyleObj) {
      // horizontal
      contentStyleObj[horizontalBorderKey] = hideOffsetY ? overlaidScrollbarsHideBorderStyle : '';

      // vertical
      contentStyleObj.borderBottom = hideOffsetX ? overlaidScrollbarsHideBorderStyle : '';
    }

    // adjust content arrange (content arrange doesn't exist if its not needed)
    style(_contentArrange, {
      width: hideOffsetY ? hideOffsetY + contentScrollSize.w : '',
      height: hideOffsetX ? hideOffsetX + contentScrollSize.h : '',
    });
  };

  const hideNativeScrollbars = (viewportOverflowState: ViewportOverflowState, directionIsRTL: boolean, viewportStyleObj: StyleObject) => {
    const { _nativeScrollbarStyling } = getEnvironment();
    const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
    const { x: scrollX, y: scrollY } = _overflowScroll;
    const paddingStyle = _getPaddingStyle();
    const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
    const horizontalPaddingValue = paddingStyle[horizontalMarginKey] as number;

    // horizontal
    viewportStyleObj.maxWidth = `calc(100% + ${_scrollbarsHideOffset.y + horizontalPaddingValue * -1}px)`;
    viewportStyleObj[horizontalMarginKey] = -_scrollbarsHideOffset.y + horizontalPaddingValue;

    // vertical
    viewportStyleObj.marginBottom = -_scrollbarsHideOffset.x + (paddingStyle.marginBottom as number);

    // hide overflowing scrollbars if there are any
    if (!_nativeScrollbarStyling) {
      style(_padding, {
        overflow: scrollX || scrollY ? 'hidden' : 'visible',
      });
    }
  };

  return (updateHints, checkOption, force) => {
    const { _directionIsRTL, _heightIntrinsic, _sizeChanged, _hostMutation, _contentMutation, _paddingStyleChanged } = updateHints;
    const { _flexboxGlue, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();
    const { _value: heightIntrinsic, _changed: heightIntrinsicChanged } = _heightIntrinsic;
    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: showNativeOverlaidScrollbarsOption, _changed: showNativeOverlaidScrollbarsChanged } = checkOption<boolean>(
      'nativeScrollbarsOverlaid.show'
    );
    const adjustFlexboxGlue =
      !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged || heightIntrinsicChanged);
    const showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
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

    if (_sizeChanged || _contentMutation) {
      const viewportRect = getBoundingClientRect(_viewport);
      const viewportOffsetSize = offsetSize(_viewport);
      const contentClientSize = clientSize(_content || _viewport); // needs to be client Size because applied border for content arrange on content
      let viewportScrollSize = fixScrollSizeRounding(scrollSize(_viewport), viewportOffsetSize, viewportRect);
      let viewportClientSize = clientSize(_viewport);

      const { _value: contentScrollSize, _changed: contentScrollSizeChanged } = (contentScrollSizeCache = updateContentScrollSizeCache(force, {
        _viewportRect: viewportRect,
        _viewportOffsetSize: viewportOffsetSize,
        _viewportScrollSize: viewportScrollSize,
      }));
      // re measure is only required if we rely on content arrange to hide native scrollbars (no native scrollbar styling and overlaid scrollbars)
      const reMeasureRequired = contentScrollSizeChanged && !showNativeOverlaidScrollbars && _contentArrange;

      if (reMeasureRequired) {
        setContentArrange(
          preMeasureViewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars),
          contentScrollSize!,
          directionIsRTL!
        );

        viewportClientSize = clientSize(_viewport);
        viewportScrollSize = fixScrollSizeRounding(scrollSize(_viewport), offsetSize(_viewport), getBoundingClientRect(_viewport));
      }

      const contentArrangeOffsetSize = clientSize(_contentArrange);
      overflowAmuntCache = updateOverflowAmountCache(force, {
        _contentScrollSize: {
          w: Math.max(contentScrollSize!.w, viewportScrollSize.w, contentArrangeOffsetSize.w),
          h: Math.max(contentScrollSize!.h, viewportScrollSize.h, contentArrangeOffsetSize.h),
        },
        _viewportSize: {
          w: viewportClientSize.w + Math.max(0, contentClientSize.w - contentScrollSize!.w),
          h: viewportClientSize.h + Math.max(0, contentClientSize.h - contentScrollSize!.h),
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
      const contentStyle: StyleObject = {
        borderTop: '',
        borderRight: '',
        borderBottom: '',
        borderLeft: '',
      };

      const viewportOverflowState = setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount!, overflow, viewportStyle);
      hideNativeScrollbars(viewportOverflowState, directionIsRTL!, viewportStyle);
      setContentArrange(viewportOverflowState, contentScrollSize!, directionIsRTL!, contentStyle);

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
      style(_content, contentStyle);
    }
  };
};
