import {
  XY,
  WH,
  TRBL,
  CacheValues,
  PartialOptions,
  each,
  push,
  keys,
  hasOwnProperty,
  isNumber,
  scrollLeft,
  scrollTop,
  assignDeep,
  liesBetween,
  diffClass,
} from 'support';
import { OSOptions } from 'options';
import { classNameHost, classNameViewport, classNameContent } from 'classnames';
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

export interface LifecycleOptionInfo<T> {
  readonly _value: T;
  _changed: boolean;
}

export interface LifecycleCommunication {
  _paddingInfo: {
    _absolute: boolean;
    _padding: TRBL;
  };
  _viewportPaddingStyle: StyleObject;
  _viewportOverflowScroll: XY<boolean>;
  _viewportOverflowAmount: WH<number>;
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

export interface LifecycleHubState {
  _overflowAmount: WH<number>;
}

export interface LifecycleHubInstance {
  _update(changedOptions?: PartialOptions<OSOptions> | null, force?: boolean): void;
  _state(): LifecycleHubState;
  _destroy(): void;
}

export interface LifecycleHub {
  _options: OSOptions;
  _structureSetup: StructureSetup;
  // whether the "viewport arrange" strategy must be used (true if no native scrollbar hiding and scrollbars are overlaid)
  _doViewportArrange: boolean;
  _getLifecycleCommunication(): LifecycleCommunication;
  _setLifecycleCommunication(newLifecycleCommunication?: Partial<LifecycleCommunication>): void;
}

const getPropByPath = <T>(obj: any, path: string): T =>
  obj ? path.split('.').reduce((o, prop) => (o && hasOwnProperty(o, prop) ? o[prop] : undefined), obj) : undefined;

const emptyStylePropsToZero = (stlyeObj: StyleObject, baseStyle?: StyleObject) =>
  keys(stlyeObj).reduce(
    (obj, key) => {
      const value = stlyeObj[key];
      obj[key] = value === '' ? 0 : value;
      return obj;
    },
    { ...baseStyle }
  );

// TODO: observer textarea attrs if textarea
// TODO: tabindex, open etc.
// TODO: test _ignoreContentChange & _ignoreNestedTargetChange for content dom observer
// TODO: test _ignoreTargetChange for target dom observer
const ignorePrefix = 'os-';
const hostSelector = `.${classNameHost}`;
const viewportSelector = `.${classNameViewport}`;
const contentSelector = `.${classNameContent}`;
const attrs = ['id', 'class', 'style', 'open'];
const ignoreTargetChange = (target: Node, attrName: string, oldValue: string | null, newValue: string | null) => {
  if (attrName === 'class' && oldValue && newValue) {
    const diff = diffClass(oldValue, newValue);
    return !!diff.find((addedOrRemovedClass) => addedOrRemovedClass.indexOf(ignorePrefix) !== 0);
  }
  return false;
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
const lifecycleCommunicationFallback: LifecycleCommunication = {
  _paddingInfo: {
    _absolute: false,
    _padding: {
      t: 0,
      r: 0,
      b: 0,
      l: 0,
    },
  },
  _viewportOverflowScroll: {
    x: false,
    y: false,
  },
  _viewportOverflowAmount: {
    w: 0,
    h: 0,
  },
  _viewportPaddingStyle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
};

export const createLifecycleHub = (options: OSOptions, structureSetup: StructureSetup): LifecycleHubInstance => {
  let lifecycleCommunication = lifecycleCommunicationFallback;
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
    _getLifecycleCommunication: () => lifecycleCommunication,
    _setLifecycleCommunication(newLifecycleCommunication) {
      if (newLifecycleCommunication && newLifecycleCommunication._viewportPaddingStyle) {
        newLifecycleCommunication._viewportPaddingStyle = emptyStylePropsToZero(
          newLifecycleCommunication._viewportPaddingStyle,
          lifecycleCommunicationFallback._viewportPaddingStyle
        );
      }

      lifecycleCommunication = assignDeep({}, lifecycleCommunication, newLifecycleCommunication);
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

    if (options.callbacks.onUpdated) {
      options.callbacks.onUpdated();
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
  const hostMutationObserver = createDOMObserver(_host, false, onHostMutation, {
    _styleChangingAttributes: attrs,
    _attributes: attrs,
    _ignoreTargetChange: ignoreTargetChange,
  });
  const contentMutationObserver = createDOMObserver(_content || _viewport, true, onContentMutation, {
    _styleChangingAttributes: attrs,
    _attributes: attrs,
    _eventContentChange: options!.updating!.elementEvents,
    _nestedTargetSelector: hostSelector,
    _ignoreContentChange: (mutation, isNestedTarget) => {
      const { target, attributeName } = mutation;
      return isNestedTarget
        ? false
        : attributeName
        ? liesBetween(target as Element, hostSelector, viewportSelector) || liesBetween(target as Element, hostSelector, contentSelector)
        : false;
    },
    _ignoreNestedTargetChange: ignoreTargetChange,
  });

  const update = (changedOptions?: Partial<OSOptions> | null, force?: boolean) => {
    updateLifecycles(null, changedOptions, force);
  };
  const envUpdateListener = update.bind(null, null, true);
  addEnvironmentListener(envUpdateListener);

  console.log(getEnvironment());

  return {
    _update: update,
    _state: () => ({
      _overflowAmount: lifecycleCommunication._viewportOverflowAmount,
    }),
    _destroy() {
      removeEnvironmentListener(envUpdateListener);
    },
  };
};
