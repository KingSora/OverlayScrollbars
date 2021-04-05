export declare type PlainObject<T = any> = {
    [name: string]: T;
};
export declare type StyleObject<CustomCssProps = ''> = {
    [Key in (keyof CSSStyleDeclaration | (CustomCssProps extends string ? CustomCssProps : ''))]?: string | number;
};
export declare type InternalVersionOf<T> = {
    [K in keyof T as `_${Uncapitalize<string & K>}`]: T[K];
};
export declare type OSTargetElement = HTMLElement | HTMLTextAreaElement;
/**
 * Object for special initialization.
 *
 * Target is always required, if element is not provided or undefined it will be generated.
 *
 * If element is provided, the provided element takes all its responsibilities.
 * DOM hierarchy isn't checked in this case, its assumed that hieararchy is correct in such a case.
 *
 * Undefined means that the plugin decides whether the respective element needs to be added or can be savely omitted.
 * True means that even if the plugin would decide to not generate the element, the element is still generated.
 * False means that event if the plugin would decide to generate the element, the element won't be generated.
 */
export interface OSTargetObject {
    target: OSTargetElement;
    host?: HTMLElement;
    padding?: HTMLElement | boolean;
    viewport?: HTMLElement;
    content?: HTMLElement | boolean;
}
export declare type OSTarget = OSTargetElement | OSTargetObject;
