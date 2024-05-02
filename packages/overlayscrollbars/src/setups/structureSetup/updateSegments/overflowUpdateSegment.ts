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
  addRemoveAttrClass,
  capitalizeFirstLetter,
  setStyles,
  strVisible,
  strHidden,
  each,
  keys,
  strScroll,
} from '~/support';
import { getEnvironment } from '~/environment';
import {
  dataAttributeHost,
  dataValueNoClipping,
  dataValueViewportScrollbarHidden,
  dataAttributePadding,
  dataValueViewportMeasuring,
  dataValueViewportOverflowXPrefix,
  dataValueViewportOverflowYPrefix,
} from '~/classnames';
import { getStaticPluginModuleInstance, scrollbarsHidingPluginName } from '~/plugins';
import type { WH, XY } from '~/support';
import type { ScrollbarsHidingPlugin } from '~/plugins/scrollbarsHidingPlugin';
import type { OverflowStyle } from '~/typings';
import type { CreateStructureUpdateSegment } from '../structureSetup';
import type { ViewportOverflowState } from '../structureSetup.utils';
import {
  createViewportOverflowState,
  getShowNativeOverlaidScrollbars,
  overflowIsVisible,
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

  const createViewportOverflowStyleClassName = (
    overflowStyle: OverflowStyle,
    isHorizontal?: boolean
  ) => {
    const prefix = isHorizontal
      ? dataValueViewportOverflowXPrefix
      : dataValueViewportOverflowYPrefix;
    return `${prefix}${capitalizeFirstLetter(overflowStyle)}`;
  };

  const setViewportOverflow = (viewportOverflowState: ViewportOverflowState) => {
    const { _overflowStyle } = viewportOverflowState;

    each(keys(_overflowStyle) as Array<keyof typeof _overflowStyle>, (axis) => {
      const isHorizontal = axis === 'x';
      const allOverflowStyleClassNames = (
        [strVisible, strHidden, strScroll] as OverflowStyle[]
      ).map((style) => createViewportOverflowStyleClassName(style, isHorizontal));
      _viewportAddRemoveClass(allOverflowStyleClassNames.join(' '));
      _viewportAddRemoveClass(
        createViewportOverflowStyleClassName(_overflowStyle[axis], isHorizontal),
        true
      );
    });
  };

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

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarsHiding) {
      _viewportAddRemoveClass(dataValueViewportScrollbarHidden, !showNativeOverlaidScrollbars);
    }

    if (viewportChanged) {
      _viewportAddRemoveClass(dataValueViewportMeasuring, true);

      const [redoViewportArrange] = _undoViewportArrange ? _undoViewportArrange() : [];

      const [sizeFraction] = (sizeFractionCache = updateSizeFraction(_force));
      const [viewportScrollSize] = (viewportScrollSizeCache =
        updateViewportScrollSizeCache(_force));
      const viewportClientSize = clientSize(_viewport);
      const arrangedViewportScrollSize = viewportScrollSize;
      const arrangedViewportClientSize = viewportClientSize;

      _viewportAddRemoveClass(dataValueViewportMeasuring);

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
    const viewportOverflowState = createViewportOverflowState(hasOverflow, overflow);
    const [overflowStyle, overflowStyleChanged] = updateOverflowStyleCache(
      viewportOverflowState._overflowStyle
    );

    if (adjustViewportStyle) {
      setViewportOverflow(viewportOverflowState);

      if (_hideNativeScrollbars && _arrangeViewport) {
        setStyles(
          _viewport,
          _hideNativeScrollbars(
            viewportOverflowState,
            _observersState,
            _arrangeViewport(viewportOverflowState, viewportScrollSize, sizeFraction)
          )
        );
      }
    }

    if (!_viewportIsTarget) {
      addRemoveAttrClass(_host, dataAttributeHost, dataValueNoClipping, removeClipping);
      addRemoveAttrClass(_padding, dataAttributePadding, dataValueNoClipping, removeClipping);
    }

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
