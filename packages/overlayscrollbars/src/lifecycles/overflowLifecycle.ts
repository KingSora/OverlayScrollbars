import { createCache, WH, XY, equalXY, style, scrollSize, offsetSize, CacheValues, equalWH, scrollLeft, scrollTop } from 'support';
import { createLifecycleUpdateFunction, LifecycleUpdateFunction } from 'lifecycles/lifecycleUpdateFunction';
import { LifecycleHub } from 'lifecycles/lifecycleHub';
import { getEnvironment } from 'environment';
import { OverflowBehavior } from 'options';
import { PlainObject } from 'typings';

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
    adjustFlexboxGlue: boolean,
    directionIsRTL: boolean,
    heightIntrinsic: boolean,
    viewportStyleObj: PlainObject,
    contentStyleObj: PlainObject
  ) => {
    const { _nativeScrollbarSize, _nativeScrollbarIsOverlaid, _nativeScrollbarStyling } = getEnvironment();
    const scrollX = viewportStyleObj.overflowX === 'scroll';
    const scrollY = viewportStyleObj.overflowY === 'scroll';
    const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
    const horizontalBorderKey = directionIsRTL ? 'borderLeft' : 'borderRight';
    const scrollXY = scrollY && scrollX;
    const hideOffset = _content ? overlaidScrollbarsHideOffset : 0;
    const offset = {
      x: _nativeScrollbarIsOverlaid.x ? hideOffset : _nativeScrollbarSize.x,
      y: _nativeScrollbarIsOverlaid.y ? hideOffset : _nativeScrollbarSize.y,
    };

    if (!_nativeScrollbarStyling) {
      if (scrollX) {
        viewportStyleObj.marginBottom = `-${offset.x}px`;

        if (_nativeScrollbarIsOverlaid.x && hideOffset) {
          contentStyleObj.borderBottom = overlaidScrollbarsHideBorderStyle;
        }
      }
      if (scrollY) {
        viewportStyleObj.maxWidth = `calc(100% + ${offset.y}px)`;
        viewportStyleObj[horizontalMarginKey] = `-${offset.y}px`;

        if (_nativeScrollbarIsOverlaid.y && hideOffset) {
          contentStyleObj[horizontalBorderKey] = overlaidScrollbarsHideBorderStyle;
        }
      }

      if (hideOffset && (offset.x || offset.y)) {
        style(_contentArrange, {
          width: scrollXY ? `${hideOffset + contentScrollSize.w}px` : '',
          height: scrollXY ? `${hideOffset + contentScrollSize.h}px` : '',
        });
      }
    }

    if (adjustFlexboxGlue) {
      const offsetLeft = scrollLeft(_viewport);
      const offsetTop = scrollTop(_viewport);

      style(_viewport, {
        maxHeight: '',
      });

      if (heightIntrinsic) {
        style(_viewport, {
          maxHeight: `${_host.clientHeight + (scrollX ? offset.x : 0)}px`,
        });
      }

      scrollLeft(_viewport, offsetLeft);
      scrollTop(_viewport, offsetTop);
    }
  };

  return createLifecycleUpdateFunction(lifecycleHub, (force, updateHints, checkOption) => {
    const { _directionIsRTL, _heightIntrinsic, _sizeChanged, _hostMutation, _contentMutation } = updateHints;
    const { _flexboxGlue, _nativeScrollbarStyling } = getEnvironment();
    const adjustFlexboxGlue = !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation);
    let overflowAmuntCache: CacheValues<XY<number>> = getCurrentOverflowAmountCache();
    let contentScrollSizeCache: CacheValues<WH<number>> = getCurrentContentScrollSizeCache();

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

    if (contentScrollSizeChanged || overflowAmountChanged || overflowChanged || adjustDirection || adjustFlexboxGlue) {
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

      hideNativeScrollbars(contentScrollSize!, adjustFlexboxGlue, directionIsRTL!, !!_heightIntrinsic._value, viewportStyle, contentStyle);

      // TODO: enlargen viewport if div too small for firefox scrollbar hiding behavior
      // TODO: Test without content
      // TODO: Test without padding

      style(_viewport, viewportStyle);
      style(_content, contentStyle);
    }
  });
};
