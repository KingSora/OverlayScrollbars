import type { NodeElementTarget } from './types';
import { isElement } from '../utils/types';
import { push, from } from '../utils/array';

/**
 * Find all elements with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
export const find = (selector: string, elm?: NodeElementTarget): Element[] => {
  const rootElm = elm ? isElement(elm) && elm : document;
  return rootElm ? from(rootElm.querySelectorAll(selector)) : [];
};

/**
 * Find the first element with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
export const findFirst = (selector: string, elm?: NodeElementTarget): NodeElementTarget => {
  const rootElm = elm ? isElement(elm) && elm : document;
  return rootElm && rootElm.querySelector(selector);
};

/**
 * Determines whether the passed element is matching with the passed selector.
 * @param elm The element which has to be compared with the passed selector.
 * @param selector The selector which has to be compared with the passed element. Additional selectors: ':visible' and ':hidden'.
 */
export const is = (elm: NodeElementTarget, selector: string): boolean =>
  isElement(elm) && elm.matches(selector);

export const isBodyElement = (elm: NodeElementTarget) => is(elm, 'body'); // don't do targetElement === ownerDocument.body in case initialization happens in memory

/**
 * Returns the children (no text-nodes or comments) of the passed element which are matching the passed selector. An empty array is returned if the passed element is null.
 * @param elm The element of which the children shall be returned.
 * @param selector The selector which must match with the children elements.
 */
export const children = (elm: NodeElementTarget, selector?: string): ReadonlyArray<Element> => {
  const childs: Array<Element> = [];

  return isElement(elm)
    ? push(
        childs,
        from(elm.children).filter((child) => (selector ? is(child, selector) : child))
      )
    : childs;
};

/**
 * Returns the childNodes (incl. text-nodes or comments etc.) of the passed element. An empty array is returned if the passed element is null.
 * @param elm The element of which the childNodes shall be returned.
 */
export const contents = (elm: NodeElementTarget): ReadonlyArray<ChildNode> =>
  elm ? from(elm.childNodes) : [];

/**
 * Returns the parent element of the passed element, or null if the passed element is null.
 * @param elm The element of which the parent element shall be returned.
 */
export const parent = (elm: NodeElementTarget): NodeElementTarget => elm && elm.parentElement;

/**
 * Returns the closest element to the passed element which matches the given selector.
 * @param elm The element.
 * @param selector The selector.
 * @returns The closest element to the passed element which matches the given selector.
 */
export const closest = (elm: NodeElementTarget, selector: string): NodeElementTarget =>
  isElement(elm) && elm.closest(selector);

/**
 * Gets the focused element of the passed or default document.
 * @returns The focused element of the passed document.
 */
export const getFocusedElement = (doc?: Document) => (doc || document).activeElement;

/**
 * Determines whether the given element lies between two selectors in the DOM.
 * @param elm The element.
 * @param highBoundarySelector The high boundary selector.
 * @param deepBoundarySelector The deep boundary selector.
 */
export const liesBetween = (
  elm: NodeElementTarget,
  highBoundarySelector: string,
  deepBoundarySelector: string
): boolean => {
  const closestHighBoundaryElm = closest(elm, highBoundarySelector);
  const closestDeepBoundaryElm = elm && findFirst(deepBoundarySelector, closestHighBoundaryElm);
  const deepBoundaryIsValid =
    closest(closestDeepBoundaryElm, highBoundarySelector) === closestHighBoundaryElm;

  return closestHighBoundaryElm && closestDeepBoundaryElm
    ? closestHighBoundaryElm === elm ||
        closestDeepBoundaryElm === elm ||
        (deepBoundaryIsValid &&
          closest(closest(elm, deepBoundarySelector), highBoundarySelector) !==
            closestHighBoundaryElm)
    : false;
};
