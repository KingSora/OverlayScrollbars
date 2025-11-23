import type { Options, OptionsCheckFn, OptionsDebounceValue } from '../../options';
import type { ScrollbarsHidingPlugin } from '../../plugins';
import type { SizeObserverCallbackParams } from '../../observers';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
import type { Setup, SetupUpdateInfo, StructureSetupState } from '../../setups';
import type { CacheValues, DebounceLeading, DebounceTiming, WH } from '../../support';
import type { PlainObject } from '../../typings';
import { defaultOptionsUpdateDebounceEnv, defaultOptionsUpdateDebounceEvent } from '../../options';
import { getStaticPluginModuleInstance, scrollbarsHidingPluginName } from '../../plugins';
import {
  classNameScrollbar,
  dataAttributeHost,
  dataAttributeViewport,
  dataValueViewportMeasuring,
  dataValueViewportArrange,
  dataValueNoClipping,
} from '../../classnames';
import { getEnvironment } from '../../environment';
import { createDOMObserver, createSizeObserver, createTrinsicObserver } from '../../observers';
import {
  ResizeObserverConstructor,
  assignDeep,
  closest,
  createCache,
  debounce,
  equalWH,
  getFractionalSize,
  isArray,
  isFunction,
  isNumber,
  isPlainObject,
  keys,
  liesBetween,
  getScrollSize,
  getElementScroll,
  scrollElementTo,
  domRectAppeared,
  concat,
  getStyles,
  hasAttrClass,
} from '../../support';

export interface ObserversSetupState {
  _heightIntrinsic: boolean;
  _directionIsRTL: boolean;
}

export interface ObserversSetupUpdateInfo extends SetupUpdateInfo {
  _takeRecords?: boolean;
}

export type ObserversSetupUpdateHints = {
  _sizeChanged?: boolean;
  _directionChanged?: boolean;
  _heightIntrinsicChanged?: boolean;
  _hostMutation?: boolean;
  _contentMutation?: boolean;
  _appear?: boolean;
  _scrollbarSizeChanged?: boolean;
};

export type ObserversSetup = Setup<
  ObserversSetupUpdateInfo,
  ObserversSetupState,
  ObserversSetupUpdateHints
>;

export const createObserversSetup = (
  structureSetupElements: StructureSetupElementsObj,
  structureSetupState: StructureSetupState,
  getCurrentOption: OptionsCheckFn<Options>,
  onObserversUpdated: (updateHints: ObserversSetupUpdateHints) => void
): ObserversSetup => {
  // latest debounce options
  let debounceMutation: OptionsDebounceValue | undefined;
  let debounceResize: OptionsDebounceValue | undefined;
  let debounceEvent: OptionsDebounceValue | undefined;
  let debounceEnv: OptionsDebounceValue | undefined;

  let updateContentMutationObserver: (() => void) | undefined;
  let destroyContentMutationObserver: (() => void) | undefined;
  let prevContentRect: DOMRectReadOnly | undefined;
  let prevDirectionIsRTL: boolean | undefined;
  const hostSelector = `[${dataAttributeHost}]`;

  // TODO: observer textarea attrs if textarea

  const viewportSelector = `[${dataAttributeViewport}]`;
  const baseStyleChangingAttrs = ['id', 'class', 'style', 'open', 'wrap', 'cols', 'rows'];
  const {
    _target,
    _host,
    _viewport,
    _scrollOffsetElement,
    _content,
    _viewportIsTarget,
    _isBody,
    _viewportHasClass,
    _viewportAddRemoveClass,
    _removeScrollObscuringStyles,
  } = structureSetupElements;
  const getDirectionIsRTL = (elm: HTMLElement): boolean => getStyles(elm, 'direction') === 'rtl';
  const createDebouncedObservesUpdate = () => {
    let currDebounceTiming: DebounceTiming;
    let currMaxDebounceTiming: DebounceTiming;
    let currDebounceLeading: DebounceLeading;
    const debouncedFn = debounce(onObserversUpdated, {
      _debounceTiming: () => currDebounceTiming,
      _maxDebounceTiming: () => currMaxDebounceTiming,
      _leading: () => currDebounceLeading,
      _mergeParams(prev, curr) {
        const [prevObj] = prev;
        const [currObj] = curr;
        return [
          concat(keys(prevObj), keys(currObj)).reduce((obj, key) => {
            obj[key] = prevObj[key as keyof typeof prevObj] || currObj[key as keyof typeof currObj];
            return obj;
          }, {} as PlainObject),
        ] as [Partial<ObserversSetupUpdateHints>];
      },
    });
    const fn = (
      updateHints: ObserversSetupUpdateHints,
      debounceOption: OptionsDebounceValue | false | undefined
    ) => {
      if (isArray(debounceOption)) {
        const [timing, maxTiming, leading] = debounceOption;
        currDebounceTiming = timing;
        currMaxDebounceTiming = maxTiming;
        currDebounceLeading = leading;
      } else if (isNumber(debounceOption)) {
        currDebounceTiming = debounceOption;
        currMaxDebounceTiming = false;
        currDebounceLeading = false;
      } else {
        currDebounceTiming = false;
        currMaxDebounceTiming = false;
        currDebounceLeading = false;
      }

      debouncedFn(updateHints);
    };
    fn._flush = debouncedFn._flush;

    return fn;
  };

  const state: ObserversSetupState = {
    _heightIntrinsic: false,
    _directionIsRTL: getDirectionIsRTL(_target),
  };
  const env = getEnvironment();
  const scrollbarsHidingPlugin = getStaticPluginModuleInstance<typeof ScrollbarsHidingPlugin>(
    scrollbarsHidingPluginName
  );
  const [updateContentSizeCache] = createCache<WH<number>>(
    {
      _equal: equalWH,
      _initialValue: { w: 0, h: 0 },
    },
    () => {
      const undoViewportArrange =
        scrollbarsHidingPlugin &&
        scrollbarsHidingPlugin._viewportArrangement(
          structureSetupElements,
          structureSetupState,
          state,
          env,
          getCurrentOption
        )._undoViewportArrange;

      const viewportIsTargetBody = _isBody && _viewportIsTarget;
      const noClipping =
        !viewportIsTargetBody && hasAttrClass(_host, dataAttributeHost, dataValueNoClipping);
      const isArranged = !_viewportIsTarget && _viewportHasClass(dataValueViewportArrange);
      const scrollOffset = isArranged && getElementScroll(_scrollOffsetElement);
      const revertScrollObscuringStyles = scrollOffset && _removeScrollObscuringStyles();

      const revertMeasuring = _viewportAddRemoveClass(dataValueViewportMeasuring, noClipping);
      const redoViewportArrange = isArranged && undoViewportArrange && undoViewportArrange();
      const viewportScroll = getScrollSize(_viewport);
      const fractional = getFractionalSize(_viewport);

      if (redoViewportArrange) {
        redoViewportArrange();
      }

      scrollElementTo(_scrollOffsetElement, scrollOffset);
      if (revertScrollObscuringStyles) {
        revertScrollObscuringStyles();
      }
      if (noClipping) {
        revertMeasuring();
      }

      return {
        w: viewportScroll.w + fractional.w,
        h: viewportScroll.h + fractional.h,
      };
    }
  );
  const onObserversUpdatedDebounced = createDebouncedObservesUpdate();
  const setDirection = (updateHints: ObserversSetupUpdateHints) => {
    const newDirectionIsRTL = getDirectionIsRTL(_target);
    assignDeep(updateHints, { _directionChanged: prevDirectionIsRTL !== newDirectionIsRTL });
    assignDeep(state, { _directionIsRTL: newDirectionIsRTL });
    prevDirectionIsRTL = newDirectionIsRTL;
  };
  const onTrinsicChanged = (
    heightIntrinsicCache: CacheValues<boolean>,
    fromRecords?: true
  ): ObserversSetupUpdateHints => {
    const [heightIntrinsic, heightIntrinsicChanged] = heightIntrinsicCache;
    const updateHints: ObserversSetupUpdateHints = {
      _heightIntrinsicChanged: heightIntrinsicChanged,
    };

    assignDeep(state, { _heightIntrinsic: heightIntrinsic });

    if (!fromRecords) {
      onObserversUpdated(updateHints);
    }

    return updateHints;
  };
  const onSizeChanged = ({ _sizeChanged, _appear }: SizeObserverCallbackParams) => {
    // only don't debounce appear since it shouldn't happen that frequently
    const updateFn = _appear ? onObserversUpdated : onObserversUpdatedDebounced;
    const updateHints: ObserversSetupUpdateHints = {
      _sizeChanged: _sizeChanged || _appear,
      _appear,
    };

    setDirection(updateHints);
    updateFn(updateHints, debounceResize);
  };
  const onContentMutation = (
    contentChangedThroughEvent: boolean,
    fromRecords?: true
  ): ObserversSetupUpdateHints => {
    const [, _contentMutation] = updateContentSizeCache();
    const updateHints: ObserversSetupUpdateHints = {
      _contentMutation,
    };

    setDirection(updateHints);

    if (_contentMutation && !fromRecords) {
      onObserversUpdatedDebounced(
        updateHints,
        contentChangedThroughEvent ? debounceEvent : debounceMutation
      );
    }

    return updateHints;
  };
  const onHostMutation = (
    targetChangedAttrs: string[],
    targetStyleChanged: boolean,
    fromRecords?: true
  ): ObserversSetupUpdateHints => {
    const updateHints: ObserversSetupUpdateHints = {
      _hostMutation: targetStyleChanged,
    };

    setDirection(updateHints);

    if (targetStyleChanged && !fromRecords) {
      onObserversUpdatedDebounced(updateHints, debounceMutation);
    }
    /*
    else if (!_viewportIsTarget) {
      updateViewportAttrsFromHost(targetChangedAttrs);
    }
    */

    return updateHints;
  };
  const [constructTrinsicObserver, updateTrinsicObserver] = _content
    ? createTrinsicObserver(_host, onTrinsicChanged)
    : [];
  const constructSizeObserver =
    !_viewportIsTarget &&
    createSizeObserver(_host, onSizeChanged, {
      _appear: true,
    });
  const [constructHostMutationObserver, updateHostMutationObserver] = createDOMObserver(
    _host,
    false,
    onHostMutation,
    {
      _styleChangingAttributes: baseStyleChangingAttrs,
      _attributes: baseStyleChangingAttrs,
    }
  );
  const viewportIsTargetResizeObserver =
    _viewportIsTarget &&
    ResizeObserverConstructor &&
    new ResizeObserverConstructor((entries) => {
      const currContentRect = entries[entries.length - 1].contentRect;
      onSizeChanged({
        _sizeChanged: true,
        _appear: domRectAppeared(currContentRect, prevContentRect),
      });
      prevContentRect = currContentRect;
    });

  return [
    () => {
      // order is matter!
      // updateViewportAttrsFromHost();
      if (viewportIsTargetResizeObserver) {
        viewportIsTargetResizeObserver.observe(_host);
      }
      const destroySizeObserver = constructSizeObserver && constructSizeObserver();
      const destroyTrinsicObserver = constructTrinsicObserver && constructTrinsicObserver();
      const destroyHostMutationObserver = constructHostMutationObserver();
      const removeResizeListener = env._addResizeListener((_scrollbarSizeChanged) => {
        const [, _contentMutation] = updateContentSizeCache();
        onObserversUpdatedDebounced(
          { _scrollbarSizeChanged, _contentMutation, _sizeChanged: _isBody },
          debounceEnv
        );
      });

      return () => {
        if (viewportIsTargetResizeObserver) {
          viewportIsTargetResizeObserver.disconnect();
        }
        if (destroySizeObserver) {
          destroySizeObserver();
        }
        if (destroyTrinsicObserver) {
          destroyTrinsicObserver();
        }
        if (destroyContentMutationObserver) {
          destroyContentMutationObserver();
        }
        destroyHostMutationObserver();
        removeResizeListener();
      };
    },
    ({ _checkOption, _takeRecords, _force }) => {
      const updateHints: ObserversSetupUpdateHints = {};

      const [ignoreMutation] = _checkOption('update.ignoreMutation');
      const [attributes, attributesChanged] = _checkOption('update.attributes');
      const [elementEvents, elementEventsChanged] = _checkOption('update.elementEvents');
      const [debounceValue, debounceChanged] = _checkOption('update.debounce');
      const contentMutationObserverChanged = elementEventsChanged || attributesChanged;
      const takeRecords = _takeRecords || _force;
      const ignoreMutationFromOptions = (mutation: MutationRecord) =>
        isFunction(ignoreMutation) && ignoreMutation(mutation);

      if (contentMutationObserverChanged) {
        if (updateContentMutationObserver) {
          updateContentMutationObserver();
        }
        if (destroyContentMutationObserver) {
          destroyContentMutationObserver();
        }

        const [construct, update] = createDOMObserver(
          _content || _viewport,
          true,
          onContentMutation,
          {
            _attributes: concat(baseStyleChangingAttrs, attributes || []),
            _eventContentChange: elementEvents,
            _nestedTargetSelector: hostSelector,
            _ignoreContentChange: (mutation, isNestedTarget) => {
              const { target: mutationTarget, attributeName } = mutation;
              const ignore =
                !isNestedTarget && attributeName && !_viewportIsTarget
                  ? liesBetween(mutationTarget, hostSelector, viewportSelector)
                  : false;
              return (
                ignore ||
                !!closest(mutationTarget, `.${classNameScrollbar}`) || // ignore explicitely all scrollbar elements
                !!ignoreMutationFromOptions(mutation)
              );
            },
          }
        );

        destroyContentMutationObserver = construct();
        updateContentMutationObserver = update;
      }

      if (debounceChanged) {
        onObserversUpdatedDebounced._flush();
        // parse and distribute the debounce option
        if (isArray(debounceValue) || isNumber(debounceValue)) {
          // deprecated behavior: Value applies to mutation. resize and event are undefined
          debounceMutation = debounceValue;
          debounceResize = false;
          debounceEvent = defaultOptionsUpdateDebounceEvent;
          debounceEnv = defaultOptionsUpdateDebounceEnv;
        } else if (isPlainObject(debounceValue)) {
          debounceMutation = debounceValue.mutation;
          debounceResize = debounceValue.resize;
          debounceEvent = debounceValue.event;
          debounceEnv = debounceValue.env;
        } else {
          debounceMutation = false;
          debounceResize = false;
          debounceEvent = false;
          debounceEnv = false;
        }
      }

      if (takeRecords) {
        const hostUpdateResult = updateHostMutationObserver();
        const trinsicUpdateResult = updateTrinsicObserver && updateTrinsicObserver();
        const contentUpdateResult =
          updateContentMutationObserver && updateContentMutationObserver();

        if (hostUpdateResult) {
          assignDeep(
            updateHints,
            onHostMutation(hostUpdateResult[0], hostUpdateResult[1], takeRecords)
          );
        }

        if (trinsicUpdateResult) {
          assignDeep(updateHints, onTrinsicChanged(trinsicUpdateResult[0], takeRecords));
        }

        if (contentUpdateResult) {
          assignDeep(updateHints, onContentMutation(contentUpdateResult[0], takeRecords));
        }
      }

      setDirection(updateHints);

      return updateHints;
    },
    state,
  ];
};
