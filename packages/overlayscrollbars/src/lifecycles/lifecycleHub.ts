import { XY, TRBL, CacheValues, PartialOptions, each, push, keys, hasOwnProperty, isNumber, scrollLeft, scrollTop } from 'support';
import { OSOptions } from 'options';
import { getEnvironment } from 'environment';
import { StructureSetup } from 'setups/structureSetup';
import { createTrinsicLifecycle } from 'lifecycles/trinsicLifecycle';
import { createPaddingLifecycle } from 'lifecycles/paddingLifecycle';
import { createOverflowLifecycle } from 'lifecycles/overflowLifecycle';
import { createSizeObserver } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { createDOMObserver } from 'observers/domObserver';
import { StyleObject } from 'typings';

export type LifecycleCheckOption = <T>(path: string) => LifecycleOptionInfo<T>;

export interface PaddingInfo {
  _absolute: boolean;
  _padding: TRBL;
}

export interface LifecycleOptionInfo<T> {
  readonly _value: T;
  _changed: boolean;
}

export interface LifecycleAdaptiveUpdateHints {
  _sizeChanged: boolean;
  _hostMutation: boolean;
  _contentMutation: boolean;
  _paddingStyleChanged: boolean;
}

export interface LifecycleUpdateHints extends LifecycleAdaptiveUpdateHints {
  _directionIsRTL: CacheValues<boolean>;
  _heightIntrinsic: CacheValues<boolean>;
}

export type Lifecycle = (
  updateHints: LifecycleUpdateHints,
  checkOption: LifecycleCheckOption,
  force: boolean
) => Partial<LifecycleAdaptiveUpdateHints> | void;

export interface LifecycleHubInstance {
  _update(changedOptions?: PartialOptions<OSOptions> | null, force?: boolean): void;
  _destroy(): void;
}

export interface LifecycleHub {
  _options: OSOptions;
  _structureSetup: StructureSetup;
  // whether the "viewport arrange" strategy must be used (true if no native scrollbar hiding and scrollbars are overlaid)
  _doViewportArrange: boolean;
  _getPaddingInfo(): PaddingInfo;
  _setPaddingInfo(newPadding?: PaddingInfo | null): void;
  // padding related styles applied to the viewport element
  _getViewportPaddingStyle(): StyleObject;
  _setViewportPaddingStyle(newPaddingStlye?: StyleObject | null): void;
  _getViewportOverflowScroll(): XY<boolean>;
  _setViewportOverflowScroll(newViewportOverflowScroll: XY<boolean>): void;
}

const getPropByPath = <T>(obj: any, path: string): T =>
  obj && path.split('.').reduce((o, prop) => (o && hasOwnProperty(o, prop) ? o[prop] : undefined), obj);

const emptyStylePropsToZero = (stlyeObj: StyleObject, baseStyle?: StyleObject) =>
  keys(stlyeObj).reduce(
    (obj, key) => {
      const value = stlyeObj[key];
      obj[key] = value === '' ? 0 : value;
      return obj;
    },
    { ...baseStyle }
  );

// TODO: tabindex, open etc.
const attrs = ['id', 'class', 'style', 'open'];
const paddingInfoFallback: PaddingInfo = {
  _absolute: false,
  _padding: {
    t: 0,
    r: 0,
    b: 0,
    l: 0,
  },
};
const viewportPaddingStyleFallback: StyleObject = {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
};
const viewportOverflowScrollFallback: XY<boolean> = {
  x: false,
  y: false,
};
const directionIsRTLCacheValuesFallback: CacheValues<boolean> = {
  _value: false,
  _previous: false,
  _changed: false,
};
const heightIntrinsicCacheValuesFallback: CacheValues<boolean> = {
  _value: false,
  _previous: false,
  _changed: false,
};

export const createLifecycleHub = (options: OSOptions, structureSetup: StructureSetup): LifecycleHubInstance => {
  let paddingInfo = paddingInfoFallback;
  let viewportPaddingStyle = viewportPaddingStyleFallback;
  let viewportOverflowScroll = viewportOverflowScrollFallback;
  const { _host, _viewport, _content } = structureSetup._targetObj;
  const {
    _nativeScrollbarStyling,
    _nativeScrollbarIsOverlaid,
    _flexboxGlue,
    _addListener: addEnvironmentListener,
    _removeListener: removeEnvironmentListener,
  } = getEnvironment();
  const doViewportArrange = !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
  const lifecycles: Lifecycle[] = [];
  const instance: LifecycleHub = {
    _options: options,
    _structureSetup: structureSetup,
    _doViewportArrange: doViewportArrange,
    _getPaddingInfo: () => paddingInfo,
    _setPaddingInfo(newPaddingInfo) {
      paddingInfo = newPaddingInfo || paddingInfoFallback;
    },
    _getViewportPaddingStyle: () => viewportPaddingStyle,
    _setViewportPaddingStyle(newPaddingStlye) {
      viewportPaddingStyle = newPaddingStlye ? emptyStylePropsToZero(newPaddingStlye, viewportPaddingStyleFallback) : viewportPaddingStyleFallback;
    },
    _getViewportOverflowScroll: () => viewportOverflowScroll,
    _setViewportOverflowScroll(newViewportOverflowScroll) {
      viewportOverflowScroll = newViewportOverflowScroll || viewportOverflowScrollFallback;
    },
  };

  push(lifecycles, createTrinsicLifecycle(instance));
  push(lifecycles, createPaddingLifecycle(instance));
  push(lifecycles, createOverflowLifecycle(instance));

  const updateLifecycles = (updateHints?: Partial<LifecycleUpdateHints> | null, changedOptions?: Partial<OSOptions> | null, force?: boolean) => {
    let {
      _directionIsRTL,
      _heightIntrinsic,
      _sizeChanged = force || false,
      _hostMutation = force || false,
      _contentMutation = force || false,
      _paddingStyleChanged = force || false,
    } = updateHints || {};
    const finalDirectionIsRTL =
      _directionIsRTL || (sizeObserver ? sizeObserver._getCurrentCacheValues(force)._directionIsRTL : directionIsRTLCacheValuesFallback);
    const finalHeightIntrinsic =
      _heightIntrinsic || (trinsicObserver ? trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : heightIntrinsicCacheValuesFallback);
    const checkOption: LifecycleCheckOption = (path) => ({
      _value: getPropByPath(options, path),
      _changed: force || getPropByPath(changedOptions, path) !== undefined,
    });
    const adjustScrollOffset = doViewportArrange || !_flexboxGlue;
    const scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
    const scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);

    each(lifecycles, (lifecycle) => {
      const {
        _sizeChanged: adaptiveSizeChanged,
        _hostMutation: adaptiveHostMutation,
        _contentMutation: adaptiveContentMutation,
        _paddingStyleChanged: adaptivePaddingStyleChanged,
      } =
        lifecycle(
          {
            _directionIsRTL: finalDirectionIsRTL,
            _heightIntrinsic: finalHeightIntrinsic,
            _sizeChanged,
            _hostMutation,
            _contentMutation,
            _paddingStyleChanged,
          },
          checkOption,
          !!force
        ) || {};

      _sizeChanged = adaptiveSizeChanged || _sizeChanged;
      _hostMutation = adaptiveHostMutation || _hostMutation;
      _contentMutation = adaptiveContentMutation || _contentMutation;
      _paddingStyleChanged = adaptivePaddingStyleChanged || _paddingStyleChanged;
    });

    if (isNumber(scrollOffsetX)) {
      scrollLeft(_viewport, scrollOffsetX);
    }
    if (isNumber(scrollOffsetY)) {
      scrollTop(_viewport, scrollOffsetY);
    }
  };

  const onSizeChanged = (directionIsRTL?: CacheValues<boolean>) => {
    const sizeChanged = !directionIsRTL;
    updateLifecycles({
      _directionIsRTL: directionIsRTL,
      _sizeChanged: sizeChanged,
    });
  };
  const onTrinsicChanged = (heightIntrinsic: CacheValues<boolean>) => {
    updateLifecycles({
      _heightIntrinsic: heightIntrinsic,
    });
  };
  const onHostMutation = () => {
    // TODO: rAF only here because IE
    requestAnimationFrame(() => {
      updateLifecycles({
        _hostMutation: true,
      });
    });
  };
  const onContentMutation = () => {
    // TODO: rAF only here because IE
    requestAnimationFrame(() => {
      updateLifecycles({
        _contentMutation: true,
      });
    });
  };

  const trinsicObserver = (_content || !_flexboxGlue) && createTrinsicObserver(_host, onTrinsicChanged);
  const sizeObserver = createSizeObserver(_host, onSizeChanged, { _appear: true, _direction: !_nativeScrollbarStyling });
  const hostMutationObserver = createDOMObserver(_host, onHostMutation, {
    _styleChangingAttributes: attrs,
    _attributes: attrs,
  });
  const contentMutationObserver = createDOMObserver(_content || _viewport, onContentMutation, {
    _observeContent: true,
    _styleChangingAttributes: attrs,
    _attributes: attrs,
    _eventContentChange: options!.updating!.elementEvents as [string, string][],
    /*
      _nestedTargetSelector: hostSelector,
      _ignoreContentChange: (mutation, isNestedTarget) => {
        const { target, attributeName } = mutation;
        return isNestedTarget ? false : attributeName ? liesBetween(target as Element, hostSelector, '.content') : false;
      },
      _ignoreTargetAttrChange: (target, attrName, oldValue, newValue) => {
        if (attrName === 'class' && oldValue && newValue) {
          const diff = diffClass(oldValue, newValue);
          const ignore = diff.length === 1 && diff[0].startsWith(ignorePrefix);
          return ignore;
        }
        return false;
      },
      */
  });

  const update = (changedOptions?: Partial<OSOptions> | null, force?: boolean) => {
    updateLifecycles(null, changedOptions, force);
  };
  const envUpdateListener = update.bind(null, null, true);
  addEnvironmentListener(envUpdateListener);

  console.log(getEnvironment());

  return {
    _update: update,
    _destroy() {
      removeEnvironmentListener(envUpdateListener);
    },
  };
};
