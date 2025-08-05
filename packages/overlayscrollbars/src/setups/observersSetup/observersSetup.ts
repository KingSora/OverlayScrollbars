import type { Options, OptionsCheckFn } from '../../options';
import type { ScrollbarsHidingPlugin } from '../../plugins';
import type { SizeObserverCallbackParams } from '../../observers';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
import type { Setup, SetupUpdateInfo, StructureSetupState } from '../../setups';
import type { CacheValues, WH } from '../../support';
import type { PlainObject } from '../../typings';
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
  let debounceTimeout: number | false | undefined;
  let debounceMaxDelay: number | false | undefined;
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

  const onObserversUpdatedDebounced = debounce(onObserversUpdated, {
    _debounceTiming: () => debounceTimeout,
    _maxDebounceTiming: () => debounceMaxDelay,
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
    const exclusiveSizeChange = _sizeChanged && !_appear;
    const updateFn =
      // use debounceed update:
      // if native scrollbars hiding is supported
      // and if the update is more than just a exclusive sizeChange (e.g. size change + appear, or size change + direction)
      !exclusiveSizeChange && env._nativeScrollbarsHiding
        ? onObserversUpdatedDebounced
        : onObserversUpdated;

    const updateHints: ObserversSetupUpdateHints = {
      _sizeChanged: _sizeChanged || _appear,
      _appear,
    };

    setDirection(updateHints);

    updateFn(updateHints);
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

    // if contentChangedThroughEvent is true its already debounced
    const updateFn = contentChangedThroughEvent ? onObserversUpdated : onObserversUpdatedDebounced;

    if (_contentMutation && !fromRecords) {
      updateFn(updateHints);
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
      onObserversUpdatedDebounced(updateHints);
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
  const onWindowResizeDebounced = debounce(
    () => {
      const [, _contentMutation] = updateContentSizeCache();
      onObserversUpdated({ _contentMutation, _sizeChanged: _isBody });
    },
    {
      _debounceTiming: 222,
      _leading: true,
    }
  );

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
        if (_scrollbarSizeChanged) {
          onObserversUpdatedDebounced({ _scrollbarSizeChanged });
        } else {
          onWindowResizeDebounced();
        }
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
        if (isArray(debounceValue)) {
          const timeout = debounceValue[0];
          const maxWait = debounceValue[1];
          debounceTimeout = isNumber(timeout) && timeout;
          debounceMaxDelay = isNumber(maxWait) && maxWait;
        } else if (isNumber(debounceValue)) {
          debounceTimeout = debounceValue;
          debounceMaxDelay = false;
        } else {
          debounceTimeout = false;
          debounceMaxDelay = false;
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
