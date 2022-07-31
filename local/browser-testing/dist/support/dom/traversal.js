import { isElement } from '../utils/types';
import { push, from } from '../utils/array';
const elmPrototype = Element.prototype;
/**
 * Find all elements with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
const find = (selector, elm) => {
    const arr = [];
    const rootElm = elm ? (isElement(elm) ? elm : null) : document;
    return rootElm ? push(arr, rootElm.querySelectorAll(selector)) : arr;
};
/**
 * Find the first element with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
const findFirst = (selector, elm) => {
    const rootElm = elm ? (isElement(elm) ? elm : null) : document;
    return rootElm ? rootElm.querySelector(selector) : null;
};
/**
 * Determines whether the passed element is matching with the passed selector.
 * @param elm The element which has to be compared with the passed selector.
 * @param selector The selector which has to be compared with the passed element. Additional selectors: ':visible' and ':hidden'.
 */
const is = (elm, selector) => {
    if (isElement(elm)) {
        /* istanbul ignore next */
        // eslint-disable-next-line
        // @ts-ignore
        const fn = elmPrototype.matches || elmPrototype.msMatchesSelector;
        return fn.call(elm, selector);
    }
    return false;
};
/**
 * Returns the children (no text-nodes or comments) of the passed element which are matching the passed selector. An empty array is returned if the passed element is null.
 * @param elm The element of which the children shall be returned.
 * @param selector The selector which must match with the children elements.
 */
const children = (elm, selector) => {
    const childs = [];
    return isElement(elm)
        ? push(childs, from(elm.children).filter((child) => (selector ? is(child, selector) : child)))
        : childs;
};
/**
 * Returns the childNodes (incl. text-nodes or comments etc.) of the passed element. An empty array is returned if the passed element is null.
 * @param elm The element of which the childNodes shall be returned.
 */
const contents = (elm) => elm ? from(elm.childNodes) : [];
/**
 * Returns the parent element of the passed element, or null if the passed element is null.
 * @param elm The element of which the parent element shall be returned.
 */
const parent = (elm) => (elm ? elm.parentElement : null);
const closest = (elm, selector) => {
    if (isElement(elm)) {
        const closestFn = elmPrototype.closest;
        if (closestFn) {
            return closestFn.call(elm, selector);
        }
        do {
            if (is(elm, selector)) {
                return elm;
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
const liesBetween = (elm, highBoundarySelector, deepBoundarySelector) => {
    const closestHighBoundaryElm = elm && closest(elm, highBoundarySelector);
    const closestDeepBoundaryElm = elm && findFirst(deepBoundarySelector, closestHighBoundaryElm);
    const deepBoundaryIsValid = closest(closestDeepBoundaryElm, highBoundarySelector) === closestHighBoundaryElm;
    return closestHighBoundaryElm && closestDeepBoundaryElm
        ? closestHighBoundaryElm === elm ||
            closestDeepBoundaryElm === elm ||
            (deepBoundaryIsValid &&
                closest(closest(elm, deepBoundarySelector), highBoundarySelector) !==
                    closestHighBoundaryElm)
        : false;
};
export { find, findFirst, is, children, contents, parent, liesBetween, closest };
//# sourceMappingURL=traversal.js.map