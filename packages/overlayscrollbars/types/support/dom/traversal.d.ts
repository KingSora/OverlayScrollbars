declare type InputElementType = Element | Node | null | undefined;
declare type OutputElementType = Element | null;
/**
 * Find all elements with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
declare const find: (selector: string, elm?: InputElementType) => Element[];
/**
 * Find the first element with the passed selector, outgoing (and including) the passed element or the document if no element was provided.
 * @param selector The selector which has to be searched by.
 * @param elm The element from which the search shall be outgoing.
 */
declare const findFirst: (selector: string, elm?: InputElementType) => OutputElementType;
/**
 * Determines whether the passed element is matching with the passed selector.
 * @param elm The element which has to be compared with the passed selector.
 * @param selector The selector which has to be compared with the passed element. Additional selectors: ':visible' and ':hidden'.
 */
declare const is: (elm: InputElementType, selector: string) => boolean;
/**
 * Returns the children (no text-nodes or comments) of the passed element which are matching the passed selector. An empty array is returned if the passed element is null.
 * @param elm The element of which the children shall be returned.
 * @param selector The selector which must match with the children elements.
 */
declare const children: (elm: InputElementType, selector?: string | undefined) => ReadonlyArray<Element>;
/**
 * Returns the childNodes (incl. text-nodes or comments etc.) of the passed element. An empty array is returned if the passed element is null.
 * @param elm The element of which the childNodes shall be returned.
 */
declare const contents: (elm: InputElementType) => ReadonlyArray<ChildNode>;
/**
 * Returns the parent element of the passed element, or null if the passed element is null.
 * @param elm The element of which the parent element shall be returned.
 */
declare const parent: (elm: InputElementType) => OutputElementType;
/**
 * Determines whether the given element lies between two selectors in the DOM.
 * @param elm The element.
 * @param highBoundarySelector The high boundary selector.
 * @param deepBoundarySelector The deep boundary selector.
 */
declare const liesBetween: (elm: InputElementType, highBoundarySelector: string, deepBoundarySelector: string) => boolean;
export { find, findFirst, is, children, contents, parent, liesBetween };
