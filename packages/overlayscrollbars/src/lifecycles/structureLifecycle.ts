import {
  CacheValues,
  cssProperty,
  runEach,
  createCache,
  topRightBottomLeft,
  TRBL,
  WH,
  XY,
  equalTRBL,
  equalXY,
  style,
  scrollSize,
  offsetSize,
} from 'support';
import { createLifecycleUpdateFunction } from 'lifecycles/lifecycleUpdateFunction';
import { LifecycleHub } from 'lifecycles/lifecycleHub';
import { getEnvironment, Environment } from 'environment';

const cssMarginEnd = cssProperty('margin-inline-end');
const cssBorderEnd = cssProperty('border-inline-end');

export const createStructureLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _host, _padding, _viewport, _content } = lifecycleHub._structureSetup._targetObj;
  const destructFns: (() => any)[] = [];
  const env: Environment = getEnvironment();
  const scrollbarsOverlaid = env._nativeScrollbarIsOverlaid;
  const supportsScrollbarStyling = env._nativeScrollbarStyling;
  const supportFlexboxGlue = env._flexboxGlue;
  // direction change is only needed to update scrollbar hiding, therefore its not needed if css can do it, scrollbars are invisible or overlaid on y axis
  const directionObserverObsolete = (cssMarginEnd && cssBorderEnd) || supportsScrollbarStyling || scrollbarsOverlaid.y;

  const { _update: updatePaddingCache } = createCache(() => topRightBottomLeft(_host, 'padding'), { _equal: equalTRBL });
  const { _update: updateOverflowAmountCache } = createCache<XY<number>, { _contentScrollSize: WH<number>; _viewportSize: WH<number> }>(
    (ctx) => ({
      x: Math.max(0, Math.round((ctx!._contentScrollSize.w - ctx!._viewportSize.w) * 100) / 100),
      y: Math.max(0, Math.round((ctx!._contentScrollSize.h - ctx!._viewportSize.h) * 100) / 100),
    }),
    { _equal: equalXY }
  );

  const _update = createLifecycleUpdateFunction(lifecycleHub, (force, checkOption) => {
    const { _value: paddingAbsolute, _changed: paddingAbsoluteChanged } = checkOption('paddingAbsolute');
    const { _value: padding, _changed: paddingChanged } = updatePaddingCache(force);

    if (paddingAbsoluteChanged || paddingChanged) {
      const paddingStyle: TRBL = {
        t: 0,
        r: 0,
        b: 0,
        l: 0,
      };

      if (!paddingAbsolute) {
        paddingStyle.t = -padding!.t;
        paddingStyle.r = -(padding!.r + padding!.l);
        paddingStyle.b = -(padding!.b + padding!.t);
        paddingStyle.l = -padding!.l;
      }

      style(_padding, {
        top: paddingStyle.t,
        left: paddingStyle.l,
        'margin-right': paddingStyle.r,
        'margin-bottom': paddingStyle.b,
        'max-width': `calc(100% + ${paddingStyle.r * -1}px)`,
      });
    }

    const viewportOffsetSize = offsetSize(_padding);
    const contentClientSize = offsetSize(_content);
    const contentScrollSize = scrollSize(_content);
    const overflowAmuntCache = updateOverflowAmountCache(force, {
      _contentScrollSize: contentScrollSize,
      _viewportSize: {
        w: viewportOffsetSize.w + Math.max(0, contentClientSize.w - contentScrollSize.w),
        h: viewportOffsetSize.h + Math.max(0, contentClientSize.h - contentScrollSize.h),
      },
    });
    const { _value: overflowAmount, _changed: overflowAmountChanged } = overflowAmuntCache;

    console.log('overflowAmount', overflowAmount);
    console.log('overflowAmountChanged', overflowAmountChanged);

    /*
    var setOverflowVariables = function (horizontal) {
      var scrollbarVars = getScrollbarVars(horizontal);
      var scrollbarVarsInverted = getScrollbarVars(!horizontal);
      var xyI = scrollbarVarsInverted._x_y;
      var xy = scrollbarVars._x_y;
      var wh = scrollbarVars._w_h;
      var widthHeight = scrollbarVars._width_height;
      var scrollMax = _strScroll + scrollbarVars._Left_Top + 'Max';
      var fractionalOverflowAmount = viewportRect[widthHeight] ? MATH.abs(viewportRect[widthHeight] - _viewportSize[wh]) : 0;
      var checkFractionalOverflowAmount = previousOverflowAmount && previousOverflowAmount[xy] > 0 && _viewportElementNative[scrollMax] === 0;
      overflowBehaviorIsVS[xy] = overflowBehavior[xy] === 'v-s';
      overflowBehaviorIsVH[xy] = overflowBehavior[xy] === 'v-h';
      overflowBehaviorIsS[xy] = overflowBehavior[xy] === 's';
      overflowAmount[xy] = MATH.max(0, MATH.round((contentScrollSize[wh] - _viewportSize[wh]) * 100) / 100);
      overflowAmount[xy] *=
        hideOverflowForceTextarea || (checkFractionalOverflowAmount && fractionalOverflowAmount > 0 && fractionalOverflowAmount < 1) ? 0 : 1;
      hasOverflow[xy] = overflowAmount[xy] > 0;

      //hideOverflow:
      //x || y : true === overflow is hidden by "overflow: scroll" OR "overflow: hidden"
      //xs || ys : true === overflow is hidden by "overflow: scroll"
      hideOverflow[xy] =
        overflowBehaviorIsVS[xy] || overflowBehaviorIsVH[xy]
          ? hasOverflow[xyI] && !overflowBehaviorIsVS[xyI] && !overflowBehaviorIsVH[xyI]
          : hasOverflow[xy];
      hideOverflow[xy + 's'] = hideOverflow[xy] ? overflowBehaviorIsS[xy] || overflowBehaviorIsVS[xy] : false;

      canScroll[xy] = hasOverflow[xy] && hideOverflow[xy + 's'];
    };
*/
    /*
    if (!supportsScrollbarStyling) {
      paddingStyle.r -= env._nativeScrollbarSize.y;
      paddingStyle.b -= env._nativeScrollbarSize.x;
    }
    */
  });

  const onSizeChanged = () => {
    _update();
  };
  const onTrinsicChanged = (heightIntrinsic: CacheValues<boolean>) => {
    const { _changed, _value } = heightIntrinsic;
    if (_changed) {
      style(_content, { height: _value ? 'auto' : '100%' });
    }
  };

  return {
    _update,
    _onSizeChanged: onSizeChanged,
    _onTrinsicChanged: onTrinsicChanged,
    _destruct() {
      runEach(destructFns);
    },
  };
};
