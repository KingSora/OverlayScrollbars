import {
  createCache,
  WH,
  XY,
  equalXY,
  style,
  scrollSize,
  offsetSize,
  CacheValues,
  equalWH,
  scrollLeft,
  scrollTop,
  addClass,
  removeClass,
} from 'support';
import { createLifecycleUpdateFunction, LifecycleUpdateFunction } from 'lifecycles/lifecycleUpdateFunction';
import { LifecycleHub } from 'lifecycles/lifecycleHub';
import { getEnvironment } from 'environment';
import { OverflowBehavior } from 'options';
import { PlainObject } from 'typings';
import { classNameViewportScrollbarStyling } from 'classnames';

const overlaidScrollbarsHideOffset = 42;
const overlaidScrollbarsHideBorderStyle = `${overlaidScrollbarsHideOffset}px solid transparent`;
interface OverflowAmountCacheContext {
  _contentScrollSize: WH<number>;
  _viewportSize: WH<number>;
}

export const createOverflowLifecycle = (lifecycleHub: LifecycleHub): LifecycleUpdateFunction => {
  const { _host, _padding, _viewport, _content, _contentArrange } = lifecycleHub._structureSetup._targetObj;
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

  const setViewportOverflowStyle = (horizontal: boolean, amount: number, behavior: OverflowBehavior, styleObj: PlainObject) => {
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
    viewportStyleObj: PlainObject,
    contentStyleObj: PlainObject
  ) => {
    const { _nativeScrollbarSize, _nativeScrollbarIsOverlaid, _nativeScrollbarStyling } = getEnvironment();
    const { x: overlaidX, y: overlaidY } = _nativeScrollbarIsOverlaid;
    const scrollX = viewportStyleObj.overflowX === 'scroll';
    const scrollY = viewportStyleObj.overflowY === 'scroll';
    const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
    const horizontalBorderKey = directionIsRTL ? 'borderLeft' : 'borderRight';
    const scrollXY = scrollY && scrollX;
    const overlaidHideOffset = _content && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const scrollbarsHideOffset = {
      x: overlaidX ? overlaidHideOffset : _nativeScrollbarSize.x,
      y: overlaidY ? overlaidHideOffset : _nativeScrollbarSize.y,
    };

    if (!_nativeScrollbarStyling) {
      if (scrollX) {
        viewportStyleObj.marginBottom = `-${scrollbarsHideOffset.x}px`;

        contentStyleObj.borderBottom = overlaidX && overlaidHideOffset ? overlaidScrollbarsHideBorderStyle : '';
      }
      if (scrollY) {
        viewportStyleObj.maxWidth = `calc(100% + ${scrollbarsHideOffset.y}px)`;
        viewportStyleObj[horizontalMarginKey] = `-${scrollbarsHideOffset.y}px`;

        contentStyleObj[horizontalBorderKey] = overlaidY && overlaidHideOffset ? overlaidScrollbarsHideBorderStyle : '';
      }

      if (_contentArrange) {
        const condition = scrollXY && !showNativeOverlaidScrollbars;
        style(_contentArrange, {
          width: condition ? `${overlaidHideOffset + contentScrollSize.w}px` : '',
          height: condition ? `${overlaidHideOffset + contentScrollSize.h}px` : '',
        });
      }
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
        maxHeight: `${_host.clientHeight + (scrollX ? scrollbarsHideOffsetX : 0)}px`,
      });
    }

    scrollLeft(_viewport, offsetLeft);
    scrollTop(_viewport, offsetTop);
  };

  return createLifecycleUpdateFunction(lifecycleHub, (force, updateHints, checkOption) => {
    const { _directionIsRTL, _heightIntrinsic, _sizeChanged, _hostMutation, _contentMutation } = updateHints;
    const { _flexboxGlue, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();
    const { _value: showNativeOverlaidScrollbarsOption, _changed: showNativeOverlaidScrollbarsChanged } = checkOption<boolean>(
      'nativeScrollbarsOverlaid.show'
    );
    const adjustFlexboxGlue = !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged);
    const showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
    let overflowAmuntCache: CacheValues<XY<number>> = getCurrentOverflowAmountCache();
    let contentScrollSizeCache: CacheValues<WH<number>> = getCurrentContentScrollSizeCache();

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarStyling) {
      if (showNativeOverlaidScrollbars) {
        removeClass(_viewport, classNameViewportScrollbarStyling);
      } else {
        addClass(_viewport, classNameViewportScrollbarStyling);
      }
    }

    if (_sizeChanged || _contentMutation) {
      const viewportOffsetSize = offsetSize(_padding);
      const contentClientSize = offsetSize(_content || _viewport);
      const contentArrangeOffsetSize = offsetSize(_contentArrange);

      contentScrollSizeCache = updateContentScrollSizeCache(force);
      const { _value: contentScrollSize } = contentScrollSizeCache;
      overflowAmuntCache = updateOverflowAmountCache(force, {
        _contentScrollSize: {
          w: Math.max(contentScrollSize!.w, contentArrangeOffsetSize.w),
          h: Math.max(contentScrollSize!.h, contentArrangeOffsetSize.h),
        },
        _viewportSize: {
          w: viewportOffsetSize.w + Math.max(0, contentClientSize.w - contentScrollSize!.w),
          h: viewportOffsetSize.h + Math.max(0, contentClientSize.h - contentScrollSize!.h),
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
      contentScrollSizeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      adjustDirection ||
      adjustFlexboxGlue
    ) {
      const viewportStyle: PlainObject = {
        overflowY: '',
        overflowX: '',
        marginTop: '',
        marginRight: '',
        marginBottom: '',
        marginLeft: '',
        maxWidth: '',
      };
      const contentStyle: PlainObject = {
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

      style(_viewport, viewportStyle);
      style(_content, contentStyle);
    }
  });
};
