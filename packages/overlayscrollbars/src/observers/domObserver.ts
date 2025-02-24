/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  each,
  noop,
  debounce,
  MutationObserverConstructor,
  addEventListener,
  is,
  find,
  push,
  runEachAndClear,
  bind,
  isEmptyArray,
  deduplicateArray,
  inArray,
  concat,
  getAttr,
  isString,
} from '../support';

type DOMContentObserverCallback = (contentChangedThroughEvent: boolean) => any;

type DOMTargetObserverCallback = (targetChangedAttrs: string[], targetStyleChanged: boolean) => any;

interface DOMObserverOptionsBase {
  _attributes?: string[];
  /**
   * A function which can ignore a changed attribute if it returns true.
   * for DOMTargetObserver this applies to the changes to the observed target
   * for DOMContentObserver this applies to changes to nested targets -> nested targets are elements which match the "_nestedTargetSelector" selector
   */
  _ignoreTargetChange?: DOMObserverIgnoreTargetChange;
}

interface DOMContentObserverOptions extends DOMObserverOptionsBase {
  _eventContentChange?: DOMObserverEventContentChange; // [selector, eventname(s) | function returning eventname(s)] -> eventnames divided by whitespaces
  _nestedTargetSelector?: string;
  _ignoreContentChange?: DOMObserverIgnoreContentChange; // function which will prevent marking certain dom changes as content change if it returns true
}

interface DOMTargetObserverOptions extends DOMObserverOptionsBase {
  /**
   * Marks certain attributes as style changing, should be a subset of the _attributes prop.
   * Used to set the "targetStyleChanged" param in the DOMTargetObserverCallback.
   */
  _styleChangingAttributes?: string[] | readonly string[];
}

type ContentChangeArrayItem = [selector?: string, eventNames?: string] | null | undefined;

export type DOMObserverEventContentChange =
  | Array<ContentChangeArrayItem>
  | false
  | null
  | undefined;

export type DOMObserverIgnoreContentChange = (
  mutation: MutationRecord,
  isNestedTarget: boolean,
  domObserverTarget: HTMLElement,
  domObserverOptions?: DOMContentObserverOptions
) => boolean;

export type DOMObserverIgnoreTargetChange = (
  target: Node,
  attributeName: string,
  oldAttributeValue: string | null,
  newAttributeValue: string | null
) => boolean;

export type DOMObserverCallback<ContentObserver extends boolean> = ContentObserver extends true
  ? DOMContentObserverCallback
  : DOMTargetObserverCallback;

export type DOMObserverOptions<ContentObserver extends boolean> = ContentObserver extends true
  ? DOMContentObserverOptions
  : DOMTargetObserverOptions;

export type DOMObserver<ContentObserver extends boolean> = [
  construct: () => () => void,
  update: () => void | false | Parameters<DOMObserverCallback<ContentObserver>>,
];

type EventContentChangeUpdateElement = (
  getElements?: (selector: string) => Node[],
  removed?: boolean
) => void;
type EventContentChange = [destroy: () => void, updateElements: EventContentChangeUpdateElement];

/**
 * Creates a set of helper functions to observe events of elements inside the target element.
 * @param target The target element of which the children elements shall be observed. (not only direct children but also nested ones)
 * @param eventContentChange The event content change array. (array of tuples: selector and eventname(s))
 * @param callback Callback which is called if one of the elements emits the corresponding event.
 * @returns A object which contains a set of helper functions to destroy and update the observation of elements.
 */
const createEventContentChange = (
  target: HTMLElement,
  callback: (...args: any) => any,
  eventContentChange?: DOMObserverEventContentChange
): EventContentChange => {
  let destroyed = false;
  const map = eventContentChange ? new WeakMap<Node, (() => any)[]>() : false; // weak map to prevent memory leak for detached elements
  const destroy = () => {
    destroyed = true;
  };
  const updateElements: EventContentChangeUpdateElement = (getElements) => {
    if (map && eventContentChange) {
      const eventElmList = eventContentChange.map((item) => {
        const [selector, eventNames] = item || [];
        const elements = eventNames && selector ? (getElements || find)(selector, target) : [];
        return [elements, eventNames] as const;
      });

      each(eventElmList, (item) =>
        each(item[0], (elm) => {
          const eventNames = item[1];
          const entries = map.get(elm) || [];
          const isTargetChild = target.contains(elm);

          if (isTargetChild && eventNames) {
            const removeListener = addEventListener(elm, eventNames, (event: Event) => {
              if (destroyed) {
                removeListener();
                map.delete(elm);
              } else {
                callback(event);
              }
            });
            map.set(elm, push(entries, removeListener));
          } else {
            runEachAndClear(entries);
            map.delete(elm);
          }
        })
      );
    }
  };

  updateElements();

  return [destroy, updateElements];
};

/**
 * Creates a DOM observer which observes DOM changes to either the target element or its children.
 * @param target The element which shall be observed.
 * @param isContentObserver Whether this observer is just observing the target or just the targets children. (not only direct children but also nested ones)
 * @param callback The callback which gets called if a change was detected.
 * @param options The options for DOM change detection.
 * @returns A object which represents the instance of the DOM observer.
 */
export const createDOMObserver = <ContentObserver extends boolean>(
  target: HTMLElement,
  isContentObserver: ContentObserver,
  callback: DOMObserverCallback<ContentObserver>,
  options?: DOMObserverOptions<ContentObserver>
): DOMObserver<ContentObserver> => {
  let isConnected = false;
  const {
    _attributes,
    _styleChangingAttributes,
    _eventContentChange,
    _nestedTargetSelector,
    _ignoreTargetChange,
    _ignoreContentChange,
  } = (options as DOMContentObserverOptions & DOMTargetObserverOptions) || {};
  const debouncedEventContentChange = debounce(
    () => isConnected && (callback as DOMContentObserverCallback)(true),
    { _debounceTiming: 33, _maxDebounceTiming: 99 }
  );
  const [destroyEventContentChange, updateEventContentChangeElements] = createEventContentChange(
    target,
    debouncedEventContentChange,
    _eventContentChange
  );

  // MutationObserver
  const finalAttributes = _attributes || [];
  const finalStyleChangingAttributes = _styleChangingAttributes || [];
  const observedAttributes = concat(finalAttributes, finalStyleChangingAttributes);
  const observerCallback = (
    fromRecords: boolean,
    mutations: MutationRecord[]
  ): void | Parameters<DOMObserverCallback<ContentObserver>> => {
    if (!isEmptyArray(mutations)) {
      const ignoreTargetChange = _ignoreTargetChange || noop;
      const ignoreContentChange = _ignoreContentChange || noop;
      const totalChangedNodes: Node[] = [];
      const targetChangedAttrs: string[] = [];
      let targetStyleChanged: boolean | '' | null | undefined = false;
      let contentChanged: boolean | '' | null | undefined = false;
      let childListChanged: boolean | '' | null | undefined = false;

      each(mutations, (mutation) => {
        const {
          attributeName,
          target: mutationTarget,
          type,
          oldValue,
          addedNodes,
          removedNodes,
        } = mutation;
        const isAttributesType = type === 'attributes';
        const isChildListType = type === 'childList';
        const targetIsMutationTarget = target === mutationTarget;
        const isAttrChange = isAttributesType && attributeName;
        const newValue =
          isAttrChange && getAttr(mutationTarget as HTMLElement, attributeName || '');
        // narrow down attributeValue type to `string` or `null` but don't overwrite `<empty string>` with `null`
        const attributeValue = isString(newValue) ? newValue : null;
        const attributeChanged = isAttrChange && oldValue !== attributeValue;
        const styleChangingAttrChanged =
          inArray(finalStyleChangingAttributes, attributeName) && attributeChanged;

        // if is content observer and something changed in children
        if (isContentObserver && (isChildListType || !targetIsMutationTarget)) {
          const contentAttrChanged = isAttributesType && attributeChanged;
          const isNestedTarget =
            contentAttrChanged &&
            _nestedTargetSelector &&
            is(mutationTarget, _nestedTargetSelector);
          const baseAssertion = isNestedTarget
            ? !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue)
            : !isAttributesType || contentAttrChanged;
          const contentFinalChanged =
            baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);

          each(addedNodes, (node) => push(totalChangedNodes, node));
          each(removedNodes, (node) => push(totalChangedNodes, node));

          contentChanged = contentChanged || contentFinalChanged;
          childListChanged = childListChanged || isChildListType;
        }
        // if is target observer and target attr changed
        if (
          !isContentObserver &&
          targetIsMutationTarget &&
          attributeChanged &&
          !ignoreTargetChange(mutationTarget, attributeName!, oldValue, attributeValue)
        ) {
          push(targetChangedAttrs, attributeName);
          targetStyleChanged = targetStyleChanged || styleChangingAttrChanged;
        }
      });

      // adds / removes the new elements from the event content change
      updateEventContentChangeElements((selector: string) =>
        deduplicateArray(totalChangedNodes).reduce<Node[]>((arr, node) => {
          push(arr, find(selector, node));
          return is(node, selector) ? push(arr, node) : arr;
        }, [])
      );

      if (isContentObserver) {
        if (!fromRecords && contentChanged) {
          (callback as DOMContentObserverCallback)(false);
        }
        return [false] satisfies Parameters<DOMObserverCallback<true>> as Parameters<
          DOMObserverCallback<ContentObserver>
        >;
      }

      if (!isEmptyArray(targetChangedAttrs) || targetStyleChanged) {
        const args = [
          deduplicateArray(targetChangedAttrs),
          targetStyleChanged,
        ] satisfies Parameters<DOMTargetObserverCallback> & Parameters<DOMObserverCallback<false>>;

        if (!fromRecords) {
          (callback as DOMTargetObserverCallback).apply(0, args);
        }

        return args as Parameters<DOMObserverCallback<ContentObserver>>;
      }
    }
  };
  const mutationObserver: MutationObserver = new MutationObserverConstructor!(
    bind(observerCallback, false)
  );

  return [
    () => {
      mutationObserver.observe(target, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: observedAttributes,
        subtree: isContentObserver,
        childList: isContentObserver,
        characterData: isContentObserver,
      });
      isConnected = true;

      return () => {
        if (isConnected) {
          destroyEventContentChange();
          mutationObserver.disconnect();
          isConnected = false;
        }
      };
    },
    () => {
      if (isConnected) {
        debouncedEventContentChange._flush();
        return observerCallback(true, mutationObserver.takeRecords());
      }
    },
  ];
};
