/**
 * Gets or sets a attribute with the given attribute of the given element depending whether the value attribute is given.
 * Returns null if the element has no attribute with the given name.
 * @param elm The element of which the attribute shall be get or set.
 * @param attrName The attribute name which shall be get or set.
 * @param value The value of the attribute which shall be set.
 */
export declare function attr(elm: HTMLElement | null, attrName: string): string | null;
export declare function attr(elm: HTMLElement | null, attrName: string, value: string): void;
/**
 * Removes the given attribute from the given element.
 * @param elm The element of which the attribute shall be removed.
 * @param attrName The attribute name.
 */
export declare const removeAttr: (elm: Element | null, attrName: string) => void;
/**
 * Gets or sets the scrollLeft value of the given element depending whether the value attribute is given.
 * @param elm The element of which the scrollLeft value shall be get or set.
 * @param value The scrollLeft value which shall be set.
 */
export declare function scrollLeft(elm: HTMLElement | null): number;
export declare function scrollLeft(elm: HTMLElement | null, value: number): void;
/**
 * Gets or sets the scrollTop value of the given element depending whether the value attribute is given.
 * @param elm The element of which the scrollTop value shall be get or set.
 * @param value The scrollTop value which shall be set.
 */
export declare function scrollTop(elm: HTMLElement | null): number;
export declare function scrollTop(elm: HTMLElement | null, value: number): void;
/**
 * Gets or sets the value of the given input element depending whether the value attribute is given.
 * @param elm The input element of which the value shall be get or set.
 * @param value The value which shall be set.
 */
export declare function val(elm: HTMLInputElement | null): string;
export declare function val(elm: HTMLInputElement | null, value: string): void;
