import {
  debounce,
  isArray,
  isNumber,
  each,
  indexOf,
  isString,
  attr,
  removeAttr,
  CacheValues,
  keys,
  liesBetween,
  scrollSize,
  equalWH,
  createCache,
  WH,
  fractionalSize,
  isFunction,
  ResizeObserverConstructor,
} from 'support';
import { getEnvironment } from 'environment';
import {
  dataAttributeHost,
  dataValueHostOverflowVisible,
  classNameViewport,
  classNameOverflowVisible,
} from 'classnames';
import { createSizeObserver, SizeObserverCallbackParams } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { createDOMObserver, DOMObserver } from 'observers/domObserver';
import type { SetupState, SetupUpdateCheckOption } from 'setups';
import type { StructureSetupState } from 'setups/structureSetup';
import type { StructureSetupElementsObj } from 'setups/structureSetup/structureSetup.elements';
import type {
  StructureSetupUpdate,
  StructureSetupUpdateHints,
} from 'setups/structureSetup/structureSetup.update';

export type StructureSetupObserversUpdate = (checkOption: SetupUpdateCheckOption) => void;

export type StructureSetupObservers = [
  updateObserverOptions: StructureSetupObserversUpdate,
  destroy: () => void
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
  state: SetupState<StructureSetupState>,
  structureSetupUpdate: (
    ...args: ExcludeFromTuple<Parameters<StructureSetupUpdate>, Parameters<StructureSetupUpdate>[0]>
  ) => any
): StructureSetupObservers => {
  let debounceTimeout: number | false | undefined;
  let debounceMaxDelay: number | false | undefined;
  let contentMutationObserver: DOMObserver | undefined;
  const [, setState] = state;
  const {
    _host,
    _viewport,
    _content,
    _isTextarea,
    _viewportIsTarget,
    _viewportHasClass,
    _viewportAddRemoveClass,
  } = structureSetupElements;
  const { _nativeScrollbarStyling, _flexboxGlue } = getEnvironment();

  const [updateContentSizeCache] = createCache<WH<number>>(
    {
      _equal: equalWH,
      _initialValue: { w: 0, h: 0 },
    },
    () => {
      const has = _viewportHasClass(classNameOverflowVisible, dataValueHostOverflowVisible);
      has && _viewportAddRemoveClass(classNameOverflowVisible, dataValueHostOverflowVisible);

      const contentScroll = scrollSize(_content);
      const viewportScroll = scrollSize(_viewport);
      const fractional = fractionalSize(_viewport);

      has && _viewportAddRemoveClass(classNameOverflowVisible, dataValueHostOverflowVisible, true);
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
  const onTrinsicChanged = (heightIntrinsicCache: CacheValues<boolean>) => {
    const [heightIntrinsic, heightIntrinsicChanged] = heightIntrinsicCache;
    setState({ _heightIntrinsic: heightIntrinsic });
    structureSetupUpdate({ _heightIntrinsicChanged: heightIntrinsicChanged });
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
  const onContentMutation = (contentChangedTroughEvent: boolean) => {
    const [, contentSizeChanged] = updateContentSizeCache();
    // if contentChangedTroughEvent is true its already debounced
    const updateFn = contentChangedTroughEvent
      ? structureSetupUpdate
      : structureSetupUpdateWithDebouncedAdaptiveUpdateHints;

    if (contentSizeChanged) {
      updateFn({
        _contentMutation: true,
      });
    }
  };
  const onHostMutation = (targetChangedAttrs: string[], targetStyleChanged: boolean) => {
    if (targetStyleChanged) {
      structureSetupUpdateWithDebouncedAdaptiveUpdateHints({
        _hostMutation: true,
      });
    } else if (!_viewportIsTarget) {
      updateViewportAttrsFromHost(targetChangedAttrs);
    }
  };

  const destroyTrinsicObserver =
    (_content || !_flexboxGlue) && createTrinsicObserver(_host, onTrinsicChanged);
  const destroySizeObserver =
    !_viewportIsTarget &&
    createSizeObserver(_host, onSizeChanged, {
      _appear: true,
      _direction: !_nativeScrollbarStyling,
    });
  const [destroyHostMutationObserver] = createDOMObserver(_host, false, onHostMutation, {
    _styleChangingAttributes: baseStyleChangingAttrs,
    _attributes: baseStyleChangingAttrs.concat(viewportAttrsFromTarget),
  });

  const viewportIsTargetResizeObserver =
    _viewportIsTarget &&
    new ResizeObserverConstructor!(onSizeChanged.bind(0, { _sizeChanged: true }));

  viewportIsTargetResizeObserver && viewportIsTargetResizeObserver.observe(_host);
  updateViewportAttrsFromHost();

  return [
    (checkOption) => {
      const [ignoreMutation] = checkOption<string[] | null>('updating.ignoreMutation');
      const [attributes, attributesChanged] = checkOption<string[] | null>('updating.attributes');
      const [elementEvents, elementEventsChanged] = checkOption<Array<[string, string]> | null>(
        'updating.elementEvents'
      );
      const [debounceValue, debounceChanged] = checkOption<Array<number> | number | null>(
        'updating.debounce'
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
            _styleChangingAttributes: contentMutationObserverAttr.concat(attributes || []),
            _attributes: contentMutationObserverAttr.concat(attributes || []),
            _eventContentChange: elementEvents,
            _nestedTargetSelector: hostSelector,
            _ignoreContentChange: (mutation, isNestedTarget) => {
              const { target, attributeName } = mutation;
              const ignore =
                !isNestedTarget && attributeName
                  ? liesBetween(target as Element, hostSelector, viewportSelector)
                  : false;
              return ignore || !!ignoreMutationFromOptions(mutation);
            },
          }
        );
      }

      if (debounceChanged) {
        structureSetupUpdateWithDebouncedAdaptiveUpdateHints._flush();
        if (isArray(debounceValue)) {
          const timeout = debounceValue[0];
          const maxWait = debounceValue[1];
          debounceTimeout = isNumber(timeout) ? timeout : false;
          debounceMaxDelay = isNumber(maxWait) ? maxWait : false;
        } else if (isNumber(debounceValue)) {
          debounceTimeout = debounceValue;
          debounceMaxDelay = false;
        } else {
          debounceTimeout = false;
          debounceMaxDelay = false;
        }
      }
    },
    () => {
      contentMutationObserver && contentMutationObserver[0](); // destroy
      destroyTrinsicObserver && destroyTrinsicObserver();
      destroySizeObserver && destroySizeObserver();
      viewportIsTargetResizeObserver && viewportIsTargetResizeObserver.disconnect();
      destroyHostMutationObserver();
    },
  ];
};
