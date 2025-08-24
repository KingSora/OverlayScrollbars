import type { ScrollCoordinates, WH, XY } from '../../../support';
import type { ScrollbarsHidingPlugin } from '../../../plugins/scrollbarsHidingPlugin';
import type { OverflowStyle } from '../../../typings';
import type { CreateStructureUpdateSegment } from '../structureSetup';
import {
  createCache,
  getScrollSize,
  getFractionalSize,
  equalWH,
  getClientSize,
  equalXY,
  assignDeep,
  bind,
  wnd,
  mathMax,
  getWindowSize,
  addRemoveAttrClass,
  capitalizeFirstLetter,
  setStyles,
  strVisible,
  strHidden,
  keys,
  strScroll,
  scrollElementTo,
  getElementScroll,
  sanitizeScrollCoordinates,
  getStyles,
  equal,
  getZeroScrollCoordinates,
  hasDimensions,
  addEventListener,
  stopPropagation,
  rAF,
  hasAttrClass,
} from '../../../support';
import { getEnvironment } from '../../../environment';
import {
  dataAttributeHost,
  dataValueNoClipping,
  dataValueViewportScrollbarHidden,
  dataAttributePadding,
  dataValueViewportOverflowXPrefix,
  dataValueViewportOverflowYPrefix,
  dataValueViewportNoContent,
  dataValueViewportMeasuring,
} from '../../../classnames';
import { getStaticPluginModuleInstance, scrollbarsHidingPluginName } from '../../../plugins';
import {
  getShowNativeOverlaidScrollbars,
  getElementOverflowStyle,
  overflowBehaviorToOverflowStyle,
  overflowCssValueToOverflowStyle,
  overflowIsVisible,
} from '../structureSetup.utils';
import { OverflowBehavior } from '../../../options';

interface FlowDirectionStyles {
  display?: string;
  direction?: string;
  flexDirection?: string;
  writingMode?: string;
}

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
    _scrollEventElement,
    _scrollOffsetElement,
    _isBody,
    _viewportAddRemoveClass,
    _windowElm,
  } = structureSetupElements;
  const { _nativeScrollbarsHiding } = env;
  const viewportIsTargetBody = _isBody && _viewportIsTarget;
  const max0 = bind(mathMax, 0);
  const flowDirectionCanBeNonDefaultMap: Record<
    keyof FlowDirectionStyles,
    (styleValue: string) => boolean
  > = {
    display: () => false,
    direction: (directionStyle) => directionStyle !== 'ltr',
    flexDirection: (flexDirectionStyle) => flexDirectionStyle.endsWith('-reverse'),
    writingMode: (writingModeStyle) => writingModeStyle !== 'horizontal-tb',
  };
  const flowDirectionStyleArr = keys(flowDirectionCanBeNonDefaultMap) as Array<
    keyof FlowDirectionStyles
  >;
  const whCacheOptions = {
    _equal: equalWH,
    _initialValue: { w: 0, h: 0 },
  };
  const partialXYOptions = {
    _equal: equalXY,
    _initialValue: {},
  };

  const setMeasuringMode = (active: boolean) => {
    // viewportIsTargetBody never needs measuring
    _viewportAddRemoveClass(dataValueViewportMeasuring, !viewportIsTargetBody && active);
  };

  const getMeasuredScrollCoordinates = (flowDirectionStyles: FlowDirectionStyles) => {
    const flowDirectionCanBeNonDefault = flowDirectionStyleArr.some((styleName) => {
      const styleValue = flowDirectionStyles[styleName];
      return styleValue && flowDirectionCanBeNonDefaultMap[styleName](styleValue);
    });

    // if the direction can not be non-default return default scroll coordinates (only the sign of the numbers matters)
    if (!flowDirectionCanBeNonDefault) {
      return {
        _start: { x: 0, y: 0 },
        _end: { x: 1, y: 1 },
      };
    }

    setMeasuringMode(true);

    const originalScrollOffset = getElementScroll(_scrollOffsetElement);
    const removeNoContent = _viewportAddRemoveClass(dataValueViewportNoContent, true);
    const removeScrollBlock = addEventListener(
      _scrollEventElement,
      strScroll,
      (event) => {
        const scrollEventScrollOffset = getElementScroll(_scrollOffsetElement);
        // if scroll offset didnt change
        if (
          event.isTrusted &&
          scrollEventScrollOffset.x === originalScrollOffset.x &&
          scrollEventScrollOffset.y === originalScrollOffset.y
        ) {
          stopPropagation(event);
        }
      },
      {
        _capture: true,
        _once: true,
      }
    );

    scrollElementTo(_scrollOffsetElement, {
      x: 0,
      y: 0,
    });
    removeNoContent();

    const _start = getElementScroll(_scrollOffsetElement);
    const scrollSize = getScrollSize(_scrollOffsetElement);
    scrollElementTo(_scrollOffsetElement, {
      x: scrollSize.w,
      y: scrollSize.h,
    });

    const tmp = getElementScroll(_scrollOffsetElement);
    scrollElementTo(_scrollOffsetElement, {
      // if tmp is very close start there porbably wasn't any scroll happening so scroll again in different direction
      x: tmp.x - _start.x < 1 && -scrollSize.w,
      y: tmp.y - _start.y < 1 && -scrollSize.h,
    });

    const _end = getElementScroll(_scrollOffsetElement);
    scrollElementTo(_scrollOffsetElement, originalScrollOffset);
    rAF(() => removeScrollBlock());

    return {
      _start,
      _end,
    };
  };
  const getOverflowAmount = (
    viewportScrollSize: WH<number>,
    viewportClientSize: WH<number>
  ): WH<number> => {
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
  const getViewportOverflowStyle = (
    hasOverflow: Partial<XY<boolean>>,
    overflowBehavior: XY<OverflowBehavior>
  ): XY<OverflowStyle> => {
    const getAxisOverflowStyle = (
      axisBehavior: OverflowBehavior,
      axisHasOverflow: boolean | undefined,
      perpendicularBehavior: OverflowBehavior,
      perpendicularOverflow: boolean | undefined
    ): OverflowStyle => {
      // convert behavior to style:
      // 'visible'        -> 'hidden'
      // 'hidden'         -> 'hidden'
      // 'scroll'         -> 'scroll'
      // 'visible-hidden' -> 'hidden'
      // 'visible-scroll' -> 'scroll'
      const behaviorStyle =
        axisBehavior === strVisible ? strHidden : overflowBehaviorToOverflowStyle(axisBehavior);
      const axisOverflowVisible = overflowIsVisible(axisBehavior);
      const perpendicularOverflowVisible = overflowIsVisible(perpendicularBehavior);

      // if no axis has overflow set 'hidden'
      if (!axisHasOverflow && !perpendicularOverflow) {
        return strHidden;
      }

      // if both axis have a visible behavior ('visible', 'visible-hidden', 'visible-scroll') set 'visible'
      if (axisOverflowVisible && perpendicularOverflowVisible) {
        return strVisible;
      }

      // this this axis has a visible behavior
      if (axisOverflowVisible) {
        const nonPerpendicularOverflow = axisHasOverflow ? strVisible : strHidden;
        return axisHasOverflow && perpendicularOverflow
          ? behaviorStyle // if both axis have an overflow set ('hidden' or 'scroll')
          : nonPerpendicularOverflow; // if only this axis has an overflow set 'visible', if no axis has an overflow set 'hidden'
      }

      const nonOverflow =
        perpendicularOverflowVisible && perpendicularOverflow ? strVisible : strHidden;
      return axisHasOverflow
        ? behaviorStyle // if this axis has an overflow
        : nonOverflow; // if the perp. axis has a visible behavior and has an overflow set 'visible', otherwise set 'hidden'
    };

    return {
      x: getAxisOverflowStyle(overflowBehavior.x, hasOverflow.x, overflowBehavior.y, hasOverflow.y),
      y: getAxisOverflowStyle(overflowBehavior.y, hasOverflow.y, overflowBehavior.x, hasOverflow.x),
    };
  };
  const setViewportOverflowStyle = (viewportOverflowStyle: XY<OverflowStyle>) => {
    // `createAllOverflowStyleClassNames` and `allOverflowStyleClassNames` could be one scope further up but would increase bundle size
    const createAllOverflowStyleClassNames = (isHorizontal?: boolean) =>
      [strVisible, strHidden, strScroll].map((style) =>
        createViewportOverflowStyleClassName(overflowCssValueToOverflowStyle(style), isHorizontal)
      );
    const allOverflowStyleClassNames = createAllOverflowStyleClassNames(true)
      .concat(createAllOverflowStyleClassNames())
      .join(' ');

    _viewportAddRemoveClass(allOverflowStyleClassNames);
    _viewportAddRemoveClass(
      (keys(viewportOverflowStyle) as Array<keyof typeof viewportOverflowStyle>)
        .map((axis) =>
          createViewportOverflowStyleClassName(viewportOverflowStyle[axis], axis === 'x')
        )
        .join(' '),
      true
    );
  };

  const [updateSizeFraction, getCurrentSizeFraction] = createCache<WH<number>>(
    whCacheOptions,
    bind(getFractionalSize, _viewport)
  );
  const [updateViewportScrollSizeCache, getCurrentViewportScrollSizeCache] = createCache<
    WH<number>
  >(whCacheOptions, bind(getScrollSize, _viewport));
  const [updateOverflowAmountCache, getCurrentOverflowAmountCache] =
    createCache<WH<number>>(whCacheOptions);
  const [updateHasOverflowCache] = createCache<Partial<XY<boolean>>>(partialXYOptions);
  const [updateOverflowEdge, getCurrentOverflowEdgeCache] = createCache<WH<number>>(whCacheOptions);
  const [updateOverflowStyleCache] = createCache<Partial<XY<OverflowStyle>>>(partialXYOptions);
  const [updateFlowDirectionStyles] = createCache<FlowDirectionStyles>(
    {
      _equal: (currVal, newValu) => equal(currVal, newValu, flowDirectionStyleArr),
      _initialValue: {},
    },
    () => (hasDimensions(_viewport) ? getStyles(_viewport, flowDirectionStyleArr) : {})
  );
  const [updateMeasuredScrollCoordinates, getCurrentMeasuredScrollCoordinates] =
    createCache<ScrollCoordinates>({
      _equal: (currVal, newVal) =>
        equalXY(currVal._start, newVal._start) && equalXY(currVal._end, newVal._end),
      _initialValue: getZeroScrollCoordinates(),
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

  return (
    { _checkOption, _observersUpdateHints, _observersState, _force },
    { _paddingStyleChanged }
  ) => {
    const {
      _sizeChanged,
      _hostMutation,
      _contentMutation,
      _directionChanged,
      _appear,
      _scrollbarSizeChanged,
    } = _observersUpdateHints || {};
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
      if (hasAttrClass(_host, dataAttributeHost, dataValueNoClipping)) {
        setMeasuringMode(true);
      }

      const redoViewportArrange = _undoViewportArrange && _undoViewportArrange();

      const [sizeFraction] = (sizeFractionCache = updateSizeFraction(_force));
      const [viewportScrollSize] = (viewportScrollSizeCache =
        updateViewportScrollSizeCache(_force));
      const viewportClientSize = getClientSize(_viewport);
      const windowInnerSize = viewportIsTargetBody && getWindowSize(_windowElm());
      const overflowAmountScrollSize = {
        w: max0(viewportScrollSize.w + sizeFraction.w),
        h: max0(viewportScrollSize.h + sizeFraction.h),
      };

      const overflowAmountClientSize = {
        w: max0(
          (windowInnerSize
            ? windowInnerSize.w
            : viewportClientSize.w + max0(viewportClientSize.w - viewportScrollSize.w)) +
            sizeFraction.w
        ),
        h: max0(
          (windowInnerSize
            ? windowInnerSize.h
            : viewportClientSize.h + max0(viewportClientSize.h - viewportScrollSize.h)) +
            sizeFraction.h
        ),
      };

      if (redoViewportArrange) {
        redoViewportArrange();
      }

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
    const [hasOverflow, hasOverflowChanged] = updateHasOverflowCache({
      x: overflowAmount.w > 0,
      y: overflowAmount.h > 0,
    });
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
      viewportChanged ||
      (_hostMutation && viewportIsTargetBody);
    const [flowDirectionStyles, flowDirectionStylesChanged] = updateFlowDirectionStyles(_force);
    const adjustMeasuredScrollCoordinates =
      _directionChanged || _appear || flowDirectionStylesChanged || hasOverflowChanged || _force;
    const [scrollCoordinates, scrollCoordinatesChanged] = adjustMeasuredScrollCoordinates
      ? updateMeasuredScrollCoordinates(getMeasuredScrollCoordinates(flowDirectionStyles), _force)
      : getCurrentMeasuredScrollCoordinates();

    let viewportOverflowStyle = getViewportOverflowStyle(hasOverflow, overflow);

    setMeasuringMode(false);

    if (adjustViewportStyle) {
      setViewportOverflowStyle(viewportOverflowStyle);

      viewportOverflowStyle = getElementOverflowStyle(_viewport, hasOverflow);

      if (_hideNativeScrollbars && _arrangeViewport) {
        _arrangeViewport(viewportOverflowStyle, viewportScrollSize, sizeFraction);

        setStyles(_viewport, _hideNativeScrollbars(viewportOverflowStyle));
      }
    }

    const [overflowStyle, overflowStyleChanged] = updateOverflowStyleCache(viewportOverflowStyle);

    addRemoveAttrClass(_host, dataAttributeHost, dataValueNoClipping, removeClipping);
    addRemoveAttrClass(_padding, dataAttributePadding, dataValueNoClipping, removeClipping);

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
      _scrollCoordinates: sanitizeScrollCoordinates(scrollCoordinates, overflowAmount),
    });

    return {
      _overflowStyleChanged: overflowStyleChanged,
      _overflowEdgeChanged: overflowEdgeChanged,
      _overflowAmountChanged: overflowAmountChanged,
      _scrollCoordinatesChanged: scrollCoordinatesChanged || overflowAmountChanged,
    };
  };
};
