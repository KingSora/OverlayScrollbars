/**
 * Gets or sets a attribute with the given attribute of the given element depending whether the value attribute is given.
 * Returns null if the element has no attribute with the given name.
 * @param elm The element of which the attribute shall be get or set.
 * @param attrName The attribute name which shall be get or set.
 * @param value The value of the attribute which shall be set.
 */
export const attr: (elm: Element, attrName: string, value?: string) => string | null | void = (elm, attrName, value) => {
    if (value === undefined)
        return elm.getAttribute(attrName);
    elm.setAttribute(attrName, value);
}

/**
 * Removes the given attribute from the given element.
 * @param elm The element of which the attribute shall be removed.
 * @param attrName The attribute name.
 */
export const removeAttr: (elm: Element, attrName: string) => void = (elm, attrName) => {
    elm.removeAttribute(attrName);
}

/**
 * Gets or sets the scrollLeft value of the given element depending whether the value attribute is given.
 * @param elm The element of which the scrollLeft value shall be get or set.
 * @param value The scrollLeft value which shall be set.
 */
export const scrollLeft: (elm: HTMLElement, value?: number) => number | void = (elm, value) => {
    if (value === undefined)
        return elm.scrollLeft;
    elm.scrollLeft = value;
}

/**
 * Gets or sets the scrollTop value of the given element depending whether the value attribute is given.
 * @param elm The element of which the scrollTop value shall be get or set.
 * @param value The scrollTop value which shall be set.
 */
export const scrollTop: (elm: HTMLElement, value?: number) => number | void = (elm, value) => {
    if (value === undefined)
        return elm.scrollTop;
    elm.scrollTop = value;
}

/**
 * Gets or sets the value of the given input element depending whether the value attribute is given.
 * @param elm The input element of which the value shall be get or set.
 * @param value The value which shall be set.
 */
export const val: (elm: HTMLInputElement, value?: string) => string | void = (elm, value) => {
    if (value === undefined)
        return elm.value;
    elm.value = value;
}