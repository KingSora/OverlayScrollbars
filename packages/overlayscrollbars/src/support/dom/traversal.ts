import { isClient } from '~/support/compatibility/server';
import { isElement } from '~/support/utils/types';
import { push, from } from '~/support/utils/array';

type InputElementType = Node | Element | Node | false | null | undefined;
type OutputElementType = Node | Element | null;

const getElmPrototype = (isClient() && Element.prototype) as Element; // only Element.prototype wont work on server

/**
 * Find all elements with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
const find = (selector: string, elm?: InputElementType): Element[] => {
  const arr: Array<Element> = [];
  const rootElm = elm ? (isElement(elm) ? elm : null) : document;

  return rootElm ? push(arr, rootElm.querySelectorAll(selector)) : arr;
};

/**
 * Find the first element with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
const findFirst = (selector: string, elm?: InputElementType): OutputElementType => {
  const rootElm = elm ? (isElement(elm) ? elm : null) : document;

  return rootElm ? rootElm.querySelector(selector) : null;
};

/**
 * Determines whether the passed element is matching with the passed selector.
 * @param elm The element which has to be compared with the passed selector.
 * @param selector The selector which has to be compared with the passed element. Additional selectors: ':visible' and ':hidden'.
 */
const is = (elm: InputElementType, selector: string): boolean => {
  if (isElement(elm)) {
    /* istanbul ignore next */
    // eslint-disable-next-line
    const fn: (...args: any) => boolean =
      // @ts-ignore
      getElmPrototype.matches || getElmPrototype.msMatchesSelector;
    return fn.call(elm, selector);
  }
  return false;
};

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
const parent = (elm: InputElementType): OutputElementType => (elm ? elm.parentElement : null);

const closest = (elm: InputElementType, selector: string): OutputElementType => {
  if (isElement(elm)) {
    const closestFn = getElmPrototype.closest;
    if (closestFn) {
      return closestFn.call(elm, selector);
    }

    do {
      if (is(elm, selector)) {
        return elm as Element;
      }
      elm = parent(elm);
    } while (elm);
  }

  return null;
};

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
  const closestHighBoundaryElm = elm && closest(elm, highBoundarySelector);
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

export { find, findFirst, is, children, contents, parent, liesBetween, closest };
