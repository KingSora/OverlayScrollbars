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
} from '~/support';
import { createDOMObserver, createSizeObserver, createTrinsicObserver } from '~/observers';
import { getEnvironment } from '~/environment';
import {
  classNameScrollbar,
  dataAttributeHost,
  dataAttributeViewport,
  dataValueViewportMeasuring,
  dataValueViewportArrange,
  dataValueNoClipping,
} from '~/classnames';
import { getStaticPluginModuleInstance, scrollbarsHidingPluginName } from '~/plugins';
import type { Options, OptionsCheckFn } from '~/options';
import type { ScrollbarsHidingPlugin } from '~/plugins';
import type { SizeObserverCallbackParams } from '~/observers';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
import type { Setup, SetupUpdateInfo, StructureSetupState } from '~/setups';
import type { CacheValues, WH } from '~/support';
import type { PlainObject } from '~/typings';

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
  const viewportAttrsFromTarget = [] as const;
  const baseStyleChangingAttrsTextarea = ['wrap', 'cols', 'rows'] as const;
  const baseStyleChangingAttrs = ['id', 'class', 'style', 'open'] as const;
  const {
    _target,
    _host,
    _viewport,
    _scrollOffsetElement,
    _content,
    _isTextarea,
    _viewportIsTarget,
    _viewportHasClass,
    _viewportAddRemoveClass,
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
      const _undoViewportArrange =
        scrollbarsHidingPlugin &&
        scrollbarsHidingPlugin._viewportArrangement(
          structureSetupElements,
          structureSetupState,
          state,
          env,
          getCurrentOption
        )._undoViewportArrange;

      const noClipping = hasAttrClass(_host, dataAttributeHost, dataValueNoClipping);
      const isArranged = !_viewportIsTarget && _viewportHasClass(dataValueViewportArrange);
      const scrollOffset = isArranged && getElementScroll(_scrollOffsetElement);

      const revertMeasuring = _viewportAddRemoveClass(dataValueViewportMeasuring, noClipping);
      const redoViewportArrange = isArranged && _undoViewportArrange && _undoViewportArrange()[0];

      const contentScroll = getScrollSize(_content);
      const viewportScroll = getScrollSize(_viewport);
      const fractional = getFractionalSize(_viewport);

      redoViewportArrange && redoViewportArrange();

      scrollElementTo(_scrollOffsetElement, scrollOffset);
      noClipping && revertMeasuring();

      return {
        w: viewportScroll.w + contentScroll.w + fractional.w,
        h: viewportScroll.h + contentScroll.h + fractional.h,
      };
    }
  );

  const contentMutationObserverAttr = _isTextarea
    ? baseStyleChangingAttrsTextarea
    : concat(baseStyleChangingAttrs, baseStyleChangingAttrsTextarea);

  const onObserversUpdatedDebounced = debounce(onObserversUpdated, {
    _timeout: () => debounceTimeout,
    _maxDelay: () => debounceMaxDelay,
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

  /*
  const updateViewportAttrsFromHost = (attributes?: string[]) => {
    each(attributes || viewportAttrsFromTarget, (attribute) => {
      if (inArray(viewportAttrsFromTarget, attribute)) {
        const hostAttr = getAttr(_host, attribute);
        if (isString(hostAttr)) {
          setAttrs(_viewport, attribute, hostAttr);
        } else {
          removeAttrs(_viewport, attribute);
        }
      }
    });
  };
  */

  const onTrinsicChanged = (
    heightIntrinsicCache: CacheValues<boolean>,
    fromRecords?: true
  ): ObserversSetupUpdateHints => {
    const [heightIntrinsic, heightIntrinsicChanged] = heightIntrinsicCache;
    const updateHints: ObserversSetupUpdateHints = {
      _heightIntrinsicChanged: heightIntrinsicChanged,
    };

    assignDeep(state, { _heightIntrinsic: heightIntrinsic });
    !fromRecords && onObserversUpdated(updateHints);

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

    _contentMutation && !fromRecords && updateFn(updateHints);

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
      _attributes: concat(baseStyleChangingAttrs, viewportAttrsFromTarget),
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
      viewportIsTargetResizeObserver && viewportIsTargetResizeObserver.observe(_host);
      const destroySizeObserver = constructSizeObserver && constructSizeObserver();
      const destroyTrinsicObserver = constructTrinsicObserver && constructTrinsicObserver();
      const destroyHostMutationObserver = constructHostMutationObserver();
      const removeResizeListener = env._addResizeListener((_scrollbarSizeChanged) => {
        const [, _contentMutation] = updateContentSizeCache();
        onObserversUpdatedDebounced({ _scrollbarSizeChanged, _contentMutation });
      });

      return () => {
        viewportIsTargetResizeObserver && viewportIsTargetResizeObserver.disconnect();
        destroySizeObserver && destroySizeObserver();
        destroyTrinsicObserver && destroyTrinsicObserver();
        destroyContentMutationObserver && destroyContentMutationObserver();
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
        updateContentMutationObserver && updateContentMutationObserver();
        destroyContentMutationObserver && destroyContentMutationObserver();

        const [construct, update] = createDOMObserver(
          _content || _viewport,
          true,
          onContentMutation,
          {
            _attributes: concat(contentMutationObserverAttr, attributes || []),
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

        hostUpdateResult &&
          assignDeep(
            updateHints,
            onHostMutation(hostUpdateResult[0], hostUpdateResult[1], takeRecords)
          );

        trinsicUpdateResult &&
          assignDeep(updateHints, onTrinsicChanged(trinsicUpdateResult[0], takeRecords));

        contentUpdateResult &&
          assignDeep(updateHints, onContentMutation(contentUpdateResult[0], takeRecords));
      }

      setDirection(updateHints);

      return updateHints;
    },
    state,
  ];
};
