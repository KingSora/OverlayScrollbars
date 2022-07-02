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
} from 'support';
import { getEnvironment } from 'environment';
import { OverflowBehavior } from 'options';
import { StyleObject } from 'typings';
import { classNameViewportArrange, classNameViewportScrollbarStyling } from 'classnames';
import type { CreateStructureUpdateSegment } from 'setups/structureSetup/structureSetup.update';

interface ViewportOverflowState {
  _scrollbarsHideOffset: XY<number>;
  _scrollbarsHideOffsetArrange: XY<boolean>;
  _overflowScroll: XY<boolean>;
}

type UndoViewportArrangeResult = [
  redoViewportArrange: () => void,
  overflowState?: ViewportOverflowState
];

const { max } = Math;
const overlaidScrollbarsHideOffset = 42;
const whCacheOptions = {
  _equal: equalWH,
  _initialValue: { w: 0, h: 0 },
};
const xyCacheOptions = {
  _equal: equalXY,
  _initialValue: { x: false, y: false },
};
const setAxisOverflowStyle = (
  horizontal: boolean,
  overflowAmount: number,
  behavior: OverflowBehavior,
  styleObj: StyleObject
) => {
  const overflowKey: keyof StyleObject = horizontal ? 'overflowX' : 'overflowY';
  const behaviorIsVisible = behavior.indexOf('visible') === 0;
  const behaviorIsVisibleHidden = behavior === 'visible-hidden';
  const behaviorIsScroll = behavior === 'scroll';
  const hasOverflow = overflowAmount > 0;

  if (behaviorIsVisible) {
    styleObj[overflowKey] = 'visible';
  }
  if (behaviorIsScroll && hasOverflow) {
    styleObj[overflowKey] = behavior;
  }

  return [behaviorIsVisible, behaviorIsVisibleHidden ? 'hidden' : 'scroll'] as [
    visible: boolean,
    behavior: string
  ];
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
  const { _host, _viewport, _viewportArrange } = structureSetupElements;
  const {
    _nativeScrollbarSize,
    _flexboxGlue,
    _nativeScrollbarStyling,
    _nativeScrollbarIsOverlaid,
  } = getEnvironment();
  const doViewportArrange =
    !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);

  const [updateSizeFraction, getCurrentSizeFraction] = createCache<WH<number>>(
    whCacheOptions,
    fractionalSize.bind(0, _host)
  );

  const [updateViewportScrollSizeCache, getCurrentViewportScrollSizeCache] = createCache<
    WH<number>
  >(whCacheOptions, scrollSize.bind(0, _viewport));

  const [updateOverflowAmountCache, getCurrentOverflowAmountCache] =
    createCache<WH<number>>(whCacheOptions);

  const [updateOverflowScrollCache] = createCache<XY<boolean>>(xyCacheOptions);

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
      const { _paddingAbsolute, _padding } = getState();
      const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
      const fSize = fractionalSize(_host);
      const hostClientSize = clientSize(_host);

      // padding subtraction is only needed if padding is absolute or if viewport is content-box
      const isContentBox = style(_viewport, 'boxSizing') === 'content-box';
      const paddingVertical = _paddingAbsolute || isContentBox ? _padding.b + _padding.t : 0;
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
    const { x: overlaidX, y: overlaidY } = _nativeScrollbarIsOverlaid;
    const determineOverflow = !viewportStyleObj;
    const arrangeHideOffset =
      !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const styleObj = determineOverflow
      ? style(_viewport, ['overflowX', 'overflowY'])
      : viewportStyleObj;
    const scroll = {
      x: styleObj.overflowX === 'scroll',
      y: styleObj.overflowY === 'scroll',
    };
    const nonScrollbarStylingHideOffset = {
      x: overlaidX ? arrangeHideOffset : _nativeScrollbarSize.x,
      y: overlaidY ? arrangeHideOffset : _nativeScrollbarSize.y,
    };
    const scrollbarsHideOffset = {
      x: scroll.x && !_nativeScrollbarStyling ? nonScrollbarStylingHideOffset.x : 0,
      y: scroll.y && !_nativeScrollbarStyling ? nonScrollbarStylingHideOffset.y : 0,
    };

    return {
      _overflowScroll: scroll,
      _scrollbarsHideOffsetArrange: {
        x: overlaidX && !!arrangeHideOffset,
        y: overlaidY && !!arrangeHideOffset,
      },
      _scrollbarsHideOffset: scrollbarsHideOffset,
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
    overflowAmount: WH<number>,
    overflow: XY<OverflowBehavior>,
    viewportStyleObj: StyleObject
  ): ViewportOverflowState => {
    const [xVisible, xVisibleBehavior] = setAxisOverflowStyle(
      true,
      overflowAmount.w,
      overflow.x,
      viewportStyleObj
    );
    const [yVisible, yVisibleBehavior] = setAxisOverflowStyle(
      false,
      overflowAmount.h,
      overflow.y,
      viewportStyleObj
    );

    if (xVisible && !yVisible) {
      viewportStyleObj.overflowX = xVisibleBehavior;
    }
    if (yVisible && !xVisible) {
      viewportStyleObj.overflowY = yVisibleBehavior;
    }

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
      !_flexboxGlue &&
      (_sizeChanged ||
        _contentMutation ||
        _hostMutation ||
        showNativeOverlaidScrollbarsChanged ||
        _heightIntrinsicChanged);

    let sizeFractionCache = getCurrentSizeFraction(force);
    let viewportScrollSizeCache = getCurrentViewportScrollSizeCache(force);
    let overflowAmuntCache = getCurrentOverflowAmountCache(force);
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
      fixFlexboxGlue(preMeasureViewportOverflowState, _heightIntrinsic);
    }

    if (
      _sizeChanged ||
      _paddingStyleChanged ||
      _contentMutation ||
      _directionChanged ||
      showNativeOverlaidScrollbarsChanged
    ) {
      const [redoViewportArrange, undoViewportArrangeOverflowState] = undoViewportArrange(
        showNativeOverlaidScrollbars,
        _directionIsRTL,
        preMeasureViewportOverflowState
      );
      const [sizeFraction, sizeFractionChanged] = (sizeFractionCache = updateSizeFraction(force));
      const [viewportScrollSize, viewportScrollSizeChanged] = (viewportScrollSizeCache =
        updateViewportScrollSizeCache(force));
      const viewportContentSize = clientSize(_viewport);
      let arrangedViewportScrollSize = viewportScrollSize;
      let arrangedViewportClientSize = viewportContentSize;

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
            w: arrangedViewportClientSize.w + max(0, viewportContentSize.w - viewportScrollSize.w),
            h: arrangedViewportClientSize.h + max(0, viewportContentSize.h - viewportScrollSize.h),
          }, // client size
          sizeFraction
        ),
        force
      );
    }

    const [overflowAmount, overflowAmountChanged] = overflowAmuntCache;
    const [viewportScrollSize, viewportScrollSizeChanged] = viewportScrollSizeCache;
    const [sizeFraction, sizeFractionChanged] = sizeFractionCache;

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
        overflowAmount,
        overflow,
        viewportStyle
      );
      const viewportArranged = arrangeViewport(
        viewportOverflowState,
        viewportScrollSize,
        sizeFraction,
        _directionIsRTL
      );
      const [overflowScroll, overflowScrollChanged] = updateOverflowScrollCache(
        viewportOverflowState._overflowScroll
      );
      hideNativeScrollbars(viewportOverflowState, _directionIsRTL, viewportArranged, viewportStyle);

      if (adjustFlexboxGlue) {
        fixFlexboxGlue(viewportOverflowState, _heightIntrinsic);
      }

      // TODO: hide host overflow if scroll x or y and no padding element there
      // TODO: Test without content
      // TODO: Test without padding
      // TODO: overflow: visible on padding / host if overflow visible on both axis

      style(_viewport, viewportStyle);

      setState({
        _overflowScroll: overflowScroll,
        _overflowAmount: overflowAmount,
      });

      return {
        _overflowAmountChanged: overflowAmountChanged,
        _overflowScrollChanged: overflowScrollChanged,
      };
    }
  };
};
