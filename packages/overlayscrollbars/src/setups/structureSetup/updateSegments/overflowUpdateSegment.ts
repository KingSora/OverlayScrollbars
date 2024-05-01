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
  dataValueOverflowVisible,
  dataValueScrollbarHidden,
  dataAttributePadding,
  dataValueMeasuring,
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
    _isBody,
    _viewportAddRemoveClass,
    _windowElm,
  } = structureSetupElements;
  const { _nativeScrollbarsHiding } = env;
  const viewportIsTargetBody = _isBody && _viewportIsTarget;
  const max0 = bind(mathMax, 0);

  const whCacheOptions = {
    _equal: equalWH,
    _initialValue: { w: 0, h: 0 },
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
  const [updateOverflowStyleCache] = createCache<Partial<XY<OverflowStyle>>>({
    _equal: equalXY,
    _initialValue: {},
  });

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
    const overflowXVisible = overflowIsVisible(overflow.x);
    const overflowYVisible = overflowIsVisible(overflow.y);
    const overflowVisible = overflowXVisible || overflowYVisible;

    const viewportChanged =
      _sizeChanged ||
      _paddingStyleChanged ||
      _contentMutation ||
      _directionChanged ||
      _scrollbarSizeChanged ||
      showNativeOverlaidScrollbarsChanged;

    let sizeFractionCache = getCurrentSizeFraction(_force);
    let viewportScrollSizeCache = getCurrentViewportScrollSizeCache(_force);
    let overflowAmuntCache = getCurrentOverflowAmountCache(_force);
    let overflowEdgeCache = getCurrentOverflowEdgeCache(_force);

    let preMeasureViewportOverflowState: ViewportOverflowState | undefined;

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarsHiding) {
      _viewportAddRemoveClass(dataValueScrollbarHidden, !showNativeOverlaidScrollbars);
    }

    if (viewportChanged) {
      if (overflowVisible) {
        _viewportAddRemoveClass(dataValueMeasuring, true);
      }

      const [redoViewportArrange] = _undoViewportArrange
        ? _undoViewportArrange(preMeasureViewportOverflowState)
        : [];

      const [sizeFraction] = (sizeFractionCache = updateSizeFraction(_force));
      const [viewportScrollSize] = (viewportScrollSizeCache =
        updateViewportScrollSizeCache(_force));
      const viewportClientSize = clientSize(_viewport);
      const arrangedViewportScrollSize = viewportScrollSize;
      const arrangedViewportClientSize = viewportClientSize;

      redoViewportArrange && redoViewportArrange();

      const windowInnerSize = windowSize(_windowElm());
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

      _viewportAddRemoveClass(dataValueMeasuring);
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
      viewportChanged;
    const viewportStyle: StyleObject = {};
    const viewportOverflowState =
      adjustViewportStyle &&
      setViewportOverflowState(structureSetupElements, hasOverflow, overflow, viewportStyle);

    if (viewportOverflowState && _hideNativeScrollbars && _arrangeViewport) {
      _hideNativeScrollbars(
        viewportOverflowState,
        _observersState,
        _arrangeViewport(viewportOverflowState, viewportScrollSize, sizeFraction),
        viewportStyle
      );
    }

    if (adjustViewportStyle) {
      if (_viewportIsTarget) {
        setAttrs(_host, dataAttributeHostOverflowX, viewportStyle[strOverflowX]);
        setAttrs(_host, dataAttributeHostOverflowY, viewportStyle[strOverflowY]);
      } else {
        setStyles(_viewport, viewportStyle);
      }
    }

    if (!_viewportIsTarget) {
      addRemoveAttrClass(_host, dataAttributeHost, dataValueOverflowVisible, removeClipping);
      addRemoveAttrClass(_padding, dataAttributePadding, dataValueOverflowVisible, removeClipping);
    }

    const [overflowStyle, overflowStyleChanged] = updateOverflowStyleCache(
      getViewportOverflowState(structureSetupElements, viewportStyle)._overflowStyle
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
