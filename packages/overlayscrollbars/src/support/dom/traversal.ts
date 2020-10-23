import { each, from } from 'support/utils/array';

/**
 * Find all elements with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
export const find = (selector: string, elm?: Element | null): ReadonlyArray<Element> => {
  const arr: Array<Element> = [];

  each((elm || document).querySelectorAll(selector), (e: Element) => {
    arr.push(e);
  });

  return arr;
};

/**
 * Find the first element with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
export const findFirst = (selector: string, elm?: Element | null): Element | null => (elm || document).querySelector(selector);

/**
 * Determines whether the passed element is matching with the passed selector.
 * @param elm The element which has to be compared with the passed selector.
 * @param selector The selector which has to be compared with the passed element. Additional selectors: ':visible' and ':hidden'.
 */
export const is = (elm: Element | null, selector: string): boolean => (elm ? elm.matches(selector) : false);

/**
 * Returns the children (no text-nodes or comments) of the passed element which are matching the passed selector. An empty array is returned if the passed element is null.
 * @param elm The element of which the children shall be returned.
 * @param selector The selector which must match with the children elements.
 */
export const children = (elm: Element | null, selector?: string): ReadonlyArray<Element> => {
  const childs: Array<Element> = [];

  each(elm && elm.children, (child: Element) => {
    if (selector) {
      if (child.matches(selector)) {
        childs.push(child);
      }
    } else {
      childs.push(child);
    }
  });

  return childs;
};

/**
 * Returns the childNodes (incl. text-nodes or comments etc.) of the passed element. An empty array is returned if the passed element is null.
 * @param elm The element of which the childNodes shall be returned.
 */
export const contents = (elm: Element | null): ReadonlyArray<ChildNode> => (elm ? from(elm.childNodes) : []);

/**
 * Returns the parent element of the passed element, or null if the passed element is null.
 * @param elm The element of which the parent element shall be returned.
 */
export const parent = (elm: Node | null): Node | null => (elm ? elm.parentElement : null);
