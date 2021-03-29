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
} from 'support';
import { LifecycleHub, Lifecycle } from 'lifecycles/lifecycleHub';
import { getEnvironment } from 'environment';
import { OverflowBehavior } from 'options';
import { StyleObject } from 'typings';
import { classNameViewportScrollbarStyling } from 'classnames';

const overlaidScrollbarsHideOffset = 42;
const overlaidScrollbarsHideBorderStyle = `${overlaidScrollbarsHideOffset}px solid transparent`;
interface OverflowAmountCacheContext {
  _contentScrollSize: WH<number>;
  _viewportSize: WH<number>;
}

export const createOverflowLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _structureSetup, _getPaddingStyle } = lifecycleHub;
  const { _host, _padding, _viewport, _content, _contentArrange } = _structureSetup._targetObj;
  const { _update: updateContentScrollSizeCache, _current: getCurrentContentScrollSizeCache } = createCache<WH<number>>(
    () => scrollSize(_content || _viewport),
    { _equal: equalWH }
  );
  const { _update: updateOverflowAmountCache, _current: getCurrentOverflowAmountCache } = createCache<XY<number>, OverflowAmountCacheContext>(
    (ctx) => ({
      x: Math.max(0, Math.round((ctx._contentScrollSize.w - ctx._viewportSize.w) * 100) / 100),
      y: Math.max(0, Math.round((ctx._contentScrollSize.h - ctx._viewportSize.h) * 100) / 100),
    }),
    { _equal: equalXY }
  );

  const setViewportOverflowStyle = (horizontal: boolean, amount: number, behavior: OverflowBehavior, styleObj: StyleObject) => {
    const overflowKey = horizontal ? 'overflowX' : 'overflowY';
    //const scrollMaxKey = horizontal ? 'scrollLeftMax' : 'scrollTopMax';
    const behaviorIsScroll = behavior === 'scroll';
    const behaviorIsVisibleScroll = behavior === 'visible-scroll';
    const hideOverflow = behaviorIsScroll || behavior === 'hidden';
    //const scrollMax = _viewport[scrollMaxKey];
    //const scrollMaxOverflow = isNumber(scrollMax) ? scrollMax > 0 : true;
    const applyStyle = amount > 0 && hideOverflow;

    if (applyStyle) {
      styleObj[overflowKey] = behavior;
    }

    return {
      _visible: !applyStyle,
      _behavior: behaviorIsVisibleScroll ? 'scroll' : 'hidden',
    };
  };

  const hideNativeScrollbars = (
    contentScrollSize: WH<number>,
    showNativeOverlaidScrollbars: boolean,
    directionIsRTL: boolean,
    viewportStyleObj: StyleObject,
    contentStyleObj: StyleObject
  ) => {
    const { _nativeScrollbarSize, _nativeScrollbarIsOverlaid, _nativeScrollbarStyling } = getEnvironment();
    const { x: overlaidX, y: overlaidY } = _nativeScrollbarIsOverlaid;
    const paddingStyle = _getPaddingStyle();
    const scrollX = viewportStyleObj.overflowX === 'scroll';
    const scrollY = viewportStyleObj.overflowY === 'scroll';
    const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
    const horizontalBorderKey = directionIsRTL ? 'borderLeft' : 'borderRight';
    const horizontalPaddingValue = paddingStyle[horizontalMarginKey] as number;
    const overlaidHideOffset = _content && !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const scrollbarsHideOffset = {
      x: scrollX && !_nativeScrollbarStyling ? (overlaidX ? overlaidHideOffset : _nativeScrollbarSize.x) : 0,
      y: scrollY && !_nativeScrollbarStyling ? (overlaidY ? overlaidHideOffset : _nativeScrollbarSize.y) : 0,
    };

    // vertical
    viewportStyleObj.marginBottom = -scrollbarsHideOffset.x + (paddingStyle.marginBottom as number);
    contentStyleObj.borderBottom = scrollX && overlaidX && overlaidHideOffset ? overlaidScrollbarsHideBorderStyle : '';

    // horizontal
    viewportStyleObj.maxWidth = `calc(100% + ${scrollbarsHideOffset.y + horizontalPaddingValue * -1}px)`;
    viewportStyleObj[horizontalMarginKey] = -scrollbarsHideOffset.y + horizontalPaddingValue;
    contentStyleObj[horizontalBorderKey] = scrollY && overlaidY && overlaidHideOffset ? overlaidScrollbarsHideBorderStyle : '';

    // adjust content arrange (content arrange doesn't exist if its not needed)
    style(_contentArrange, {
      width: scrollY && !showNativeOverlaidScrollbars ? overlaidHideOffset + contentScrollSize.w : '',
      height: scrollX && !showNativeOverlaidScrollbars ? overlaidHideOffset + contentScrollSize.h : '',
    });

    // hide overflowing scrollbars if there are any
    if (!_nativeScrollbarStyling) {
      style(_padding, {
        overflow: scrollX || scrollY ? 'hidden' : 'visible',
      });
    }

    return {
      _scrollbarsHideOffset: scrollbarsHideOffset,
      _scroll: {
        x: scrollX,
        y: scrollY,
      },
    };
  };

  const setFlexboxGlueStyle = (heightIntrinsic: boolean, scrollX: boolean, scrollbarsHideOffsetX: number) => {
    const offsetLeft = scrollLeft(_viewport);
    const offsetTop = scrollTop(_viewport);

    style(_viewport, {
      maxHeight: '',
    });

    if (heightIntrinsic) {
      style(_viewport, {
        maxHeight: _host.clientHeight + (scrollX ? scrollbarsHideOffsetX : 0),
      });
    }

    scrollLeft(_viewport, offsetLeft);
    scrollTop(_viewport, offsetTop);
  };

  return (updateHints, checkOption, force) => {
    const { _directionIsRTL, _heightIntrinsic, _sizeChanged, _hostMutation, _contentMutation, _paddingStyleChanged } = updateHints;
    const { _flexboxGlue, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();
    const { _value: showNativeOverlaidScrollbarsOption, _changed: showNativeOverlaidScrollbarsChanged } = checkOption<boolean>(
      'nativeScrollbarsOverlaid.show'
    );
    const adjustFlexboxGlue = !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged);
    const showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
    let overflowAmuntCache: CacheValues<XY<number>> = getCurrentOverflowAmountCache(force);
    let contentScrollSizeCache: CacheValues<WH<number>> = getCurrentContentScrollSizeCache(force);

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarStyling) {
      if (showNativeOverlaidScrollbars) {
        removeClass(_viewport, classNameViewportScrollbarStyling);
      } else {
        addClass(_viewport, classNameViewportScrollbarStyling);
      }
    }

    if (_sizeChanged || _contentMutation) {
      const viewportSize = clientSize(_viewport); // needs to be client Size because possible scrollbar offset
      const viewportScrollSize = scrollSize(_viewport);
      const contentClientSize = clientSize(_content || _viewport); // needs to be client Size because applied border for content arrange on content
      const contentArrangeOffsetSize = clientSize(_contentArrange); // can be offset size aswell

      contentScrollSizeCache = updateContentScrollSizeCache(force);
      const { _value: contentScrollSize } = contentScrollSizeCache;
      overflowAmuntCache = updateOverflowAmountCache(force, {
        _contentScrollSize: {
          w: Math.max(contentScrollSize!.w, viewportScrollSize.w, contentArrangeOffsetSize.w),
          h: Math.max(contentScrollSize!.h, viewportScrollSize.h, contentArrangeOffsetSize.h),
        },
        _viewportSize: {
          w: viewportSize.w + Math.max(0, contentClientSize.w - contentScrollSize!.w),
          h: viewportSize.h + Math.max(0, contentClientSize.h - contentScrollSize!.h),
        },
      });
    }

    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: contentScrollSize, _changed: contentScrollSizeChanged } = contentScrollSizeCache;
    const { _value: overflowAmount, _changed: overflowAmountChanged } = overflowAmuntCache;
    const { _value: overflow, _changed: overflowChanged } = checkOption<{
      x: OverflowBehavior;
      y: OverflowBehavior;
    }>('overflow');
    const adjustDirection = directionChanged && !_nativeScrollbarStyling;

    if (
      _paddingStyleChanged ||
      contentScrollSizeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      adjustDirection ||
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

      const { _visible: xVisible, _behavior: xVisibleBehavior } = setViewportOverflowStyle(true, overflowAmount!.x, overflow.x, viewportStyle);
      const { _visible: yVisible, _behavior: yVisibleBehavior } = setViewportOverflowStyle(false, overflowAmount!.y, overflow.y, viewportStyle);

      if (xVisible && !yVisible) {
        viewportStyle.overflowX = xVisibleBehavior;
      }
      if (yVisible && !xVisible) {
        viewportStyle.overflowY = yVisibleBehavior;
      }

      const { _scrollbarsHideOffset, _scroll } = hideNativeScrollbars(
        contentScrollSize!,
        showNativeOverlaidScrollbars,
        directionIsRTL!,
        viewportStyle,
        contentStyle
      );

      if (adjustFlexboxGlue) {
        setFlexboxGlueStyle(!!_heightIntrinsic._value, _scroll.x, _scrollbarsHideOffset.x);
      }

      // TODO: enlargen viewport if div too small for firefox scrollbar hiding behavior
      // TODO: Test without content
      // TODO: Test without padding
      // TODO: hide host || padding overflow if scroll x or y
      // TODO: fix false overflow bug (fractal scroll size)
      // TODO: add trinsic lifecycle
      // TODO: remove lifecycleHub get set padding if not needed

      style(_viewport, viewportStyle);
      style(_content, contentStyle);
    }
  };
};
