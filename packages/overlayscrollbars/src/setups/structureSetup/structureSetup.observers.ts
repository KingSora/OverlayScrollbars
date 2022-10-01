import {
  debounce,
  isArray,
  isNumber,
  each,
  indexOf,
  isString,
  attr,
  removeAttr,
  keys,
  liesBetween,
  scrollSize,
  equalWH,
  createCache,
  fractionalSize,
  isFunction,
  ResizeObserverConstructor,
  closest,
  assignDeep,
  push,
  scrollLeft,
  scrollTop,
  noop,
} from '~/support';
import { getEnvironment } from '~/environment';
import {
  dataAttributeHost,
  dataValueHostOverflowVisible,
  dataValueHostUpdating,
  classNameViewport,
  classNameOverflowVisible,
  classNameScrollbar,
  classNameViewportArrange,
} from '~/classnames';
import { createSizeObserver, createTrinsicObserver, createDOMObserver } from '~/observers';
import type { DOMObserver, SizeObserverCallbackParams } from '~/observers';
import type { CacheValues, WH } from '~/support';
import type { SetupState, SetupUpdateCheckOption } from '~/setups';
import type { StructureSetupState } from '~/setups/structureSetup';
import type { StructureSetupElementsObj } from '~/setups/structureSetup/structureSetup.elements';
import type {
  StructureSetupUpdate,
  StructureSetupUpdateHints,
} from '~/setups/structureSetup/structureSetup.update';

export type StructureSetupObserversUpdate = (checkOption: SetupUpdateCheckOption) => void;

export type StructureSetupObservers = [
  destroy: () => void,
  appendElements: () => void,
  updateObservers: () => Partial<StructureSetupUpdateHints>,
  updateObserversOptions: StructureSetupObserversUpdate
];

type ExcludeFromTuple<T extends readonly any[], E> = T extends [infer F, ...infer R]
  ? [F] extends [E]
    ? ExcludeFromTuple<R, E>
    : [F, ...ExcludeFromTuple<R, E>]
  : [];

const hostSelector = `[${dataAttributeHost}]`;

// TODO: observer textarea attrs if textarea

const viewportSelector = `.${classNameViewport}`;
const viewportAttrsFromTarget = ['tabindex'];
const baseStyleChangingAttrsTextarea = ['wrap', 'cols', 'rows'];
const baseStyleChangingAttrs = ['id', 'class', 'style', 'open'];

export const createStructureSetupObservers = (
  structureSetupElements: StructureSetupElementsObj,
  setState: SetupState<StructureSetupState>[1],
  structureSetupUpdate: (
    ...args: ExcludeFromTuple<Parameters<StructureSetupUpdate>, Parameters<StructureSetupUpdate>[0]>
  ) => any
): StructureSetupObservers => {
  let debounceTimeout: number | false | undefined;
  let debounceMaxDelay: number | false | undefined;
  let contentMutationObserver: DOMObserver<true> | undefined;
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
      const hasOver = _viewportHasClass(classNameOverflowVisible, dataValueHostOverflowVisible);
      const hasVpStyle = _viewportHasClass(classNameViewportArrange, '');
      const scrollOffsetX = hasVpStyle && scrollLeft(_viewport);
      const scrollOffsetY = hasVpStyle && scrollTop(_viewport);
      _viewportAddRemoveClass(classNameOverflowVisible, dataValueHostOverflowVisible);
      _viewportAddRemoveClass(classNameViewportArrange, '');
      _viewportAddRemoveClass('', dataValueHostUpdating, true);

      const contentScroll = scrollSize(_content);
      const viewportScroll = scrollSize(_viewport);
      const fractional = fractionalSize(_viewport);

      _viewportAddRemoveClass(classNameOverflowVisible, dataValueHostOverflowVisible, hasOver);
      _viewportAddRemoveClass(classNameViewportArrange, '', hasVpStyle);
      _viewportAddRemoveClass('', dataValueHostUpdating);
      scrollLeft(_viewport, scrollOffsetX);
      scrollTop(_viewport, scrollOffsetY);
      return {
        w: viewportScroll.w + contentScroll.w + fractional.w,
        h: viewportScroll.h + contentScroll.h + fractional.h,
      };
    }
  );
  const contentMutationObserverAttr = _isTextarea
    ? baseStyleChangingAttrsTextarea
    : baseStyleChangingAttrs.concat(baseStyleChangingAttrsTextarea);
  const structureSetupUpdateWithDebouncedAdaptiveUpdateHints = debounce(structureSetupUpdate, {
    _timeout: () => debounceTimeout,
    _maxDelay: () => debounceMaxDelay,
    _mergeParams(prev, curr) {
      const [prevObj] = prev;
      const [currObj] = curr;
      return [
        keys(prevObj)
          .concat(keys(currObj))
          .reduce((obj, key) => {
            obj[key] = prevObj[key] || currObj[key];
            return obj;
          }, {}),
      ] as [Partial<StructureSetupUpdateHints>];
    },
  });

  const updateViewportAttrsFromHost = (attributes?: string[]) => {
    each(attributes || viewportAttrsFromTarget, (attribute) => {
      if (indexOf(viewportAttrsFromTarget, attribute) > -1) {
        const hostAttr = attr(_host, attribute);
        if (isString(hostAttr)) {
          attr(_viewport, attribute, hostAttr);
        } else {
          removeAttr(_viewport, attribute);
        }
      }
    });
  };
  const onTrinsicChanged = (heightIntrinsicCache: CacheValues<boolean>, fromRecords?: true) => {
    const [heightIntrinsic, heightIntrinsicChanged] = heightIntrinsicCache;
    const updateHints: Partial<StructureSetupUpdateHints> = {
      _heightIntrinsicChanged: heightIntrinsicChanged,
    };
    setState({ _heightIntrinsic: heightIntrinsic });

    !fromRecords && structureSetupUpdate(updateHints);
    return updateHints;
  };
  const onSizeChanged = ({
    _sizeChanged,
    _directionIsRTLCache,
    _appear,
  }: SizeObserverCallbackParams) => {
    const updateFn =
      !_sizeChanged || _appear
        ? structureSetupUpdate
        : structureSetupUpdateWithDebouncedAdaptiveUpdateHints;

    let directionChanged = false;
    if (_directionIsRTLCache) {
      const [directionIsRTL, directionIsRTLChanged] = _directionIsRTLCache;
      directionChanged = directionIsRTLChanged;

      setState({ _directionIsRTL: directionIsRTL });
    }

    updateFn({ _sizeChanged, _directionChanged: directionChanged });
  };
  const onContentMutation = (contentChangedThroughEvent: boolean, fromRecords?: true) => {
    const [, contentSizeChanged] = updateContentSizeCache();
    const updateHints: Partial<StructureSetupUpdateHints> = {
      _contentMutation: contentSizeChanged,
    };
    // if contentChangedThroughEvent is true its already debounced
    const updateFn = contentChangedThroughEvent
      ? structureSetupUpdate
      : structureSetupUpdateWithDebouncedAdaptiveUpdateHints;

    if (contentSizeChanged) {
      !fromRecords && updateFn(updateHints);
    }
    return updateHints;
  };
  const onHostMutation = (
    targetChangedAttrs: string[],
    targetStyleChanged: boolean,
    fromRecords?: true
  ) => {
    const updateHints: Partial<StructureSetupUpdateHints> = { _hostMutation: targetStyleChanged };
    if (targetStyleChanged) {
      !fromRecords && structureSetupUpdateWithDebouncedAdaptiveUpdateHints(updateHints);
    } else if (!_viewportIsTarget) {
      updateViewportAttrsFromHost(targetChangedAttrs);
    }
    return updateHints;
  };

  const [destroyTrinsicObserver, appendTrinsicObserver, updateTrinsicObserver] =
    _content || !_flexboxGlue ? createTrinsicObserver(_host, onTrinsicChanged) : [noop, noop, noop];
  const [destroySizeObserver, appendSizeObserver] = !_viewportIsTarget
    ? createSizeObserver(_host, onSizeChanged, {
        _appear: true,
        _direction: true,
      })
    : [noop, noop];
  const [destroyHostMutationObserver, updateHostMutationObserver] = createDOMObserver(
    _host,
    false,
    onHostMutation,
    {
      _styleChangingAttributes: baseStyleChangingAttrs,
      _attributes: baseStyleChangingAttrs.concat(viewportAttrsFromTarget),
    }
  );

  const viewportIsTargetResizeObserver =
    _viewportIsTarget &&
    ResizeObserverConstructor &&
    new ResizeObserverConstructor(onSizeChanged.bind(0, { _sizeChanged: true }));

  viewportIsTargetResizeObserver && viewportIsTargetResizeObserver.observe(_host);
  updateViewportAttrsFromHost();

  return [
    () => {
      destroyTrinsicObserver();
      destroySizeObserver();
      contentMutationObserver && contentMutationObserver[0](); // destroy
      viewportIsTargetResizeObserver && viewportIsTargetResizeObserver.disconnect();
      destroyHostMutationObserver();
    },
    () => {
      // order is matter!
      appendSizeObserver();
      appendTrinsicObserver();
    },
    () => {
      const updateHints: Partial<StructureSetupUpdateHints> = {};
      const hostUpdateResult = updateHostMutationObserver();
      const trinsicUpdateResult = updateTrinsicObserver();
      const contentUpdateResult = contentMutationObserver && contentMutationObserver[1](); // update

      if (hostUpdateResult) {
        assignDeep(
          updateHints,
          onHostMutation.apply(
            0,
            push(hostUpdateResult, true) as [
              ...updateResult: typeof hostUpdateResult,
              fromRecords: true
            ]
          )
        );
      }
      if (trinsicUpdateResult) {
        assignDeep(
          updateHints,
          onTrinsicChanged.apply(
            0,
            push(trinsicUpdateResult as any[], true) as [
              ...updateResult: typeof trinsicUpdateResult,
              fromRecords: true
            ]
          )
        );
      }
      if (contentUpdateResult) {
        assignDeep(
          updateHints,
          onContentMutation.apply(
            0,
            push(contentUpdateResult, true) as [
              ...updateResult: typeof contentUpdateResult,
              fromRecords: true
            ]
          )
        );
      }

      return updateHints;
    },
    (checkOption) => {
      const [ignoreMutation] = checkOption<string[] | null>('update.ignoreMutation');
      const [attributes, attributesChanged] = checkOption<string[] | null>('update.attributes');
      const [elementEvents, elementEventsChanged] = checkOption<Array<[string, string]> | null>(
        'update.elementEvents'
      );
      const [debounceValue, debounceChanged] = checkOption<Array<number> | number | null>(
        'update.debounce'
      );
      const updateContentMutationObserver = elementEventsChanged || attributesChanged;
      const ignoreMutationFromOptions = (mutation: MutationRecord) =>
        isFunction(ignoreMutation) && ignoreMutation(mutation);

      if (updateContentMutationObserver) {
        if (contentMutationObserver) {
          contentMutationObserver[1](); // update
          contentMutationObserver[0](); // destroy
        }
        contentMutationObserver = createDOMObserver(
          _content || _viewport,
          true,
          onContentMutation,
          {
            _attributes: contentMutationObserverAttr.concat(attributes || []),
            _eventContentChange: elementEvents,
            _nestedTargetSelector: hostSelector,
            _ignoreContentChange: (mutation, isNestedTarget) => {
              const { target, attributeName } = mutation;
              const ignore =
                !isNestedTarget && attributeName && !_viewportIsTarget
                  ? liesBetween(target, hostSelector, viewportSelector)
                  : false;
              return (
                ignore ||
                !!closest(target, `.${classNameScrollbar}`) || // ignore explicitely all scrollbar elements
                !!ignoreMutationFromOptions(mutation)
              );
            },
          }
        );
      }

      if (debounceChanged) {
        structureSetupUpdateWithDebouncedAdaptiveUpdateHints._flush();
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
    },
  ];
};
