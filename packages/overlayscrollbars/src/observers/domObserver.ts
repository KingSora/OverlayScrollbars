import { each, indexOf, isString, MutationObserverConstructor, isEmptyArray, on, off, attr, is, find } from 'support';

type StringNullUndefined = string | null | undefined;

export type DOMOvserverEventContentChangeResult = Array<[StringNullUndefined, StringNullUndefined] | null | undefined>; // [selector, eventname]
export type DOMOvserverEventContentChange = () => DOMOvserverEventContentChangeResult;
export type DOMObserverIgnoreContentChange = (
  mutation: MutationRecord,
  domObserverTarget: HTMLElement,
  domObserverOptions: DOMObserverOptions | undefined
) => boolean | null | undefined;
export interface DOMObserverOptions {
  _observeContent?: boolean;
  _attributes?: string[];
  _ignoreContentChange?: DOMObserverIgnoreContentChange;
  _eventContentChange?: DOMOvserverEventContentChange;
}
export interface DOMObserver {
  _disconnect: () => void;
  _update: () => void;
}

const styleChangingAttributes = ['id', 'class', 'style', 'open'];
const mutationObserverAttrsTextarea = ['wrap', 'cols', 'rows'];
const getAttributeChanged = (mutationTarget: Node, attributeName: string, oldValue: string | null): boolean =>
  oldValue !== attr(mutationTarget as HTMLElement, attributeName);

export const createDOMObserver = (
  target: HTMLElement,
  callback: (targetChangedAttrs: string[], targetStyleChanged: boolean, contentChanged: boolean) => any,
  options?: DOMObserverOptions
): DOMObserver => {
  let isConnected = false;
  const { _observeContent, _attributes, _ignoreContentChange, _eventContentChange } = options || {};
  const eventContentChangeCallback = () => {
    if (isConnected) {
      callback([], false, true);
    }
  };
  const refreshEventContentChange = (getElements: (selector: string) => Node[]) => {
    if (_eventContentChange) {
      const eventContentChanges = _eventContentChange();
      const eventElmList = eventContentChanges.reduce<Array<[string, Node[]]>>((arr, item) => {
        if (item) {
          const selector = item[0];
          const eventName = item[1];
          const elements = eventName && selector && getElements(selector);

          if (elements) {
            arr.push([eventName!, elements]);
          }
        }
        return arr;
      }, []);

      each(eventElmList, (item) => {
        const eventName = item[0];
        const elements = item[1];

        each(elements, (elm) => {
          off(elm, eventName, eventContentChangeCallback);
          on(elm, eventName, eventContentChangeCallback);
        });
      });
    }
  };

  // MutationObserver
  const observedAttributes = (_attributes || []).concat(styleChangingAttributes); // TODO: observer textarea attrs if textarea
  const observerCallback = (mutations: MutationRecord[]) => {
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
      const attributeChanged = isAttributesType && isString(attributeName) && getAttributeChanged(mutationTarget, attributeName!, oldValue);
      const targetAttrChanged = attributeChanged && targetIsMutationTarget && !_observeContent;
      const styleChangingAttrChanged = indexOf(styleChangingAttributes, attributeName) > -1 && attributeChanged;

      targetStyleChanged = targetStyleChanged || (targetAttrChanged && styleChangingAttrChanged);

      if (targetAttrChanged) {
        targetChangedAttrs.push(attributeName!);
      }
      if (_observeContent) {
        const notOnlyAttrChanged = !isAttributesType;
        const contentAttrChanged = isAttributesType && styleChangingAttrChanged && !targetIsMutationTarget;
        const contentFinalChanged =
          (notOnlyAttrChanged || contentAttrChanged) && (_ignoreContentChange ? !_ignoreContentChange(mutation, target, options) : _observeContent);

        each(addedNodes, (node) => {
          totalAddedNodes.push(node);
        });

        contentChanged = contentChanged || contentFinalChanged;
        childListChanged = childListChanged || isChildListType;
      }
    });

    if (childListChanged && !isEmptyArray(totalAddedNodes)) {
      refreshEventContentChange((selector) => totalAddedNodes.filter((node) => is(node as Element, selector)));
    }
    if (!isEmptyArray(targetChangedAttrs) || targetStyleChanged || contentChanged) {
      callback(targetChangedAttrs, targetStyleChanged, contentChanged);
    }
  };
  const mutationObserver: MutationObserver = new MutationObserverConstructor!(observerCallback);

  mutationObserver.observe(target, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: observedAttributes,
    subtree: _observeContent,
    childList: _observeContent,
    characterData: _observeContent,
  });

  isConnected = true;

  if (_observeContent) {
    refreshEventContentChange((selector) => find(selector, target) as Node[]);
  }

  return {
    _disconnect: () => {
      mutationObserver.disconnect();
      isConnected = false;
    },
    _update: () => {
      observerCallback(mutationObserver.takeRecords());
    },
  };
};
