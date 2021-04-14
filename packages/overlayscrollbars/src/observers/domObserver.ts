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
  isFunction,
} from 'support';

type StringNullUndefined = string | null | undefined;
export type DOMObserverEventContentChange =
  | Array<[StringNullUndefined, ((elms: Node[]) => string) | StringNullUndefined] | null | undefined>
  | false
  | null
  | undefined;
export type DOMObserverIgnoreContentChange = (
  mutation: MutationRecord,
  isNestedTarget: boolean,
  domObserverTarget: HTMLElement,
  domObserverOptions: DOMObserverOptions | undefined
) => boolean;
export type DOMObserverIgnoreTargetAttrChange = (
  target: Node,
  attributeName: string,
  oldAttributeValue: string | null,
  newAttributeValue: string | null
) => boolean;
export interface DOMObserverOptions {
  _observeContent?: boolean; // do observe children and trigger content change
  _attributes?: string[]; // observed attributes
  _styleChangingAttributes?: string[]; // list of attributes that trigger a contentChange or a targetStyleChange if changed
  _eventContentChange?: DOMObserverEventContentChange; // [selector, eventname]
  _nestedTargetSelector?: string;
  _ignoreTargetAttrChange?: DOMObserverIgnoreTargetAttrChange;
  _ignoreContentChange?: DOMObserverIgnoreContentChange;
}
export interface DOMObserver {
  _destroy: () => void;
  _updateEventContentChange: (newEventContentChange?: DOMObserverEventContentChange) => void;
  _update: () => void;
}

// const styleChangingAttributes = ['id', 'class', 'style', 'open'];
// const mutationObserverAttrsTextarea = ['wrap', 'cols', 'rows'];

/**
 * Creates a set of helper functions to observe events of elements inside the target element.
 * @param target The target element of which the children elements shall be observed. (not only direct children but also nested ones)
 * @param eventContentChange The event content change array. (array of tuples: selector and eventname(s))
 * @param callback Callback which is called if one of the elements emits the corresponding event.
 * @returns A object which contains a set of helper functions to destroy and update the observation of elements.
 */
const createEventContentChange = (target: Element, eventContentChange: DOMObserverEventContentChange, callback: (...args: any) => any) => {
  let map: Map<Node, string> | undefined;
  let eventContentChangeRef: DOMObserverEventContentChange;
  const addEvent = (elm: Node, eventName: string) => {
    const entry = map!.get(elm);
    const newEntry = isUndefined(entry);
    const registerEvent = () => {
      map!.set(elm, eventName);
      on(elm, eventName, callback);
    };

    if (!newEntry && eventName !== entry) {
      off(elm, entry!, callback);
      registerEvent();
    } else if (newEntry) {
      registerEvent();
    }
  };
  const _destroy = () => {
    map!.forEach((eventName: string, elm: Node) => {
      off(elm, eventName, callback);
    });
    map!.clear();
  };
  const _updateElements = (getElements?: (selector: string) => Node[]) => {
    if (eventContentChangeRef) {
      const eventElmList = eventContentChangeRef.reduce<Array<[Node[], string]>>((arr, item) => {
        if (item) {
          const selector = item[0];
          const eventName = item[1];
          const elements = eventName && selector && (getElements ? getElements(selector) : find(selector, target));

          if (elements) {
            push(arr, [elements, isFunction(eventName) ? eventName(elements) : eventName!], true);
          }
        }
        return arr;
      }, []);

      each(eventElmList, (item) => {
        const elements = item[0];
        const eventName = item[1];

        each(elements, (elm) => {
          addEvent(elm, eventName);
        });
      });
    }
  };
  const _updateEventContentChange = (newEventContentChange: DOMObserverEventContentChange) => {
    map = map || new Map<Node, string>();
    eventContentChangeRef = newEventContentChange;
    _destroy();
    _updateElements();
  };

  if (eventContentChange) {
    _updateEventContentChange(eventContentChange);
  }

  return {
    _destroy,
    _updateElements,
    _updateEventContentChange,
  };
};

/**
 * Creates a DOM observer which observes DOM changes to either the target element or its children. (not only direct children but also nested ones)
 * @param target The element which shall be observed.
 * @param callback The callback which gets called if a change was detected.
 * @param options The options for DOM change detection.
 * @returns A object which represents the instance of the DOM observer.
 */
export const createDOMObserver = (
  target: HTMLElement,
  callback: (targetChangedAttrs: string[], targetStyleChanged: boolean, contentChanged: boolean) => any,
  options?: DOMObserverOptions
): DOMObserver => {
  let isConnected = false;
  const {
    _observeContent,
    _attributes,
    _styleChangingAttributes,
    _eventContentChange,
    _nestedTargetSelector,
    _ignoreTargetAttrChange: _ignoreTargetChange,
    _ignoreContentChange,
  } = options || {};
  const {
    _destroy: destroyEventContentChange,
    _updateElements: updateEventContentChangeElements,
    _updateEventContentChange: updateEventContentChange,
  } = createEventContentChange(
    target,
    _observeContent && _eventContentChange,
    debounce(() => {
      if (isConnected) {
        callback([], false, true);
      }
    }, 84)
  );

  // MutationObserver
  const finalAttributes = _attributes || [];
  const finalStyleChangingAttributes = _styleChangingAttributes || [];
  const observedAttributes = finalAttributes.concat(finalStyleChangingAttributes);
  const observerCallback = (mutations: MutationRecord[]) => {
    const ignoreTargetChange = _ignoreTargetChange || noop;
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
      const targetAttrChanged =
        attributeChanged &&
        targetIsMutationTarget &&
        !_observeContent &&
        !ignoreTargetChange(mutationTarget, attributeName!, oldValue, attributeValue as string | null);
      const styleChangingAttrChanged = indexOf(finalStyleChangingAttributes, attributeName) > -1 && attributeChanged;

      if (targetAttrChanged) {
        push(targetChangedAttrs, attributeName!);
      }
      if (_observeContent) {
        const notOnlyAttrChanged = !isAttributesType;
        const contentAttrChanged = isAttributesType && styleChangingAttrChanged && !targetIsMutationTarget;
        const isNestedTarget = contentAttrChanged && _nestedTargetSelector && is(mutationTarget, _nestedTargetSelector);
        const baseAssertion = isNestedTarget
          ? !ignoreTargetChange(mutationTarget, attributeName!, oldValue, attributeValue as string | null)
          : notOnlyAttrChanged || contentAttrChanged;
        const contentFinalChanged = baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);

        push(totalAddedNodes, addedNodes);

        contentChanged = contentChanged || contentFinalChanged;
        childListChanged = childListChanged || isChildListType;
      }
      targetStyleChanged = targetStyleChanged || (targetAttrChanged && styleChangingAttrChanged);
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
    if (!isEmptyArray(targetChangedAttrs) || targetStyleChanged || contentChanged) {
      callback(targetChangedAttrs, targetStyleChanged, contentChanged);
    }
  };
  const mutationObserver: MutationObserver = new MutationObserverConstructor!(observerCallback);

  // Connect
  mutationObserver.observe(target, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: observedAttributes,
    subtree: _observeContent,
    childList: _observeContent,
    characterData: _observeContent,
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
    _updateEventContentChange: (newEventContentChange?: DOMObserverEventContentChange) => {
      updateEventContentChange(isConnected && _observeContent && newEventContentChange);
    },
    _update: () => {
      if (isConnected) {
        observerCallback(mutationObserver.takeRecords());
      }
    },
  };
};
