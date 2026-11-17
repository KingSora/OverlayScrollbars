/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  each,
  noop,
  MutationObserverConstructor,
  WeakRefConstructor,
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
type EventContentChangeElementRef = { deref: () => Node | undefined };
type EventContentChangeElementEntry = [
  ref: EventContentChangeElementRef,
  removeListeners: Record<string, () => void>,
];

const createElementRef = (elm: Node): EventContentChangeElementRef =>
  WeakRefConstructor ? new WeakRefConstructor(elm) : { deref: () => elm };

/**
 * Adds the event listener for the passed element and event names.
 * This is intentionally a separate function so the listener closure only captures the element, the event names and the callback.
 * (a closure created inside the element loop would also keep the whole list of found elements alive, including detached ones)
 * @param elm The element to which the listener shall be added.
 * @param eventNames The event names divided by whitespaces.
 * @param callback The callback which is called when one of the events is emitted.
 * @returns A function which removes the listener.
 */
const addEventContentChangeListener = (
  elm: Node,
  eventNames: string,
  callback: (...args: any) => any
) => addEventListener(elm, eventNames, (event: Event) => callback(event));

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
  const map = new WeakMap<Node, EventContentChangeElementEntry>();
  // weak references to all elements with listeners so destroy can remove every listener
  // elements which leave the target are removed as soon as the mutation observer reports their removal
  const refs = new Set<EventContentChangeElementRef>();
  const removeElementListeners = (elm: Node) => {
    const entry = map.get(elm);
    if (entry) {
      map.delete(elm);
      refs.delete(entry[0]);
      runEachAndClear(Object.values(entry[1]));
    }
  };
  const destroy = () => {
    refs.forEach((ref) => {
      const elm = ref.deref();
      if (elm) {
        removeElementListeners(elm);
      }
    });
    refs.clear();
  };
  const updateElements: EventContentChangeUpdateElement = (getElements) => {
    if (eventContentChange) {
      // remove the references of already gc'd elements
      refs.forEach((ref) => {
        if (!ref.deref()) {
          refs.delete(ref);
        }
      });

      each(eventContentChange, (item) => {
        const [selector, eventNames] = item || [];
        const elements = eventNames && selector ? (getElements || find)(selector, target) : [];

        each(elements, (elm) => {
          if (!target.contains(elm)) {
            removeElementListeners(elm);
            return;
          }

          let entry = map.get(elm);

          if (!entry) {
            entry = [createElementRef(elm), Object.create(null)];
            map.set(elm, entry);
            refs.add(entry[0]);
          }

          const removeListeners = entry[1];

          if (!removeListeners[eventNames!]) {
            removeListeners[eventNames!] = addEventContentChangeListener(
              elm,
              eventNames!,
              callback
            );
          }
        });
      });
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
  const [destroyEventContentChange, updateEventContentChangeElements] = createEventContentChange(
    target,
    () => isConnected && (callback as DOMContentObserverCallback)(true),
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
        return observerCallback(true, mutationObserver.takeRecords());
      }
    },
  ];
};
