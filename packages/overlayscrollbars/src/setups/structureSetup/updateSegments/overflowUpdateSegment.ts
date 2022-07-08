import {
  createCache,
  keys,
  attr,
  WH,
  XY,
  style,
  scrollSize,
  fractionalSize,
  equalWH,
  addClass,
  removeClass,
  clientSize,
  noop,
  each,
  equalXY,
  attrClass,
} from 'support';
import { getEnvironment } from 'environment';
import {
  classNameViewportArrange,
  classNameViewportScrollbarStyling,
  classNameOverflowVisible,
  dataAttributeHost,
  dataAttributeHostOverflowX,
  dataAttributeHostOverflowY,
  dataValueHostViewportScrollbarStyling,
  dataValueHostOverflowVisible,
} from 'classnames';
import type { StyleObject, OverflowStyle } from 'typings';
import type { OverflowBehavior } from 'options';
import type { CreateStructureUpdateSegment } from 'setups/structureSetup/structureSetup.update';

interface ViewportOverflowState {
  _scrollbarsHideOffset: XY<number>;
  _scrollbarsHideOffsetArrange: XY<boolean>;
  _overflowScroll: XY<boolean>;
  _overflowStyle: XY<OverflowStyle>;
}

type UndoViewportArrangeResult = [
  redoViewportArrange: () => void,
  overflowState?: ViewportOverflowState
];

const { max } = Math;
const strVisible = 'visible';
const strHidden = 'hidden';
const overlaidScrollbarsHideOffset = 42;
const whCacheOptions = {
  _equal: equalWH,
  _initialValue: { w: 0, h: 0 },
};
const xyCacheOptions = {
  _equal: equalXY,
  _initialValue: { x: strHidden, y: strHidden } as XY<OverflowStyle>,
};

const getOverflowAmount = (
  viewportScrollSize: WH<number>,
  viewportClientSize: WH<number>,
  sizeFraction: WH<number>
) => {
  const tollerance = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const amount = {
    w: max(0, viewportScrollSize.w - viewportClientSize.w - max(0, sizeFraction.w)),
    h: max(0, viewportScrollSize.h - viewportClientSize.h - max(0, sizeFraction.h)),
  };

  return {
    w: amount.w > tollerance ? amount.w : 0,
    h: amount.h > tollerance ? amount.h : 0,
  };
};

const conditionalClass = (
  elm: Element | false | null | undefined,
  classNames: string,
  add: boolean
) => (add ? addClass(elm, classNames) : removeClass(elm, classNames));

const overflowIsVisible = (overflowBehavior: string) => overflowBehavior.indexOf(strVisible) === 0;

/**
 * Lifecycle with the responsibility to set the correct overflow and scrollbar hiding styles of the viewport element.
 * @param structureUpdateHub
 * @returns
 */
export const createOverflowUpdate: CreateStructureUpdateSegment = (
  structureSetupElements,
  state
) => {
  const [getState, setState] = state;
  const {
    _host,
    _padding,
    _viewport,
    _viewportArrange,
    _viewportIsTarget,
    _viewportAddRemoveClass,
  } = structureSetupElements;
  const {
    _nativeScrollbarSize,
    _flexboxGlue,
    _nativeScrollbarStyling,
    _nativeScrollbarIsOverlaid,
  } = getEnvironment();
  const doViewportArrange =
    !_viewportIsTarget &&
    !_nativeScrollbarStyling &&
    (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);

  const [updateSizeFraction, getCurrentSizeFraction] = createCache<WH<number>>(
    whCacheOptions,
    fractionalSize.bind(0, _viewport)
  );

  const [updateViewportScrollSizeCache, getCurrentViewportScrollSizeCache] = createCache<
    WH<number>
  >(whCacheOptions, scrollSize.bind(0, _viewport));

  const [updateOverflowAmountCache, getCurrentOverflowAmountCache] =
    createCache<WH<number>>(whCacheOptions);

  const [updateOverflowStyleCache] = createCache<XY<OverflowStyle>>(xyCacheOptions);

  /**
   * Applies a fixed height to the viewport so it can't overflow or underflow the host element.
   * @param viewportOverflowState The current overflow state.
   * @param heightIntrinsic Whether the host height is intrinsic or not.
   */
  const fixFlexboxGlue = (
    viewportOverflowState: ViewportOverflowState,
    heightIntrinsic: boolean
  ) => {
    style(_viewport, {
      height: '',
    });

    if (heightIntrinsic) {
      const { _paddingAbsolute, _padding: padding } = getState();
      const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
      const fSize = fractionalSize(_host);
      const hostClientSize = clientSize(_host);

      // padding subtraction is only needed if padding is absolute or if viewport is content-box
      const isContentBox = style(_viewport, 'boxSizing') === 'content-box';
      const paddingVertical = _paddingAbsolute || isContentBox ? padding.b + padding.t : 0;
      const subtractXScrollbar = !(_nativeScrollbarIsOverlaid.x && isContentBox);

      style(_viewport, {
        height:
          hostClientSize.h +
          fSize.h +
          (_overflowScroll.x && subtractXScrollbar ? _scrollbarsHideOffset.x : 0) -
          paddingVertical,
      });
    }
  };

  /**
   * Gets the current overflow state of the viewport.
   * @param showNativeOverlaidScrollbars Whether native overlaid scrollbars are shown instead of hidden.
   * @param viewportStyleObj The viewport style object where the overflow scroll property can be read of, or undefined if shall be determined.
   * @returns A object which contains informations about the current overflow state.
   */
  const getViewportOverflowState = (
    showNativeOverlaidScrollbars: boolean,
    viewportStyleObj?: StyleObject
  ): ViewportOverflowState => {
    const arrangeHideOffset =
      !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const getStatePerAxis = (
      styleKey: string,
      isOverlaid: boolean,
      nativeScrollbarSize: number
    ) => {
      const overflowStyle = style(_viewport, styleKey);
      // can't do something like "viewportStyleObj && viewportStyleObj[styleKey] || overflowStyle" here!
      const objectPrefferedOverflowStyle = viewportStyleObj
        ? viewportStyleObj[styleKey]
        : overflowStyle;
      const overflowScroll = objectPrefferedOverflowStyle === 'scroll';
      const nonScrollbarStylingHideOffset = isOverlaid ? arrangeHideOffset : nativeScrollbarSize;
      const scrollbarsHideOffset =
        overflowScroll && !_nativeScrollbarStyling ? nonScrollbarStylingHideOffset : 0;
      const scrollbarsHideOffsetArrange = isOverlaid && !!arrangeHideOffset;

      return [overflowStyle, overflowScroll, scrollbarsHideOffset, scrollbarsHideOffsetArrange] as [
        overflowStyle: OverflowStyle,
        overflowScroll: boolean,
        scrollbarsHideOffset: number,
        scrollbarsHideOffsetArrange: boolean
      ];
    };

    const [xOverflowStyle, xOverflowScroll, xScrollbarsHideOffset, xScrollbarsHideOffsetArrange] =
      getStatePerAxis('overflowX', _nativeScrollbarIsOverlaid.x, _nativeScrollbarSize.x);
    const [yOverflowStyle, yOverflowScroll, yScrollbarsHideOffset, yScrollbarsHideOffsetArrange] =
      getStatePerAxis('overflowY', _nativeScrollbarIsOverlaid.y, _nativeScrollbarSize.y);

    return {
      _overflowStyle: {
        x: xOverflowStyle,
        y: yOverflowStyle,
      },
      _overflowScroll: {
        x: xOverflowScroll,
        y: yOverflowScroll,
      },
      _scrollbarsHideOffset: {
        x: xScrollbarsHideOffset,
        y: yScrollbarsHideOffset,
      },
      _scrollbarsHideOffsetArrange: {
        x: xScrollbarsHideOffsetArrange,
        y: yScrollbarsHideOffsetArrange,
      },
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
    hasOverflow: XY<boolean>,
    overflowOption: XY<OverflowBehavior>,
    viewportStyleObj: StyleObject
  ): ViewportOverflowState => {
    const setAxisOverflowStyle = (behavior: OverflowBehavior, hasOverflowAxis: boolean) => {
      const overflowVisible = overflowIsVisible(behavior);
      const overflowVisibleBehavior =
        (hasOverflowAxis && overflowVisible && behavior.replace(`${strVisible}-`, '')) || '';
      return [
        hasOverflowAxis && !overflowVisible ? behavior : '',
        overflowIsVisible(overflowVisibleBehavior) ? 'hidden' : overflowVisibleBehavior,
      ];
    };

    const [overflowX, visibleBehaviorX] = setAxisOverflowStyle(overflowOption.x, hasOverflow.x);
    const [overflowY, visibleBehaviorY] = setAxisOverflowStyle(overflowOption.y, hasOverflow.y);

    viewportStyleObj.overflowX = visibleBehaviorX && overflowY ? visibleBehaviorX : overflowX;
    viewportStyleObj.overflowY = visibleBehaviorY && overflowX ? visibleBehaviorY : overflowY;

    return getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj);
  };

  /**
   * Sets the styles of the viewport arrange element.
   * @param viewportOverflowState The viewport overflow state according to which the scrollbars shall be hidden.
   * @param viewportScrollSize The content scroll size.
   * @param directionIsRTL Whether the direction is RTL or not.
   * @returns A boolean which indicates whether the viewport arrange element was adjusted.
   */
  const arrangeViewport = (
    viewportOverflowState: ViewportOverflowState,
    viewportScrollSize: WH<number>,
    sizeFraction: WH<number>,
    directionIsRTL: boolean
  ) => {
    if (doViewportArrange) {
      const { _viewportPaddingStyle } = getState();
      const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
      const viewportArrangeHorizontalPaddingKey: keyof StyleObject = directionIsRTL
        ? 'paddingRight'
        : 'paddingLeft';
      const viewportArrangeHorizontalPaddingValue = _viewportPaddingStyle[
        viewportArrangeHorizontalPaddingKey
      ] as number;
      const viewportArrangeVerticalPaddingValue = _viewportPaddingStyle.paddingTop as number;
      const fractionalContentWidth = viewportScrollSize.w + sizeFraction.w;
      const fractionalContenHeight = viewportScrollSize.h + sizeFraction.h;
      const arrangeSize = {
        w:
          hideOffsetY && arrangeY
            ? `${hideOffsetY + fractionalContentWidth - viewportArrangeHorizontalPaddingValue}px`
            : '',
        h:
          hideOffsetX && arrangeX
            ? `${hideOffsetX + fractionalContenHeight - viewportArrangeVerticalPaddingValue}px`
            : '',
      };

      // adjust content arrange / before element
      if (_viewportArrange) {
        const { sheet } = _viewportArrange;
        if (sheet) {
          const { cssRules } = sheet;
          if (cssRules) {
            if (!cssRules.length) {
              sheet.insertRule(
                `#${attr(_viewportArrange, 'id')} + .${classNameViewportArrange}::before {}`,
                0
              );
            }

            // @ts-ignore
            const ruleStyle = cssRules[0].style;

            ruleStyle.width = arrangeSize.w;
            ruleStyle.height = arrangeSize.h;
          }
        }
      } else {
        style<'--os-vaw' | '--os-vah'>(_viewport, {
          '--os-vaw': arrangeSize.w,
          '--os-vah': arrangeSize.h,
        });
      }
    }

    return doViewportArrange;
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
    const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
    const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
    const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
    const { _viewportPaddingStyle: viewportPaddingStyle } = getState();
    const horizontalMarginKey: keyof StyleObject = directionIsRTL ? 'marginLeft' : 'marginRight';
    const viewportHorizontalPaddingKey: keyof StyleObject = directionIsRTL
      ? 'paddingLeft'
      : 'paddingRight';
    const horizontalMarginValue = viewportPaddingStyle[horizontalMarginKey] as number;
    const verticalMarginValue = viewportPaddingStyle.marginBottom as number;
    const horizontalPaddingValue = viewportPaddingStyle[viewportHorizontalPaddingKey] as number;
    const verticalPaddingValue = viewportPaddingStyle.paddingBottom as number;

    // horizontal
    viewportStyleObj.width = `calc(100% + ${hideOffsetY + horizontalMarginValue * -1}px)`;
    viewportStyleObj[horizontalMarginKey] = -hideOffsetY + horizontalMarginValue;

    // vertical
    viewportStyleObj.marginBottom = -hideOffsetX + verticalMarginValue;

    // viewport arrange additional styles
    if (viewportArrange) {
      viewportStyleObj[viewportHorizontalPaddingKey] =
        horizontalPaddingValue + (arrangeY ? hideOffsetY : 0);
      viewportStyleObj.paddingBottom = verticalPaddingValue + (arrangeX ? hideOffsetX : 0);
    }
  };

  /**
   * Removes all styles applied because of the viewport arrange strategy.
   * @param showNativeOverlaidScrollbars Whether native overlaid scrollbars are shown instead of hidden.
   * @param directionIsRTL Whether the direction is RTL or not.
   * @param viewportOverflowState The currentviewport overflow state or undefined if it has to be determined.
   * @returns A object with a function which applies all the removed styles and the determined viewport vverflow state.
   */
  const undoViewportArrange = (
    showNativeOverlaidScrollbars: boolean,
    directionIsRTL: boolean,
    viewportOverflowState?: ViewportOverflowState
  ): UndoViewportArrangeResult => {
    if (doViewportArrange) {
      const finalViewportOverflowState =
        viewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars);
      const { _viewportPaddingStyle: viewportPaddingStyle } = getState();
      const { _scrollbarsHideOffsetArrange } = finalViewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const finalPaddingStyle: StyleObject = {};
      const assignProps = (props: string) =>
        each(props.split(' '), (prop) => {
          finalPaddingStyle[prop] = viewportPaddingStyle[prop];
        });

      if (arrangeX) {
        assignProps('marginBottom paddingTop paddingBottom');
      }

      if (arrangeY) {
        assignProps('marginLeft marginRight paddingLeft paddingRight');
      }

      const prevStyle = style(_viewport, keys(finalPaddingStyle));

      removeClass(_viewport, classNameViewportArrange);

      if (!_flexboxGlue) {
        finalPaddingStyle.height = '';
      }

      style(_viewport, finalPaddingStyle);

      return [
        () => {
          hideNativeScrollbars(
            finalViewportOverflowState,
            directionIsRTL,
            doViewportArrange,
            prevStyle
          );
          style(_viewport, prevStyle);
          addClass(_viewport, classNameViewportArrange);
        },
        finalViewportOverflowState,
      ];
    }
    return [noop];
  };

  return (updateHints, checkOption, force) => {
    const {
      _sizeChanged,
      _hostMutation,
      _contentMutation,
      _paddingStyleChanged,
      _heightIntrinsicChanged,
      _directionChanged,
    } = updateHints;
    const { _heightIntrinsic, _directionIsRTL } = getState();
    const [showNativeOverlaidScrollbarsOption, showNativeOverlaidScrollbarsChanged] =
      checkOption<boolean>('nativeScrollbarsOverlaid.show');
    const [overflow, overflowChanged] = checkOption<XY<OverflowBehavior>>('overflow');

    const showNativeOverlaidScrollbars =
      showNativeOverlaidScrollbarsOption &&
      _nativeScrollbarIsOverlaid.x &&
      _nativeScrollbarIsOverlaid.y;
    const adjustFlexboxGlue =
      !_viewportIsTarget &&
      !_flexboxGlue &&
      (_sizeChanged ||
        _contentMutation ||
        _hostMutation ||
        showNativeOverlaidScrollbarsChanged ||
        _heightIntrinsicChanged);
    const overflowXVisible = overflowIsVisible(overflow.x);
    const overflowYVisible = overflowIsVisible(overflow.y);
    const overflowVisible = overflowXVisible || overflowYVisible;

    let sizeFractionCache = getCurrentSizeFraction(force);
    let viewportScrollSizeCache = getCurrentViewportScrollSizeCache(force);
    let overflowAmuntCache = getCurrentOverflowAmountCache(force);

    let preMeasureViewportOverflowState: ViewportOverflowState | undefined;

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarStyling) {
      _viewportAddRemoveClass(
        classNameViewportScrollbarStyling,
        dataValueHostViewportScrollbarStyling,
        !showNativeOverlaidScrollbars
      );
    }

    if (adjustFlexboxGlue) {
      preMeasureViewportOverflowState = getViewportOverflowState(showNativeOverlaidScrollbars);
      fixFlexboxGlue(preMeasureViewportOverflowState, _heightIntrinsic);
    }

    if (
      _sizeChanged ||
      _paddingStyleChanged ||
      _contentMutation ||
      _directionChanged ||
      showNativeOverlaidScrollbarsChanged
    ) {
      if (overflowVisible) {
        _viewportAddRemoveClass(classNameOverflowVisible, dataValueHostOverflowVisible, false);
      }

      const [redoViewportArrange, undoViewportArrangeOverflowState] = undoViewportArrange(
        showNativeOverlaidScrollbars,
        _directionIsRTL,
        preMeasureViewportOverflowState
      );
      const [sizeFraction, sizeFractionChanged] = (sizeFractionCache = updateSizeFraction(force));
      const [viewportScrollSize, viewportScrollSizeChanged] = (viewportScrollSizeCache =
        updateViewportScrollSizeCache(force));
      const viewportclientSize = clientSize(_viewport);
      let arrangedViewportScrollSize = viewportScrollSize;
      let arrangedViewportClientSize = viewportclientSize;

      redoViewportArrange();

      // if re measure is required (only required if content arrange strategy is used)
      if (
        (viewportScrollSizeChanged || sizeFractionChanged || showNativeOverlaidScrollbarsChanged) &&
        undoViewportArrangeOverflowState &&
        !showNativeOverlaidScrollbars &&
        arrangeViewport(
          undoViewportArrangeOverflowState,
          viewportScrollSize,
          sizeFraction,
          _directionIsRTL
        )
      ) {
        arrangedViewportClientSize = clientSize(_viewport);
        arrangedViewportScrollSize = scrollSize(_viewport);
      }

      overflowAmuntCache = updateOverflowAmountCache(
        getOverflowAmount(
          {
            w: max(viewportScrollSize.w, arrangedViewportScrollSize.w),
            h: max(viewportScrollSize.h, arrangedViewportScrollSize.h),
          }, // scroll size
          {
            w: arrangedViewportClientSize.w + max(0, viewportclientSize.w - viewportScrollSize.w),
            h: arrangedViewportClientSize.h + max(0, viewportclientSize.h - viewportScrollSize.h),
          }, // client size
          sizeFraction
        ),
        force
      );
    }

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

    if (
      _paddingStyleChanged ||
      _directionChanged ||
      sizeFractionChanged ||
      viewportScrollSizeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      adjustFlexboxGlue
    ) {
      const viewportStyle: StyleObject = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: '',
        overflowY: '',
        overflowX: '',
      };
      const viewportOverflowState = setViewportOverflowState(
        showNativeOverlaidScrollbars,
        hasOverflow,
        overflow,
        viewportStyle
      );
      const viewportArranged = arrangeViewport(
        viewportOverflowState,
        viewportScrollSize,
        sizeFraction,
        _directionIsRTL
      );

      if (!_viewportIsTarget) {
        hideNativeScrollbars(
          viewportOverflowState,
          _directionIsRTL,
          viewportArranged,
          viewportStyle
        );
      }

      if (adjustFlexboxGlue) {
        fixFlexboxGlue(viewportOverflowState, _heightIntrinsic);
      }

      if (_viewportIsTarget) {
        attr(_host, dataAttributeHostOverflowX, viewportStyle.overflowX as string);
        attr(_host, dataAttributeHostOverflowY, viewportStyle.overflowY as string);
      } else {
        style(_viewport, viewportStyle);
      }
    }

    attrClass(_host, dataAttributeHost, dataValueHostOverflowVisible, removeClipping);
    conditionalClass(_padding, classNameOverflowVisible, removeClipping);
    !_viewportIsTarget && conditionalClass(_viewport, classNameOverflowVisible, overflowVisible);

    const [overflowStyle, overflowStyleChanged] = updateOverflowStyleCache(
      getViewportOverflowState(showNativeOverlaidScrollbars)._overflowStyle
    );

    setState({
      _overflowStyle: overflowStyle,
      _overflowAmount: {
        x: overflowAmount.w,
        y: overflowAmount.h,
      },
      _hasOverflow: hasOverflow,
    });

    return {
      _overflowStyleChanged: overflowStyleChanged,
      _overflowAmountChanged: overflowAmountChanged,
    };
  };
};
