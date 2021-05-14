import {
  each,
  noop,
  debounce,
  indexOf,
  isString,
  MutationObserverConstructor,
  isEmptyArray,
  on,
  off,
  attr,
  is,
  find,
  push,
  isUndefined,
} from 'support';

type StringNullUndefined = string | null | undefined;

type DOMContentObserverCallback = (contentChangedTroughEvent: boolean) => any;

type DOMTargetObserverCallback = (targetChangedAttrs: string[], targetStyleChanged: boolean) => any;

interface DOMObserverOptionsBase {
  _attributes?: string[];
  _styleChangingAttributes?: string[];
}

interface DOMContentObserverOptions extends DOMObserverOptionsBase {
  _eventContentChange?: DOMObserverEventContentChange; // [selector, eventname(s) | function returning eventname(s)] -> eventnames divided by whitespaces
  _nestedTargetSelector?: string;
  _ignoreContentChange?: DOMObserverIgnoreContentChange; // function which will prevent marking certain dom changes as content change if it returns true
  _ignoreNestedTargetChange?: DOMObserverIgnoreTargetChange; // a function which will prevent marking certain attributes as changed on nested targets if it returns true
}

interface DOMTargetObserverOptions extends DOMObserverOptionsBase {
  _ignoreTargetChange?: DOMObserverIgnoreTargetChange; // a function which will prevent marking certain attributes as changed if it returns true
}

type ContentChangeArrayItem = [StringNullUndefined, StringNullUndefined] | null | undefined;

export type DOMObserverEventContentChange = Array<ContentChangeArrayItem> | false | null | undefined;

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

export type DOMObserverOptions<ContentObserver extends boolean> = ContentObserver extends true ? DOMContentObserverOptions : DOMTargetObserverOptions;

export interface DOMObserver {
  _destroy: () => void;
  _update: () => void;
}

/**
 * Creates a set of helper functions to observe events of elements inside the target element.
 * @param target The target element of which the children elements shall be observed. (not only direct children but also nested ones)
 * @param eventContentChange The event content change array. (array of tuples: selector and eventname(s))
 * @param callback Callback which is called if one of the elements emits the corresponding event.
 * @returns A object which contains a set of helper functions to destroy and update the observation of elements.
 */
const createEventContentChange = (target: Element, eventContentChange: DOMObserverEventContentChange, callback: (...args: any) => any) => {
  let map: Map<Node, string> | undefined;
  const _destroy = () => {
    if (map) {
      map.forEach((eventName: string, elm: Node) => off(elm, eventName, callback));
      map.clear();
    }
  };
  const _updateElements = (getElements?: (selector: string) => Node[]) => {
    if (map && eventContentChange) {
      const eventElmList = eventContentChange.reduce<Array<[Node[], string]>>((arr, item) => {
        if (item) {
          const selector = item[0];
          const eventNames = item[1];
          const elements = eventNames && selector && (getElements ? getElements(selector) : find(selector, target));

          if (elements && elements.length && eventNames && isString(eventNames)) {
            push(arr, [elements, eventNames.trim()], true);
          }
        }
        return arr;
      }, []);

      each(eventElmList, (item) =>
        each(item[0], (elm) => {
          const eventNames = item[1];
          const registredEventNames = map!.get(elm);
          const newEntry = isUndefined(registredEventNames);
          const changingExistingEntry = !newEntry && eventNames !== registredEventNames;
          const finalEventNames = changingExistingEntry ? `${registredEventNames} ${eventNames}` : eventNames;

          if (changingExistingEntry) {
            off(elm, registredEventNames!, callback);
          }

          map!.set(elm, finalEventNames);
          on(elm, finalEventNames, callback);
        })
      );
    }
  };

  if (eventContentChange) {
    map = map || new Map<Node, string>();
    _destroy();
    _updateElements();
  }

  return {
    _destroy,
    _updateElements,
  };
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
): DOMObserver => {
  let isConnected = false;
  const {
    _attributes,
    _styleChangingAttributes,
    _eventContentChange,
    _nestedTargetSelector,
    _ignoreTargetChange,
    _ignoreNestedTargetChange,
    _ignoreContentChange,
  } = (options as DOMContentObserverOptions & DOMTargetObserverOptions) || {};
  const { _destroy: destroyEventContentChange, _updateElements: updateEventContentChangeElements } = createEventContentChange(
    target,
    isContentObserver && _eventContentChange,
    debounce(
      () => {
        if (isConnected) {
          (callback as DOMContentObserverCallback)(true);
        }
      },
      { _timeout: 33, _maxDelay: 99 }
    )
  );

  // MutationObserver
  const finalAttributes = _attributes || [];
  const finalStyleChangingAttributes = _styleChangingAttributes || [];
  const observedAttributes = finalAttributes.concat(finalStyleChangingAttributes);
  const observerCallback = (mutations: MutationRecord[]) => {
    const ignoreTargetChange = (isContentObserver ? _ignoreNestedTargetChange : _ignoreTargetChange) || noop;
    const ignoreContentChange = _ignoreContentChange || noop;
    const targetChangedAttrs: string[] = [];
    const totalAddedNodes: Node[] = [];
    let targetStyleChanged = false;
    let contentChanged = false;
    let childListChanged = false;
    each(mutations, (mutation) => {
      const { attributeName, target: mutationTarget, type, oldValue, addedNodes } = mutation;
      const isAttributesType = type === 'attributes';
      const isChildListType = type === 'childList';
      const targetIsMutationTarget = target === mutationTarget;
      const attributeValue = isAttributesType && isString(attributeName) ? attr(mutationTarget as HTMLElement, attributeName!) : 0;
      const attributeChanged = attributeValue !== 0 && oldValue !== attributeValue;
      const styleChangingAttrChanged = indexOf(finalStyleChangingAttributes, attributeName) > -1 && attributeChanged;

      // if is content observer and something changed in children
      if (isContentObserver && !targetIsMutationTarget) {
        const notOnlyAttrChanged = !isAttributesType;
        const contentAttrChanged = isAttributesType && styleChangingAttrChanged;
        const isNestedTarget = contentAttrChanged && _nestedTargetSelector && is(mutationTarget, _nestedTargetSelector);
        const baseAssertion = isNestedTarget
          ? !ignoreTargetChange(mutationTarget, attributeName!, oldValue, attributeValue as string | null)
          : notOnlyAttrChanged || contentAttrChanged;
        const contentFinalChanged = baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);

        push(totalAddedNodes, addedNodes);

        contentChanged = contentChanged || contentFinalChanged;
        childListChanged = childListChanged || isChildListType;
      }
      // if is target observer and target attr changed
      if (
        !isContentObserver &&
        targetIsMutationTarget &&
        attributeChanged &&
        !ignoreTargetChange(mutationTarget, attributeName!, oldValue, attributeValue as string | null)
      ) {
        push(targetChangedAttrs, attributeName!);
        targetStyleChanged = targetStyleChanged || styleChangingAttrChanged;
      }
    });

    if (childListChanged && !isEmptyArray(totalAddedNodes)) {
      // adds / removes the new elements from the event content change
      updateEventContentChangeElements((selector) =>
        totalAddedNodes.reduce<Node[]>((arr, node) => {
          push(arr, find(selector, node));
          return is(node, selector) ? push(arr, node) : arr;
        }, [])
      );
    }

    if (isContentObserver) {
      contentChanged && (callback as DOMContentObserverCallback)(false);
    } else if (!isEmptyArray(targetChangedAttrs) || targetStyleChanged) {
      (callback as DOMTargetObserverCallback)(targetChangedAttrs, targetStyleChanged);
    }
  };
  const mutationObserver: MutationObserver = new MutationObserverConstructor!(observerCallback);

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

  return {
    _destroy: () => {
      if (isConnected) {
        destroyEventContentChange();
        mutationObserver.disconnect();
        isConnected = false;
      }
    },
    _update: () => {
      if (isConnected) {
        observerCallback(mutationObserver.takeRecords());
      }
    },
  };
};
