import { each, indexOf, isString, MutationObserverConstructor, isEmptyArray, liesBetween } from 'support';
import { classNameHost, classNameContent } from 'classnames';

export interface DOMObserverOptions {
  _observeContent?: boolean;
  _attributes?: string[];
}
export interface DOMObserver {
  _disconnect: () => void;
  _update: () => void;
}

const styleChangingAttributes = ['id', 'class', 'style', 'open'];
const mutationObserverAttrsTextarea = ['wrap', 'cols', 'rows'];

const isUnknownMutation = (
  attributeName: string | null,
  type: MutationRecordType,
  observeContent?: boolean,
  target?: Node,
  mutationTarget?: Node
) => {
  const isAttributesType = type === 'attributes';
  const targetIsMutationTarget = target === mutationTarget;
  const styleChangingAttrChanged = indexOf(styleChangingAttributes, attributeName) > -1;
  const contentChanged = observeContent && !isAttributesType;
  const contentAttrChanged =
    observeContent &&
    isAttributesType &&
    styleChangingAttrChanged &&
    !targetIsMutationTarget &&
    !liesBetween(mutationTarget as Element | undefined, `.${classNameHost}`, `.${classNameContent}`);
  const targetAttrChanged = isAttributesType && styleChangingAttrChanged && targetIsMutationTarget && !observeContent;

  return contentChanged || contentAttrChanged || targetAttrChanged;
};

export const createDOMObserver = (
  target: HTMLElement,
  callback: (changedTargetAttrs: string[], styleChanged: boolean, contentChanged: boolean) => any,
  options?: DOMObserverOptions
): DOMObserver => {
  const { _observeContent, _attributes } = options || {};

  // MutationObserver
  const observedAttributes = (_attributes || []).concat(_observeContent ? styleChangingAttributes : mutationObserverAttrsTextarea);
  const observerCallback = (mutations: MutationRecord[]) => {
    let styleChanged = false;
    let contentChanged = false;
    const changedTargetAttrs: string[] = [];
    each(mutations, (mutation) => {
      const { attributeName, target: mutationTarget, type } = mutation;

      styleChanged = styleChanged || isUnknownMutation(attributeName, type);

      if (_observeContent) {
        contentChanged = contentChanged || isUnknownMutation(attributeName, type, true, target, mutationTarget);
      }
      if (isString(attributeName) && target === mutationTarget) {
        changedTargetAttrs.push(attributeName);
      }
    });

    if (!isEmptyArray(changedTargetAttrs) || styleChanged || contentChanged) {
      callback(changedTargetAttrs, styleChanged, contentChanged);
    }
  };
  const mutationObserver: MutationObserver = new MutationObserverConstructor!(observerCallback);

  const connect = () => {
    mutationObserver.observe(target, {
      attributes: true,
      attributeOldValue: true,
      subtree: _observeContent,
      childList: _observeContent,
      characterData: _observeContent,
      attributeFilter: observedAttributes,
    });
  };

  connect();

  return {
    _disconnect: mutationObserver.disconnect,
    _update: () => {
      observerCallback(mutationObserver.takeRecords());
    },
  };
};
