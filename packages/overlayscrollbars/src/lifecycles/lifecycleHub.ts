import {
  XY,
  WH,
  TRBL,
  CacheValues,
  each,
  hasOwnProperty,
  isNumber,
  scrollLeft,
  scrollTop,
  assignDeep,
  keys,
  isBoolean,
} from 'support';
import { OSOptions } from 'options';
import { getEnvironment } from 'environment';
import { StructureSetup } from 'setups/structureSetup';
import { lifecycleHubOservers, UpdateObserverOptions } from 'lifecycles/lifecycleHubObservers';
import { createTrinsicLifecycle } from 'lifecycles/trinsicLifecycle';
import { createPaddingLifecycle } from 'lifecycles/paddingLifecycle';
import { createOverflowLifecycle } from 'lifecycles/overflowLifecycle';
import { StyleObject, PartialOptions } from 'typings';
import { ScrollbarsSetup } from 'setups/scrollbarsSetup';
import { TriggerEventListener } from 'eventListeners';

export type LifecycleCheckOption = <T>(path: string) => LifecycleOptionInfo<T>;

export type Lifecycle = (
  updateHints: LifecycleUpdateHints,
  checkOption: LifecycleCheckOption,
  force: boolean
) => Partial<LifecycleUpdateHints> | void;

export type LifecycleOptionInfo<T> = [T, boolean];

export interface LifecycleCommunication {
  _paddingInfo: {
    _absolute: boolean;
    _padding: TRBL;
  };
  _viewportPaddingStyle: StyleObject;
  _viewportOverflowScrollCache: CacheValues<XY<boolean>>;
  _viewportOverflowAmountCache: CacheValues<WH<number>>;
}

export interface LifecycleUpdateHints {
  _sizeChanged: boolean;
  _hostMutation: boolean;
  _contentMutation: boolean;
  _paddingStyleChanged: boolean;
  _directionIsRTL: CacheValues<boolean>;
  _heightIntrinsic: CacheValues<boolean>;
}

export interface LifecycleHubState {
  _overflowAmount: WH<number>;
}

export interface LifecycleHubInstance {
  _update(changedOptions: PartialOptions<OSOptions>, force?: boolean): void;
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
  obj
    ? path.split('.').reduce((o, prop) => (o && hasOwnProperty(o, prop) ? o[prop] : undefined), obj)
    : undefined;

const applyForceToCache = <T>(cacheValues: CacheValues<T>, force?: boolean): CacheValues<T> => [
  cacheValues[0],
  force || cacheValues[1],
  cacheValues[2],
];
const booleanCacheValuesFallback: CacheValues<boolean> = [false, false, false];
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
  _viewportOverflowScrollCache: [
    {
      x: false,
      y: false,
    },
    false,
  ],
  _viewportOverflowAmountCache: [
    {
      w: 0,
      h: 0,
    },
    false,
  ],
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

const prepareUpdateHints = <T extends LifecycleUpdateHints>(
  leading: Required<T>,
  adaptive?: Partial<T>,
  force?: boolean
): Required<T> => {
  const result = {};
  const finalAdaptive = adaptive || {};
  const objKeys = keys(leading).concat(keys(finalAdaptive));

  each(objKeys, (key) => {
    const leadingValue = leading[key];
    const adaptiveValue = finalAdaptive[key];
    result[key] = isBoolean(leadingValue)
      ? !!force || !!leadingValue || !!adaptiveValue
      : applyForceToCache(leadingValue || booleanCacheValuesFallback, force);
  });

  return result as Required<T>;
};

const createOverflowChangedArgs = (overflowAmount: WH<number>, overflowScroll: XY<boolean>) => ({
  amount: {
    x: overflowAmount.w,
    y: overflowAmount.h,
  },
  overflow: {
    x: overflowAmount.w > 0,
    y: overflowAmount.h > 0,
  },
  scrollableOverflow: assignDeep({}, overflowScroll),
});

export const createLifecycleHub = (
  options: OSOptions,
  triggerListener: TriggerEventListener,
  structureSetup: StructureSetup,
  scrollbarsSetup: ScrollbarsSetup
): LifecycleHubInstance => {
  let lifecycleCommunication = lifecycleCommunicationFallback;
  let updateObserverOptions: UpdateObserverOptions;
  let destroyObservers: () => void;
  const { _viewport } = structureSetup._targetObj;
  const {
    _nativeScrollbarStyling,
    _nativeScrollbarIsOverlaid,
    _flexboxGlue,
    _addListener: addEnvironmentListener,
    _removeListener: removeEnvironmentListener,
  } = getEnvironment();
  const doViewportArrange =
    !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
  const instance: LifecycleHub = {
    _options: options,
    _structureSetup: structureSetup,
    _doViewportArrange: doViewportArrange,
    _getLifecycleCommunication: () => lifecycleCommunication,
    _setLifecycleCommunication(newLifecycleCommunication) {
      lifecycleCommunication = assignDeep({}, lifecycleCommunication, newLifecycleCommunication);
    },
  };
  const lifecycles: Lifecycle[] = [
    createTrinsicLifecycle(instance),
    createPaddingLifecycle(instance),
    createOverflowLifecycle(instance),
  ];

  const updateLifecycles = (
    updateHints: Partial<LifecycleUpdateHints>,
    changedOptions?: Partial<OSOptions>,
    force?: boolean
  ) => {
    const initialUpdateHints = prepareUpdateHints(
      assignDeep(
        {
          _sizeChanged: false,
          _hostMutation: false,
          _contentMutation: false,
          _paddingStyleChanged: false,
          _directionIsRTL: booleanCacheValuesFallback,
          _heightIntrinsic: booleanCacheValuesFallback,
        },
        updateHints
      ),
      {},
      force
    );
    const checkOption: LifecycleCheckOption = (path) => [
      getPropByPath(options, path),
      force || getPropByPath(changedOptions, path) !== undefined,
    ];
    const adjustScrollOffset = doViewportArrange || !_flexboxGlue;
    const scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
    const scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);

    // place before updating lifecycles because of possible flushing of debounce
    if (updateObserverOptions) {
      updateObserverOptions(checkOption);
    }

    let adaptivedUpdateHints: Required<LifecycleUpdateHints> = initialUpdateHints;
    each(lifecycles, (lifecycle) => {
      adaptivedUpdateHints = prepareUpdateHints<LifecycleUpdateHints>(
        adaptivedUpdateHints,
        lifecycle(adaptivedUpdateHints, checkOption, !!force) || {},
        force
      );
    });

    if (isNumber(scrollOffsetX)) {
      scrollLeft(_viewport, scrollOffsetX);
    }
    if (isNumber(scrollOffsetY)) {
      scrollTop(_viewport, scrollOffsetY);
    }

    const {
      _viewportOverflowAmountCache: overflowAmountCache,
      _viewportOverflowScrollCache: overflowScrollCache,
    } = lifecycleCommunication;
    const [overflowAmount, overflowAmountChanged, prevOverflowAmount] = overflowAmountCache;
    const [overflowScroll, overflowScrollChanged, prevOverflowScroll] = overflowScrollCache;

    if (overflowAmountChanged || overflowScrollChanged) {
      triggerListener(
        'overflowChanged',
        assignDeep({}, createOverflowChangedArgs(overflowAmount, overflowScroll), {
          previous: createOverflowChangedArgs(prevOverflowAmount!, prevOverflowScroll!),
        })
      );
    }

    triggerListener('updated', {
      updateHints: {
        sizeChanged: adaptivedUpdateHints._sizeChanged,
        contentMutation: adaptivedUpdateHints._contentMutation,
        hostMutation: adaptivedUpdateHints._hostMutation,
        directionChanged: adaptivedUpdateHints._directionIsRTL[1],
        heightIntrinsicChanged: adaptivedUpdateHints._heightIntrinsic[1],
      },
      changedOptions: changedOptions || {},
      force: !!force,
    });
  };
  // eslint-disable-next-line prefer-const
  [updateObserverOptions, destroyObservers] = lifecycleHubOservers(instance, updateLifecycles);

  const update = (changedOptions: Partial<OSOptions>, force?: boolean) =>
    updateLifecycles({}, changedOptions, force);
  const envUpdateListener = update.bind(0, {}, true);
  addEnvironmentListener(envUpdateListener);

  return {
    _update: update,
    _state: () => ({
      _overflowAmount: lifecycleCommunication._viewportOverflowAmountCache[0],
    }),
    _destroy() {
      destroyObservers();
      removeEnvironmentListener(envUpdateListener);

      structureSetup._destroy();
      scrollbarsSetup._destroy();
    },
  };
};
