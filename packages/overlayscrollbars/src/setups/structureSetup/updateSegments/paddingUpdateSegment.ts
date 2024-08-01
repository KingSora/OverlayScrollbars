import type { StyleObject } from '../../../typings';
import type { CreateStructureUpdateSegment } from '../structureSetup';
import {
  createCache,
  topRightBottomLeft,
  equalTRBL,
  assignDeep,
  bind,
  strMarginBottom,
  strMarginLeft,
  strMarginRight,
  strPaddingBottom,
  strPaddingLeft,
  strPaddingRight,
  strPaddingTop,
  strWidth,
  setStyles,
} from '../../../support';
import { getEnvironment } from '../../../environment';

/**
 * Lifecycle with the responsibility to adjust the padding styling of the padding and viewport element.
 * @param structureUpdateHub
 * @returns
 */
export const createPaddingUpdateSegment: CreateStructureUpdateSegment = (
  { _host, _padding, _viewport, _viewportIsTarget },
  state
) => {
  const [updatePaddingCache, currentPaddingCache] = createCache(
    {
      _equal: equalTRBL,
      _initialValue: topRightBottomLeft(),
    },
    bind(topRightBottomLeft, _host, 'padding', '')
  );

  return ({ _checkOption, _observersUpdateHints, _observersState, _force }) => {
    let [padding, paddingChanged] = currentPaddingCache(_force);
    const { _nativeScrollbarsHiding } = getEnvironment();
    const { _sizeChanged, _contentMutation, _directionChanged } = _observersUpdateHints || {};
    const { _directionIsRTL } = _observersState;
    const [paddingAbsolute, paddingAbsoluteChanged] = _checkOption('paddingAbsolute');
    const contentMutation = _force || _contentMutation;

    if (_sizeChanged || paddingChanged || contentMutation) {
      [padding, paddingChanged] = updatePaddingCache(_force);
    }

    const paddingStyleChanged =
      !_viewportIsTarget && (paddingAbsoluteChanged || _directionChanged || paddingChanged);

    if (paddingStyleChanged) {
      // if there is no padding element and no scrollbar styling, paddingAbsolute isn't supported
      const paddingRelative = !paddingAbsolute || (!_padding && !_nativeScrollbarsHiding);
      const paddingHorizontal = padding.r + padding.l;
      const paddingVertical = padding.t + padding.b;

      const paddingStyle: StyleObject = {
        [strMarginRight]: paddingRelative && !_directionIsRTL ? -paddingHorizontal : 0,
        [strMarginBottom]: paddingRelative ? -paddingVertical : 0,
        [strMarginLeft]: paddingRelative && _directionIsRTL ? -paddingHorizontal : 0,
        top: paddingRelative ? -padding.t : 0,
        right: paddingRelative ? (_directionIsRTL ? -padding.r : 'auto') : 0,
        left: paddingRelative ? (_directionIsRTL ? 'auto' : -padding.l) : 0,
        [strWidth]: paddingRelative && `calc(100% + ${paddingHorizontal}px)`,
      };
      const viewportStyle: StyleObject = {
        [strPaddingTop]: paddingRelative ? padding.t : 0,
        [strPaddingRight]: paddingRelative ? padding.r : 0,
        [strPaddingBottom]: paddingRelative ? padding.b : 0,
        [strPaddingLeft]: paddingRelative ? padding.l : 0,
      };

      // if there is no padding element apply the style to the viewport element instead
      setStyles(_padding || _viewport, paddingStyle);
      setStyles(_viewport, viewportStyle);

      assignDeep(state, {
        _padding: padding,
        _paddingAbsolute: !paddingRelative,
        _viewportPaddingStyle: _padding
          ? viewportStyle
          : assignDeep({}, paddingStyle, viewportStyle),
      });
    }

    return {
      _paddingStyleChanged: paddingStyleChanged,
    };
  };
};
