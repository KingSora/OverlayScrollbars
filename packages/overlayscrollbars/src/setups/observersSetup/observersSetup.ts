import {
  ResizeObserverConstructor,
  assignDeep,
  attr,
  closest,
  createCache,
  debounce,
  getDirectionIsRTL,
  domRectHasDimensions,
  each,
  equalWH,
  fractionalSize,
  isArray,
  isFunction,
  isNumber,
  isString,
  keys,
  liesBetween,
  removeAttr,
  scrollSize,
  getElmentScroll,
  scrollElementTo,
  inArray,
} from '~/support';
import { createDOMObserver, createSizeObserver, createTrinsicObserver } from '~/observers';
import { getEnvironment } from '~/environment';
import {
  classNameScrollbar,
  dataAttributeHost,
  dataAttributeViewport,
  dataValueHostOverflowVisible,
  dataValueHostUpdating,
  dataValueViewportArrange,
  dataValueViewportOverflowVisible,
} from '~/classnames';
import type { SizeObserverCallbackParams } from '~/observers';
import type { StructureSetupElementsObj } from '../structureSetup/structureSetup.elements';
import type { Setup, SetupUpdateInfo } from '~/setups';
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
};

export type ObserversSetup = Setup<
  ObserversSetupUpdateInfo,
  ObserversSetupState,
  ObserversSetupUpdateHints
>;

export const createObserversSetup = (
  structureSetupElements: StructureSetupElementsObj,
  onObserversUpdated: (updateHints: ObserversSetupUpdateHints) => void
): ObserversSetup => {
  let debounceTimeout: number | false | undefined;
  let debounceMaxDelay: number | false | undefined;
  let updateContentMutationObserver: (() => void) | undefined;
  let destroyContentMutationObserver: (() => void) | undefined;

  const strUpdateDot = `update.`;
  const hostSelector = `[${dataAttributeHost}]`;

  // TODO: observer textarea attrs if textarea

  const viewportSelector = `[${dataAttributeViewport}]`;
  const viewportAttrsFromTarget = ['tabindex'];
  const baseStyleChangingAttrsTextarea = ['wrap', 'cols', 'rows'];
  const baseStyleChangingAttrs = ['id', 'class', 'style', 'open'];

  const state: ObserversSetupState = {
    _heightIntrinsic: false,
    _directionIsRTL: getDirectionIsRTL(structureSetupElements._host),
  };
  const {
    _host,
    _viewport,
    _content,
    _isTextarea,
    _viewportIsTarget,
    _viewportHasClass,
    _viewportAddRemoveClass,
  } = structureSetupElements;
  const { _flexboxGlue } = getEnvironment();

  const [updateContentSizeCache] = createCache<WH<number>>(
    {
      _equal: equalWH,
      _initialValue: { w: 0, h: 0 },
    },
    () => {
      const hasOver = _viewportHasClass(
        dataValueViewportOverflowVisible,
        dataValueHostOverflowVisible
      );
      const hasVpStyle = _viewportHasClass(dataValueViewportArrange, '');
      const scrollOffset = hasVpStyle && getElmentScroll(_viewport);
      _viewportAddRemoveClass(dataValueViewportOverflowVisible, dataValueHostOverflowVisible);
      _viewportAddRemoveClass(dataValueViewportArrange, '');
      _viewportAddRemoveClass('', dataValueHostUpdating, true);

      const contentScroll = scrollSize(_content);
      const viewportScroll = scrollSize(_viewport);
      const fractional = fractionalSize(_viewport);

      _viewportAddRemoveClass(
        dataValueViewportOverflowVisible,
        dataValueHostOverflowVisible,
        hasOver
      );
      _viewportAddRemoveClass(dataValueViewportArrange, '', hasVpStyle);
      _viewportAddRemoveClass('', dataValueHostUpdating);
      scrollElementTo(_viewport, scrollOffset);

      return {
        w: viewportScroll.w + contentScroll.w + fractional.w,
        h: viewportScroll.h + contentScroll.h + fractional.h,
      };
    }
  );

  const contentMutationObserverAttr = _isTextarea
    ? baseStyleChangingAttrsTextarea
    : baseStyleChangingAttrs.concat(baseStyleChangingAttrsTextarea);

  const onObserversUpdatedDebounced = debounce(onObserversUpdated, {
    _timeout: () => debounceTimeout,
    _maxDelay: () => debounceMaxDelay,
    _mergeParams(prev, curr) {
      const [prevObj] = prev;
      const [currObj] = curr;
      return [
        keys(prevObj)
          .concat(keys(currObj))
          .reduce((obj, key) => {
            obj[key] = prevObj[key as keyof typeof prevObj] || currObj[key as keyof typeof currObj];
            return obj;
          }, {} as PlainObject),
      ] as [Partial<ObserversSetupUpdateHints>];
    },
  });

  const updateViewportAttrsFromHost = (attributes?: string[]) => {
    each(attributes || viewportAttrsFromTarget, (attribute) => {
      if (inArray(viewportAttrsFromTarget, attribute)) {
        const hostAttr = attr(_host, attribute);
        if (isString(hostAttr)) {
          attr(_viewport, attribute, hostAttr);
        } else {
          removeAttr(_viewport, attribute);
        }
      }
    });
  };

  const onTrinsicChanged = (
    heightIntrinsicCache: CacheValues<boolean>,
    fromRecords?: true
  ): ObserversSetupUpdateHints => {
    const [heightIntrinsic, heightIntrinsicChanged] = heightIntrinsicCache;
    const updateHints = {
      _heightIntrinsicChanged: heightIntrinsicChanged,
    };

    assignDeep(state, { _heightIntrinsic: heightIntrinsic });
    !fromRecords && onObserversUpdated(updateHints);

    return updateHints;
  };

  const onSizeChanged = ({
    _sizeChanged,
    _directionIsRTLCache,
    _appear,
  }: SizeObserverCallbackParams) => {
    const updateFn = !_sizeChanged || _appear ? onObserversUpdated : onObserversUpdatedDebounced;
    const [directionIsRTL, directionIsRTLChanged] = _directionIsRTLCache || [];

    assignDeep(state, { _directionIsRTL: directionIsRTL || false });
    updateFn({ _sizeChanged, _appear, _directionChanged: directionIsRTLChanged });
  };

  const onContentMutation = (
    contentChangedThroughEvent: boolean,
    fromRecords?: true
  ): ObserversSetupUpdateHints => {
    const [, contentSizeChanged] = updateContentSizeCache();
    const updateHints = {
      _contentMutation: contentSizeChanged,
    };
    // if contentChangedThroughEvent is true its already debounced
    const updateFn = contentChangedThroughEvent ? onObserversUpdated : onObserversUpdatedDebounced;

    contentSizeChanged && !fromRecords && updateFn(updateHints);

    return updateHints;
  };

  const onHostMutation = (
    targetChangedAttrs: string[],
    targetStyleChanged: boolean,
    fromRecords?: true
  ): ObserversSetupUpdateHints => {
    const updateHints = { _hostMutation: targetStyleChanged };

    if (targetStyleChanged && !fromRecords) {
      onObserversUpdatedDebounced(updateHints);
    } else if (!_viewportIsTarget) {
      updateViewportAttrsFromHost(targetChangedAttrs);
    }

    return updateHints;
  };

  const [constructTrinsicObserver, updateTrinsicObserver] =
    _content || !_flexboxGlue ? createTrinsicObserver(_host, onTrinsicChanged) : [];

  const constructSizeObserver =
    !_viewportIsTarget &&
    createSizeObserver(_host, onSizeChanged, {
      _appear: true,
      _direction: true,
    });

  const [constructHostMutationObserver, updateHostMutationObserver] = createDOMObserver(
    _host,
    false,
    onHostMutation,
    {
      _styleChangingAttributes: baseStyleChangingAttrs,
      _attributes: baseStyleChangingAttrs.concat(viewportAttrsFromTarget),
    }
  );

  let prevContentRect: DOMRectReadOnly | undefined;
  const viewportIsTargetResizeObserver =
    _viewportIsTarget &&
    ResizeObserverConstructor &&
    new ResizeObserverConstructor((entries) => {
      const currRContentRect = entries[entries.length - 1].contentRect;
      const hasDimensions = domRectHasDimensions(currRContentRect);
      const hadDimensions = domRectHasDimensions(prevContentRect);
      const _appear = !hadDimensions && hasDimensions;

      onSizeChanged({ _sizeChanged: true, _appear });
      prevContentRect = currRContentRect;
    });

  return [
    () => {
      // order is matter!
      updateViewportAttrsFromHost();
      viewportIsTargetResizeObserver && viewportIsTargetResizeObserver.observe(_host);
      const destroySizeObserver = constructSizeObserver && constructSizeObserver();
      const destroyTrinsicObserver = constructTrinsicObserver && constructTrinsicObserver();
      const destroyHostMutationObserver = constructHostMutationObserver();

      return () => {
        viewportIsTargetResizeObserver && viewportIsTargetResizeObserver.disconnect();
        destroySizeObserver && destroySizeObserver();
        destroyTrinsicObserver && destroyTrinsicObserver();
        destroyContentMutationObserver && destroyContentMutationObserver();
        destroyHostMutationObserver();
      };
    },
    ({ _checkOption, _takeRecords }) => {
      const updateHints: ObserversSetupUpdateHints = {};
      const [ignoreMutation] = _checkOption(`${strUpdateDot}ignoreMutation`);
      const [attributes, attributesChanged] = _checkOption(`${strUpdateDot}attributes`);
      const [elementEvents, elementEventsChanged] = _checkOption(`${strUpdateDot}elementEvents`);
      const [debounceValue, debounceChanged] = _checkOption(`${strUpdateDot}debounce`);
      const contentMutationObserverChanged = elementEventsChanged || attributesChanged;
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
            _attributes: contentMutationObserverAttr.concat(attributes || []),
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

      if (_takeRecords) {
        const hostUpdateResult = updateHostMutationObserver();
        const trinsicUpdateResult = updateTrinsicObserver && updateTrinsicObserver();
        const contentUpdateResult =
          updateContentMutationObserver && updateContentMutationObserver();

        hostUpdateResult &&
          assignDeep(
            updateHints,
            onHostMutation(hostUpdateResult[0], hostUpdateResult[1], _takeRecords)
          );

        trinsicUpdateResult &&
          assignDeep(updateHints, onTrinsicChanged(trinsicUpdateResult[0], _takeRecords));

        contentUpdateResult &&
          assignDeep(updateHints, onContentMutation(contentUpdateResult[0], _takeRecords));
      }

      return updateHints;
    },
    state,
  ];
};
