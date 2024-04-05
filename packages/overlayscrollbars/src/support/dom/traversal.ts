import { isElement } from '../utils/types';
import { push, from } from '../utils/array';

type InputElementType = Node | Element | false | null | undefined;
type OutputElementType = Node | Element | false | null | undefined;

/**
 * Find all elements with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
const find = (selector: string, elm?: InputElementType): Element[] => {
  const arr: Array<Element> = [];
  const rootElm = elm ? isElement(elm) && elm : document;

  return rootElm ? push(arr, rootElm.querySelectorAll(selector)) : arr;
};

/**
 * Find the first element with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
const findFirst = (selector: string, elm?: InputElementType): OutputElementType => {
  const rootElm = elm ? isElement(elm) && elm : document;

  return rootElm ? rootElm.querySelector(selector) : null;
};

/**
 * Determines whether the passed element is matching with the passed selector.
 * @param elm The element which has to be compared with the passed selector.
 * @param selector The selector which has to be compared with the passed element. Additional selectors: ':visible' and ':hidden'.
 */
const is = (elm: InputElementType, selector: string): boolean => {
  if (isElement(elm)) {
    return elm.matches(selector);
  }
  return false;
};

const isBodyElement = (elm: InputElementType) => is(elm, 'body'); // don't do targetElement === ownerDocument.body in case initialization happens in memory

/**
 * Returns the children (no text-nodes or comments) of the passed element which are matching the passed selector. An empty array is returned if the passed element is null.
 * @param elm The element of which the children shall be returned.
 * @param selector The selector which must match with the children elements.
 */
const children = (elm: InputElementType, selector?: string): ReadonlyArray<Element> => {
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
const contents = (elm: InputElementType): ReadonlyArray<ChildNode> =>
  elm ? from(elm.childNodes) : [];

/**
 * Returns the parent element of the passed element, or null if the passed element is null.
 * @param elm The element of which the parent element shall be returned.
 */
const parent = (elm: InputElementType): OutputElementType => elm && elm.parentElement;

/**
 * Returns the closest element to the passed element which matches the given selector.
 * @param elm The element.
 * @param selector The selector.
 * @returns The closest element to the passed element which matches the given selector.
 */
const closest = (elm: InputElementType, selector: string): OutputElementType =>
  isElement(elm) && elm.closest(selector);

/**
 * Gets the focused element of the passed or default document.
 * @returns The focused element of the passed document.
 */
const getFocusedElement = (doc?: Document) => (doc || document).activeElement;

/**
 * Determines whether the given element lies between two selectors in the DOM.
 * @param elm The element.
 * @param highBoundarySelector The high boundary selector.
 * @param deepBoundarySelector The deep boundary selector.
 */
const liesBetween = (
  elm: InputElementType,
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

export {
  find,
  findFirst,
  is,
  isBodyElement,
  children,
  contents,
  parent,
  liesBetween,
  closest,
  getFocusedElement,
};
