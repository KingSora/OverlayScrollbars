import {
  each,
  noop,
  debounce,
  indexOf,
  isString,
  MutationObserverConstructor,
  isEmptyArray,
  on,
  attr,
  is,
  find,
  push,
  from,
  runEachAndClear,
} from '~/support';

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
  _styleChangingAttributes?: string[];
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
  destroy: () => void,
  update: () => void | false | Parameters<DOMObserverCallback<ContentObserver>>
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
  let map: WeakMap<Node, (() => any)[]> | undefined; // weak map to prevent memory leak for detached elements
  let destroyed = false;
  const destroy = () => {
    destroyed = true;
  };
  const updateElements: EventContentChangeUpdateElement = (getElements) => {
    if (eventContentChange) {
      const eventElmList = eventContentChange.reduce<Array<[Node[], string]>>((arr, item) => {
        if (item) {
          const [selector, eventNames] = item;
          const elements =
            eventNames &&
            selector &&
            (getElements ? getElements(selector) : find(selector, target));

          if (elements && elements.length && eventNames && isString(eventNames)) {
            push(arr, [elements, eventNames.trim()], true);
          }
        }
        return arr;
      }, []);

      each(eventElmList, (item) =>
        each(item[0], (elm) => {
          const eventNames = item[1];
          const entries = map!.get(elm) || [];
          const isTargetChild = target.contains(elm);

          if (isTargetChild) {
            const off = on(elm, eventNames, (event: Event) => {
              if (destroyed) {
                off();
                map!.delete(elm);
              } else {
                callback(event);
              }
            });
            map!.set(elm, push(entries, off));
          } else {
            runEachAndClear(entries);
            map!.delete(elm);
          }
        })
      );
    }
  };

  if (eventContentChange) {
    map = new WeakMap();
    updateElements();
  }

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
    () => {
      if (isConnected) {
        (callback as DOMContentObserverCallback)(true);
      }
    },
    { _timeout: 33, _maxDelay: 99 }
  );
  const [destroyEventContentChange, updateEventContentChangeElements] = createEventContentChange(
    target,
    debouncedEventContentChange,
    _eventContentChange
  );

  // MutationObserver
  const finalAttributes = _attributes || [];
  const finalStyleChangingAttributes = _styleChangingAttributes || [];
  const observedAttributes = finalAttributes.concat(finalStyleChangingAttributes);
  const observerCallback = (
    mutations: MutationRecord[],
    fromRecords?: true
  ): void | Parameters<DOMObserverCallback<ContentObserver>> => {
    const ignoreTargetChange = _ignoreTargetChange || noop;
    const ignoreContentChange = _ignoreContentChange || noop;
    const totalChangedNodes: Set<Node> = new Set();
    const targetChangedAttrs: Set<string> = new Set();
    let targetStyleChanged = false;
    let contentChanged = false;
    let childListChanged = false;

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
      const attributeValue =
        isAttributesType && isString(attributeName)
          ? attr(mutationTarget as HTMLElement, attributeName!)
          : 0;
      const attributeChanged = attributeValue !== 0 && oldValue !== attributeValue;
      const styleChangingAttrChanged =
        indexOf(finalStyleChangingAttributes, attributeName) > -1 && attributeChanged;

      // if is content observer and something changed in children
      if (isContentObserver && (isChildListType || !targetIsMutationTarget)) {
        const notOnlyAttrChanged = !isAttributesType;
        const contentAttrChanged = isAttributesType && attributeChanged;
        const isNestedTarget =
          contentAttrChanged && _nestedTargetSelector && is(mutationTarget, _nestedTargetSelector);
        const baseAssertion = isNestedTarget
          ? !ignoreTargetChange(mutationTarget, attributeName!, oldValue, attributeValue)
          : notOnlyAttrChanged || contentAttrChanged;
        const contentFinalChanged =
          baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);

        each(addedNodes, (node) => totalChangedNodes.add(node));
        each(removedNodes, (node) => totalChangedNodes.add(node));

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
        targetChangedAttrs.add(attributeName!);
        targetStyleChanged = targetStyleChanged || styleChangingAttrChanged;
      }
    });

    // adds / removes the new elements from the event content change
    if (totalChangedNodes.size > 0) {
      updateEventContentChangeElements((selector: string) =>
        from(totalChangedNodes).reduce<Node[]>((arr, node) => {
          push(arr, find(selector, node));
          return is(node, selector) ? push(arr, node) : arr;
        }, [])
      );
    }

    if (isContentObserver) {
      !fromRecords && contentChanged && (callback as DOMContentObserverCallback)(false);
      return [false] as Parameters<DOMObserverCallback<ContentObserver>>;
    }

    if (targetChangedAttrs.size > 0 || targetStyleChanged) {
      const args: Parameters<DOMTargetObserverCallback> = [
        from(targetChangedAttrs),
        targetStyleChanged,
      ];
      !fromRecords && (callback as DOMTargetObserverCallback).apply(0, args);

      return args as Parameters<DOMObserverCallback<ContentObserver>>;
    }
  };
  const mutationObserver: MutationObserver = new MutationObserverConstructor!((mutations) =>
    observerCallback(mutations)
  );

  // Connect
  mutationObserver.observe(target, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: observedAttributes,
    subtree: isContentObserver,
    childList: isContentObserver,
    characterData: isContentObserver,
  });
  isConnected = true;

  return [
    () => {
      if (isConnected) {
        destroyEventContentChange();
        mutationObserver.disconnect();
        isConnected = false;
      }
    },
    () => {
      if (isConnected) {
        debouncedEventContentChange._flush();

        const records = mutationObserver.takeRecords();
        return !isEmptyArray(records) && observerCallback(records, true);
      }
    },
  ];
};
