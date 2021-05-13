import { XY, WH, TRBL, CacheValues, PartialOptions, each, hasOwnProperty, isNumber, scrollLeft, scrollTop, assignDeep } from 'support';
import { OSOptions } from 'options';
import { getEnvironment } from 'environment';
import { StructureSetup } from 'setups/structureSetup';
import { lifecycleHubOservers } from 'lifecycles/lifecycleHubObservers';
import { createTrinsicLifecycle } from 'lifecycles/trinsicLifecycle';
import { createPaddingLifecycle } from 'lifecycles/paddingLifecycle';
import { createOverflowLifecycle } from 'lifecycles/overflowLifecycle';
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

const booleanCacheValuesFallback: CacheValues<boolean> = {
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
  const { _viewport } = structureSetup._targetObj;
  const {
    _nativeScrollbarStyling,
    _nativeScrollbarIsOverlaid,
    _flexboxGlue,
    _addListener: addEnvironmentListener,
    _removeListener: removeEnvironmentListener,
  } = getEnvironment();
  const doViewportArrange = !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
  const instance: LifecycleHub = {
    _options: options,
    _structureSetup: structureSetup,
    _doViewportArrange: doViewportArrange,
    _getLifecycleCommunication: () => lifecycleCommunication,
    _setLifecycleCommunication(newLifecycleCommunication) {
      lifecycleCommunication = assignDeep({}, lifecycleCommunication, newLifecycleCommunication);
    },
  };
  const lifecycles: Lifecycle[] = [createTrinsicLifecycle(instance), createPaddingLifecycle(instance), createOverflowLifecycle(instance)];

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
      _directionIsRTL || (_sizeObserver ? _sizeObserver._getCurrentCacheValues(force)._directionIsRTL : booleanCacheValuesFallback);
    const finalHeightIntrinsic =
      _heightIntrinsic || (_trinsicObserver ? _trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : booleanCacheValuesFallback);
    const checkOption: LifecycleCheckOption = (path) => ({
      _value: getPropByPath(options, path),
      _changed: force || getPropByPath(changedOptions, path) !== undefined,
    });
    const adjustScrollOffset = doViewportArrange || !_flexboxGlue;
    const scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
    const scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);

    // place before updating lifecycles because of possible flushing of debounce
    if (_updateObserverOptions) {
      _updateObserverOptions(checkOption);
    }

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
  const { _sizeObserver, _trinsicObserver, _updateObserverOptions } = lifecycleHubOservers(instance, updateLifecycles);

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
