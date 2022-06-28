import {
  diffClass,
  debounce,
  isArray,
  isNumber,
  each,
  indexOf,
  isString,
  attr,
  removeAttr,
  CacheValues,
} from 'support';
import { getEnvironment } from 'environment';
import { createSizeObserver, SizeObserverCallbackParams } from 'observers/sizeObserver';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { createDOMObserver, DOMObserver } from 'observers/domObserver';
import type { SetupUpdateCheckOption } from 'setups';
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

// const hostSelector = `.${classNameHost}`;

// TODO: observer textarea attrs if textarea
// TODO: test _ignoreContentChange & _ignoreNestedTargetChange for content dom observer
// TODO: test _ignoreTargetChange for target dom observer

// const viewportSelector = `.${classNameViewport}`;
// const contentSelector = `.${classNameContent}`;
const ignorePrefix = 'os-';
const viewportAttrsFromTarget = ['tabindex'];
const baseStyleChangingAttrsTextarea = ['wrap', 'cols', 'rows'];
const baseStyleChangingAttrs = ['id', 'class', 'style', 'open'];

const ignoreTargetChange = (
  target: Node,
  attrName: string,
  oldValue: string | null,
  newValue: string | null
) => {
  if (attrName === 'class' && oldValue && newValue) {
    const diff = diffClass(oldValue, newValue);
    return !!diff.find((addedOrRemovedClass) => addedOrRemovedClass.indexOf(ignorePrefix) !== 0);
  }
  return false;
};

type ExcludeFromTuple<T extends readonly any[], E> = T extends [infer F, ...infer R]
  ? [F] extends [E]
    ? ExcludeFromTuple<R, E>
    : [F, ...ExcludeFromTuple<R, E>]
  : [];

export const createStructureSetupObservers = (
  structureSetupElements: StructureSetupElementsObj,
  structureSetupUpdate: (
    ...args: ExcludeFromTuple<Parameters<StructureSetupUpdate>, Parameters<StructureSetupUpdate>[0]>
  ) => any
): StructureSetupObservers => {
  let debounceTimeout: number | false | undefined;
  let debounceMaxDelay: number | false | undefined;
  let contentMutationObserver: DOMObserver | undefined;
  const { _host, _viewport, _content, _isTextarea } = structureSetupElements;
  const { _nativeScrollbarStyling, _flexboxGlue } = getEnvironment();
  const contentMutationObserverAttr = _isTextarea
    ? baseStyleChangingAttrsTextarea
    : baseStyleChangingAttrs.concat(baseStyleChangingAttrsTextarea);
  const structureSetupUpdateWithDebouncedAdaptiveUpdateHints = debounce(structureSetupUpdate, {
    _timeout: () => debounceTimeout,
    _maxDelay: () => debounceMaxDelay,
    _mergeParams(prev, curr) {
      const {
        _sizeChanged: prevSizeChanged,
        _hostMutation: prevHostMutation,
        _contentMutation: prevContentMutation,
      } = prev[0];
      const {
        _sizeChanged: currSizeChanged,
        _hostMutation: currvHostMutation,
        _contentMutation: currContentMutation,
      } = curr[0];
      const merged: [Partial<StructureSetupUpdateHints>] = [
        {
          _sizeChanged: prevSizeChanged || currSizeChanged,
          _hostMutation: prevHostMutation || currvHostMutation,
          _contentMutation: prevContentMutation || currContentMutation,
        },
      ];

      return merged;
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
  const onTrinsicChanged = (heightIntrinsic: CacheValues<boolean>) => {
    structureSetupUpdate({
      _heightIntrinsic: heightIntrinsic,
    });
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

    updateFn({
      _sizeChanged,
      _directionIsRTL: _directionIsRTLCache,
    });
  };
  const onContentMutation = (contentChangedTroughEvent: boolean) => {
    // if contentChangedTroughEvent is true its already debounced
    const updateFn = contentChangedTroughEvent
      ? structureSetupUpdate
      : structureSetupUpdateWithDebouncedAdaptiveUpdateHints;
    updateFn({
      _contentMutation: true,
    });
  };
  const onHostMutation = (targetChangedAttrs: string[], targetStyleChanged: boolean) => {
    if (targetStyleChanged) {
      structureSetupUpdateWithDebouncedAdaptiveUpdateHints({
        _hostMutation: true,
      });
    } else {
      updateViewportAttrsFromHost(targetChangedAttrs);
    }
  };

  const destroyTrinsicObserver =
    (_content || !_flexboxGlue) && createTrinsicObserver(_host, onTrinsicChanged);
  const destroySizeObserver = createSizeObserver(_host, onSizeChanged, {
    _appear: true,
    _direction: !_nativeScrollbarStyling,
  });
  const [destroyHostMutationObserver] = createDOMObserver(_host, false, onHostMutation, {
    _styleChangingAttributes: baseStyleChangingAttrs,
    _attributes: baseStyleChangingAttrs.concat(viewportAttrsFromTarget),
    _ignoreTargetChange: ignoreTargetChange,
  });

  updateViewportAttrsFromHost();

  return [
    (checkOption) => {
      const [elementEvents, elementEventsChanged] = checkOption<Array<[string, string]> | null>(
        'updating.elementEvents'
      );
      const [attributes, attributesChanged] = checkOption<string[] | null>('updating.attributes');
      const [debounceValue, debounceChanged] = checkOption<Array<number> | number | null>(
        'updating.debounce'
      );
      const updateContentMutationObserver = elementEventsChanged || attributesChanged;

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
            _ignoreNestedTargetChange: ignoreTargetChange,
            // _nestedTargetSelector: hostSelector,
            /*
          _ignoreContentChange: (mutation, isNestedTarget) => {
            const { target, attributeName } = mutation;
            return isNestedTarget
              ? false
              : attributeName
              ? liesBetween(target as Element, hostSelector, viewportSelector) || liesBetween(target as Element, hostSelector, contentSelector)
              : false;
          },
          */
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
      destroySizeObserver();
      destroyHostMutationObserver();
    },
  ];
};
