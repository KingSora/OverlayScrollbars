import { createCache, topRightBottomLeft, equalTRBL, style } from 'support';
import { LifecycleHub, Lifecycle } from 'lifecycles/lifecycleHub';
import { StyleObject } from 'typings';
import { getEnvironment } from 'environment';

export const createPaddingLifecycle = (lifecycleHub: LifecycleHub): Lifecycle => {
  const { _host, _padding, _viewport } = lifecycleHub._structureSetup._targetObj;
  const { _update: updatePaddingCache, _current: currentPaddingCache } = createCache(() => topRightBottomLeft(_host, 'padding'), {
    _equal: equalTRBL,
  });

  /*
  const onTrinsicChanged = (heightIntrinsic: CacheValues<boolean>) => {
    const { _changed, _value } = heightIntrinsic;
    if (_changed) {
      style(_content, { height: _value ? 'auto' : '100%' });
    }
  };
  */

  return (updateHints, checkOption, force) => {
    let { _value: padding, _changed: paddingChanged } = currentPaddingCache(force);
    const { _nativeScrollbarStyling } = getEnvironment();
    const { _sizeChanged, _directionIsRTL } = updateHints;
    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: paddingAbsolute, _changed: paddingAbsoluteChanged } = checkOption('paddingAbsolute');

    if (_sizeChanged || paddingChanged) {
      ({ _value: padding, _changed: paddingChanged } = updatePaddingCache(force));
    }

    const paddingStyleChanged = paddingAbsoluteChanged || directionChanged || paddingChanged;

    if (paddingStyleChanged) {
      // if there is no padding element and no scrollbar styling padding absolute isn't supported
      const { _value: padding } = updatePaddingCache(force);
      const paddingRelative = !paddingAbsolute || (!_padding && !_nativeScrollbarStyling);
      const paddingHorizontal = padding!.r + padding!.l;
      const paddingVertical = padding!.t + padding!.b;
      const paddingStyle: StyleObject = {
        marginTop: '',
        marginRight: '',
        marginBottom: '',
        marginLeft: '',
        top: '',
        right: '',
        bottom: '',
        left: '',
        maxWidth: '',
      };
      const viewportStyle: StyleObject = {
        paddingTop: '',
        paddingRight: '',
        paddingBottom: '',
        paddingLeft: '',
      };

      if (paddingRelative) {
        const horizontalPositionKey = directionIsRTL ? 'right' : 'left';
        const horizontalPositionValue = directionIsRTL ? padding!.r : padding!.l;
        const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';

        paddingStyle.top = -padding!.t;
        paddingStyle[horizontalPositionKey] = -horizontalPositionValue;
        paddingStyle.marginBottom = -paddingVertical;
        paddingStyle[horizontalMarginKey] = -paddingHorizontal;
        paddingStyle.maxWidth = `calc(100% + ${paddingHorizontal}px)`;

        viewportStyle.paddingTop = padding!.t;
        viewportStyle.paddingRight = padding!.r;
        viewportStyle.paddingBottom = padding!.b;
        viewportStyle.paddingLeft = padding!.l;
      }

      // if there is no padding element apply the style to the viewport element instead
      style(_padding || _viewport, paddingStyle);
      style(_viewport, viewportStyle);

      lifecycleHub._setPaddingInfo({
        _absolute: !paddingRelative,
        _padding: padding!,
      });
      lifecycleHub._setPaddingStyle(!_padding ? paddingStyle : null);
    }

    return {
      _paddingStyleChanged: paddingStyleChanged,
    };
  };
};
