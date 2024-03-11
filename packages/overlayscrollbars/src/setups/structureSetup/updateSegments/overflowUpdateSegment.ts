import {
  createCache,
  scrollSize,
  fractionalSize,
  equalWH,
  clientSize,
  equalXY,
  assignDeep,
  bind,
  wnd,
  mathMax,
  windowSize,
  strHidden,
  strOverflowX,
  strOverflowY,
  setStyles,
  addRemoveAttrClass,
  setAttrs,
} from '~/support';
import { getEnvironment } from '~/environment';
import {
  dataAttributeHost,
  dataAttributeHostOverflowX,
  dataAttributeHostOverflowY,
  dataValueHostOverflowVisible,
  dataValueViewportScrollbarHidden,
  dataValueViewportOverflowVisible,
  dataAttributeViewport,
  dataAttributePadding,
  dataValuePaddingOverflowVisible,
} from '~/classnames';
import { getStaticPluginModuleInstance, scrollbarsHidingPluginName } from '~/plugins';
import type { WH, XY } from '~/support';
import type { ScrollbarsHidingPlugin } from '~/plugins/scrollbarsHidingPlugin';
import type { StyleObject, OverflowStyle } from '~/typings';
import type { CreateStructureUpdateSegment } from '../structureSetup';
import type { ViewportOverflowState } from '../structureSetup.utils';
import {
  getShowNativeOverlaidScrollbars,
  getViewportOverflowState,
  overflowIsVisible,
  setViewportOverflowState,
} from '../structureSetup.utils';

/**
 * Lifecycle with the responsibility to set the correct overflow and scrollbar hiding styles of the viewport element.
 * @param structureUpdateHub
 * @returns
 */
export const createOverflowUpdateSegment: CreateStructureUpdateSegment = (
  structureSetupElements,
  structureSetupState
) => {
  const env = getEnvironment();
  const {
    _host,
    _padding,
    _viewport,
    _viewportIsTarget,
    _viewportAddRemoveClass,
    _isBody,
    _windowElm,
  } = structureSetupElements;
  const { _nativeScrollbarsHiding } = env;
  const viewportIsTargetBody = _isBody && _viewportIsTarget;
  const max0 = bind(mathMax, 0);

  const whCacheOptions = {
    _equal: equalWH,
    _initialValue: { w: 0, h: 0 },
  };
  const xyCacheOptions = {
    _equal: equalXY,
    _initialValue: { x: strHidden, y: strHidden } as XY<OverflowStyle>,
  };
  const getOverflowAmount = (viewportScrollSize: WH<number>, viewportClientSize: WH<number>) => {
    const tollerance = wnd.devicePixelRatio % 1 !== 0 ? 1 : 0;
    const amount = {
      w: max0(viewportScrollSize.w - viewportClientSize.w),
      h: max0(viewportScrollSize.h - viewportClientSize.h),
    };

    return {
      w: amount.w > tollerance ? amount.w : 0,
      h: amount.h > tollerance ? amount.h : 0,
    };
  };

  const [updateSizeFraction, getCurrentSizeFraction] = createCache<WH<number>>(
    whCacheOptions,
    bind(fractionalSize, _viewport)
  );
  const [updateViewportScrollSizeCache, getCurrentViewportScrollSizeCache] = createCache<
    WH<number>
  >(whCacheOptions, bind(scrollSize, _viewport));
  const [updateOverflowAmountCache, getCurrentOverflowAmountCache] =
    createCache<WH<number>>(whCacheOptions);
  const [updateOverflowEdge, getCurrentOverflowEdgeCache] = createCache<WH<number>>(whCacheOptions);
  const [updateOverflowStyleCache] = createCache<XY<OverflowStyle>>(xyCacheOptions);

  const scrollbarsHidingPlugin = getStaticPluginModuleInstance<typeof ScrollbarsHidingPlugin>(
    scrollbarsHidingPluginName
  );

  return (
    { _checkOption, _observersUpdateHints, _observersState, _force },
    { _paddingStyleChanged }
  ) => {
    const { _sizeChanged, _contentMutation, _directionChanged, _scrollbarSizeChanged } =
      _observersUpdateHints || {};
    const scrollbarsHidingPluginViewportArrangement =
      scrollbarsHidingPlugin &&
      scrollbarsHidingPlugin._viewportArrangement(
        structureSetupElements,
        structureSetupState,
        _observersState,
        env,
        _checkOption
      );

    const { _arrangeViewport, _undoViewportArrange, _hideNativeScrollbars } =
      scrollbarsHidingPluginViewportArrangement || {};

    const [showNativeOverlaidScrollbars, showNativeOverlaidScrollbarsChanged] =
      getShowNativeOverlaidScrollbars(_checkOption, env);
    const [overflow, overflowChanged] = _checkOption('overflow');

    const adjustViewportArrange =
      _sizeChanged ||
      _paddingStyleChanged ||
      _contentMutation ||
      _directionChanged ||
      _scrollbarSizeChanged ||
      showNativeOverlaidScrollbarsChanged;
    const overflowXVisible = overflowIsVisible(overflow.x);
    const overflowYVisible = overflowIsVisible(overflow.y);
    const overflowVisible = overflowXVisible || overflowYVisible;

    let sizeFractionCache = getCurrentSizeFraction(_force);
    let viewportScrollSizeCache = getCurrentViewportScrollSizeCache(_force);
    let overflowAmuntCache = getCurrentOverflowAmountCache(_force);
    let overflowEdgeCache = getCurrentOverflowEdgeCache(_force);

    let preMeasureViewportOverflowState: ViewportOverflowState | undefined;

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarsHiding) {
      _viewportAddRemoveClass(dataValueViewportScrollbarHidden, !showNativeOverlaidScrollbars);
    }

    if (adjustViewportArrange) {
      if (overflowVisible) {
        _viewportAddRemoveClass(dataValueViewportOverflowVisible, false);
      }

      const [redoViewportArrange, undoViewportArrangeOverflowState] = _undoViewportArrange
        ? _undoViewportArrange(preMeasureViewportOverflowState)
        : [];

      const [sizeFraction, sizeFractionChanged] = (sizeFractionCache = updateSizeFraction(_force));
      const [viewportScrollSize, viewportScrollSizeChanged] = (viewportScrollSizeCache =
        updateViewportScrollSizeCache(_force));
      const viewportClientSize = clientSize(_viewport);
      const arrangedViewportScrollSize = viewportScrollSize;
      const arrangedViewportClientSize = viewportClientSize;

      redoViewportArrange && redoViewportArrange();

      // if re measure is required (only required if content arrange strategy is used)
      if (
        (viewportScrollSizeChanged || sizeFractionChanged || showNativeOverlaidScrollbarsChanged) &&
        undoViewportArrangeOverflowState &&
        !showNativeOverlaidScrollbars &&
        _arrangeViewport &&
        _arrangeViewport(undoViewportArrangeOverflowState, viewportScrollSize, sizeFraction)
      ) {
        // arrangedViewportClientSize = clientSize(_viewport);
        // arrangedViewportScrollSize = scrollSize(_viewport);
      }

      const windowInnerSize = windowSize(_windowElm);
      const overflowAmountScrollSize = {
        w: max0(mathMax(viewportScrollSize.w, arrangedViewportScrollSize.w) + sizeFraction.w),
        h: max0(mathMax(viewportScrollSize.h, arrangedViewportScrollSize.h) + sizeFraction.h),
      };

      const overflowAmountClientSize = {
        w: max0(
          (viewportIsTargetBody
            ? windowInnerSize.w
            : arrangedViewportClientSize.w + max0(viewportClientSize.w - viewportScrollSize.w)) +
            sizeFraction.w
        ),
        h: max0(
          (viewportIsTargetBody
            ? windowInnerSize.h
            : arrangedViewportClientSize.h + max0(viewportClientSize.h - viewportScrollSize.h)) +
            sizeFraction.h
        ),
      };

      overflowEdgeCache = updateOverflowEdge(overflowAmountClientSize);
      overflowAmuntCache = updateOverflowAmountCache(
        getOverflowAmount(overflowAmountScrollSize, overflowAmountClientSize),
        _force
      );
    }

    const [overflowEdge, overflowEdgeChanged] = overflowEdgeCache;
    const [overflowAmount, overflowAmountChanged] = overflowAmuntCache;
    const [viewportScrollSize, viewportScrollSizeChanged] = viewportScrollSizeCache;
    const [sizeFraction, sizeFractionChanged] = sizeFractionCache;
    const hasOverflow = {
      x: overflowAmount.w > 0,
      y: overflowAmount.h > 0,
    };
    const removeClipping =
      (overflowXVisible && overflowYVisible && (hasOverflow.x || hasOverflow.y)) ||
      (overflowXVisible && hasOverflow.x && !hasOverflow.y) ||
      (overflowYVisible && hasOverflow.y && !hasOverflow.x);
    const adjustViewportStyle =
      _paddingStyleChanged ||
      _directionChanged ||
      _scrollbarSizeChanged ||
      sizeFractionChanged ||
      viewportScrollSizeChanged ||
      overflowEdgeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      adjustViewportArrange;

    if (adjustViewportStyle) {
      const viewportStyle: StyleObject = {};
      const viewportOverflowState = setViewportOverflowState(
        structureSetupElements,
        hasOverflow,
        overflow,
        viewportStyle
      );

      _hideNativeScrollbars &&
        _hideNativeScrollbars(
          viewportOverflowState,
          _observersState,
          !!_arrangeViewport &&
            _arrangeViewport(viewportOverflowState, viewportScrollSize, sizeFraction),
          viewportStyle
        );

      if (_viewportIsTarget) {
        setAttrs(_host, dataAttributeHostOverflowX, viewportStyle[strOverflowX] as string);
        setAttrs(_host, dataAttributeHostOverflowY, viewportStyle[strOverflowY] as string);
      } else {
        setStyles(_viewport, viewportStyle);
      }
    }

    addRemoveAttrClass(_host, dataAttributeHost, dataValueHostOverflowVisible, removeClipping);
    addRemoveAttrClass(
      _padding,
      dataAttributePadding,
      dataValuePaddingOverflowVisible,
      removeClipping
    );
    if (!_viewportIsTarget) {
      addRemoveAttrClass(
        _viewport,
        dataAttributeViewport,
        dataValueViewportOverflowVisible,
        overflowVisible
      );
    }

    const [overflowStyle, overflowStyleChanged] = updateOverflowStyleCache(
      getViewportOverflowState(structureSetupElements)._overflowStyle
    );

    assignDeep(structureSetupState, {
      _overflowStyle: overflowStyle,
      _overflowEdge: {
        x: overflowEdge.w,
        y: overflowEdge.h,
      },
      _overflowAmount: {
        x: overflowAmount.w,
        y: overflowAmount.h,
      },
      _hasOverflow: hasOverflow,
    });

    return {
      _overflowStyleChanged: overflowStyleChanged,
      _overflowEdgeChanged: overflowEdgeChanged,
      _overflowAmountChanged: overflowAmountChanged,
    };
  };
};
